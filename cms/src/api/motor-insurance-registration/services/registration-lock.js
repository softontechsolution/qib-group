"use strict";

module.exports = {
  async acquireLock(registrationId) {
    const registration = await strapi.db
      .query("api::motor-insurance-registration.motor-insurance-registration")
      .findOne({
        where: { id: registrationId },
      });

    if (!registration) {
      throw new Error("Registration not found");
    }

    // 🔒 If already processed → STOP (IDEMPOTENCY)
    if (registration.paymentProcessed) {
      return { locked: false };
    }

    // 🔒 Mark as processing immediately (prevents race condition)
    await strapi.db
      .query("api::motor-insurance-registration.motor-insurance-registration")
      .update({
        where: { id: registrationId },
        data: {
          paymentProcessed: true,
        },
      });

    return { locked: true, registration };
  },
};