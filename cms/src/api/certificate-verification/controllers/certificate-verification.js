"use strict";

module.exports = {
  async verify(ctx) {
    const { certificateNumber } = ctx.params;

    const record = await strapi.db
      .query(
        "api::motor-insurance-registration.motor-insurance-registration"
      )
      .findOne({
        where: {
          certificateNumber,
        },
      });

    if (!record) {
      return ctx.notFound("Certificate not found");
    }

    return {
      valid: true,
      policyStatus: record.policyStatus,
      paymentStatus: record.paymentStatus,
      insuredName:
        record.policyHolderFirstName ||
        record.companyPolicyHolderName,
      vehicleMake: record.vehicleMake,
      vehicleModel: record.vehicleModel,
      certificateNumber: record.certificateNumber,
      policyNumber: record.policyNumber,
      registrationNumber: record.registrationNumber,
      issuedOn: record.paymentDate,
    };
  },
};