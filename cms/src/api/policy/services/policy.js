"use strict";

module.exports = {
  async generatePolicy(registration) {
    // 🔒 PREVENT DOUBLE GENERATION
    if (registration.policyNumber && registration.certificateNumber) {
      return {
        policyNumber: registration.policyNumber,
        certificateNumber: registration.certificateNumber,
      };
    }

    const counter = await strapi
      .service("api::system-counter.system-counter")
      .getNextCounter();

    const id = counter.value;

    const policyNumber = `${counter.prefix}${id}`;
    const certificateNumber = `${counter.certificatePrefix}${id}`;

    await strapi.db
      .query("api::motor-insurance-registration.motor-insurance-registration")
      .update({
        where: { id: registration.id },
        data: {
          policyNumber,
          certificateNumber,
        },
      });

    return { policyNumber, certificateNumber };
  },
};