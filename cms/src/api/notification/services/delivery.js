"use strict";

module.exports = {
  async deliverCertificate(registration, certificateUrl) {
    const emailService = strapi.service("api::email.certificate-email");

    const result = await emailService.sendCertificate({
      registration,
      certificateUrl,
    });

    return result;
  },
};