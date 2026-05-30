"use strict";

module.exports = {
  async reissue(registrationId) {
    const registration = await strapi.db
      .query(
        "api::motor-insurance-registration.motor-insurance-registration"
      )
      .findOne({
        where: {
          id: registrationId,
        },
      });

    if (!registration) {
      throw new Error(
        "Registration not found"
      );
    }

    if (
      registration.paymentStatus !== "paid"
    ) {
      throw new Error(
        "Policy not paid"
      );
    }

    await strapi
      .service(
        "api::certificate-processor.processor"
      )
      .run(registrationId, {
        policyNumber:
          registration.policyNumber,

        certificateNumber:
          registration.certificateNumber,
      });

    return {
      success: true,
      message:
        "Certificate regenerated successfully",
    };
  },
};