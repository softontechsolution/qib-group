"use strict";

const { ValidationError } = require("@strapi/utils").errors;

// Extend the existing plugin while preserving Strapi's normal authentication.
module.exports = (plugin) => {
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async function (ctx) {
    const provider = ctx.params.provider || "local";

    // Block normal local login for accounts that still require a password change.
    if (provider === "local") {
      const body = ctx.request.body || {};
      const identifier = body.identifier || body.email;

      if (typeof identifier === "string" && identifier.trim()) {
        const normalizedIdentifier = identifier.trim();

        const user = await strapi.db
          .query("plugin::users-permissions.user")
          .findOne({
            where: {
              provider: "local",
              $or: [
                { email: normalizedIdentifier.toLowerCase() },
                { username: normalizedIdentifier },
              ],
            },
            select: ["id", "mustChangePassword"],
          });

        if (user?.mustChangePassword === true) {
          // Never issue a normal JWT before the required password change.
          throw new ValidationError(
            "A password change is required before you can sign in.",
          );
        }
      }
    }

    // Keep Strapi's original validation, password checks, and token handling.
    return originalCallback.call(this, ctx);
  };

  // Add a dedicated endpoint for customers signing in with temporary passwords.
  plugin.controllers.auth.firstLoginPasswordChange = async (ctx) => {
    const body = ctx.request.body || {};
    const { email, temporaryPassword, newPassword, passwordConfirmation } =
      body;

    // Validate request fields before querying or changing an account.
    if (
      typeof email !== "string" ||
      typeof temporaryPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof passwordConfirmation !== "string"
    ) {
      throw new ValidationError("Please provide all required fields.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      throw new ValidationError("Please enter a valid email address.");
    }

    // Require a strong replacement password and matching confirmation.
    if (
      newPassword.length < 12 ||
      newPassword.length > 128 ||
      !/[a-z]/.test(newPassword) ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      throw new ValidationError(
        "Your new password must be at least 12 characters and include uppercase, lowercase, and numeric characters.",
      );
    }

    if (newPassword !== passwordConfirmation) {
      throw new ValidationError("The new passwords do not match.");
    }

    if (newPassword === temporaryPassword) {
      throw new ValidationError(
        "Choose a new password different from your temporary password.",
      );
    }

    // Only allow this flow for an existing local account marked for first-login change.
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email: normalizedEmail,
          provider: "local",
        },
        select: [
          "id",
          "password",
          "blocked",
          "confirmed",
          "mustChangePassword",
        ],
      });

    // Use a generic error so the endpoint does not disclose account existence.
    if (
      !user ||
      !user.password ||
      user.blocked ||
      user.mustChangePassword !== true
    ) {
      throw new ValidationError(
        "Unable to complete the password change. Check your details or use password recovery.",
      );
    }

    // Validate the temporary password with Strapi's existing password service.
    const validTemporaryPassword = await strapi
      .plugin("users-permissions")
      .service("user")
      .validatePassword(temporaryPassword, user.password);

    if (!validTemporaryPassword) {
      throw new ValidationError(
        "Unable to complete the password change. Check your details or use password recovery.",
      );
    }

    // Strapi's user service handles password hashing. Clear the first-login
    // flag in the same user update as the password replacement.
    await strapi.plugin("users-permissions").service("user").edit(user.id, {
      password: newPassword,
      mustChangePassword: false,
      resetPasswordToken: null,
    });

    // Do not issue a JWT here. The customer must authenticate through the
    // existing NextAuth credentials flow after the password has been changed.
    ctx.send({ ok: true });
  };

  return plugin;
};
