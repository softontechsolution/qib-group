"use strict";

const { ValidationError } = require("@strapi/utils").errors;

module.exports = {
  async firstLoginPasswordChange(ctx) {
    const body = ctx.request.body || {};
    const { email, temporaryPassword, newPassword, passwordConfirmation } =
      body;

    // Validate all required fields before attempting account lookup.
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

    // Apply a minimum password length and basic character requirements.
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
        "Choose a password different from your temporary password.",
      );
    }

    // Only accounts explicitly marked for a first-login password change qualify.
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          email: normalizedEmail,
          provider: "local",
        },
        select: ["id", "password", "blocked", "mustChangePassword"],
      });

    // Use a generic response for missing or ineligible accounts.
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
    const userService = strapi.plugin("users-permissions").service("user");
    const passwordIsValid = await userService.validatePassword(
      temporaryPassword,
      user.password,
    );

    if (!passwordIsValid) {
      throw new ValidationError(
        "Unable to complete the password change. Check your details or use password recovery.",
      );
    }

    // Let Strapi hash the replacement password and clear the flag in the same update.
    await userService.edit(user.id, {
      password: newPassword,
      mustChangePassword: false,
      resetPasswordToken: null,
    });

    // Require a separate normal login; do not issue a JWT from this public endpoint.
    ctx.send({ ok: true });
  },

  /**
   * Return insurance records belonging to the authenticated customer.
   *
   * Identity comes from Strapi's validated JWT, not from a user ID
   * submitted by the browser. Query Engine is used internally so these
   * filters do not go through the failing public REST query validator.
   */
  async vault(ctx) {
    const authenticatedUser = ctx.state.user;

    if (!authenticatedUser?.id) {
      return ctx.unauthorized("Please sign in to access your vault.");
    }

    const email = String(authenticatedUser.email || "").trim();

    try {
      const policies = await strapi.db
        .query("api::motor-insurance-registration.motor-insurance-registration")
        .findMany({
          where: {
            $or: [
              // Preferred ownership check: the saved user relationship.
              { user: { id: authenticatedUser.id } },

              // Fallbacks for older registrations without a saved relationship.
              ...(email
                ? [
                    { email: { $eqi: email } },
                    { policyEmail: { $eqi: email } },
                    { companyEmail: { $eqi: email } },
                  ]
                : []),
            ],
          },
          orderBy: { createdAt: "desc" },
        });

      const claims = await strapi.db.query("api::claim.claim").findMany({
        where: {
          $or: [
            // Preferred ownership check: the saved user relationship.
            { user: { id: authenticatedUser.id } },

            // Recover older claims linked by the customer's email.
            ...(email ? [{ email: { $eqi: email } }] : []),
          ],
        },
        // Populate only the claim attachments, not the related user record.
        populate: ["claimForm", "evidence"],
        orderBy: { createdAt: "desc" },
      });

      ctx.body = { policies, claims };
    } catch (error) {
      strapi.log.error(
        "Unable to retrieve the authenticated customer's vault.",
        error,
      );

      return ctx.internalServerError("Unable to load your insurance records.");
    }
  },
};
