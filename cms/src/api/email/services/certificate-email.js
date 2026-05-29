"use strict";

module.exports = {
  async sendCertificate(data) {
    try {
      await strapi
        .plugin("email")
        .service("email")
        .send({
          to: data.registration.email,

          subject:
            "Motor Insurance Certificate",

          html: `
            <h2>Motor Insurance Certificate</h2>

            <p>
              Dear ${data.registration.firstName},
            </p>

            <p>
              Your insurance certificate has been generated successfully.
            </p>

            <p>
              <strong>Policy Number:</strong>
              ${data.policyNumber}
            </p>

            <p>
              <strong>Certificate Number:</strong>
              ${data.certificateNumber}
            </p>

            <p>
              <a href="${data.certificateUrl}">
                Download Certificate
              </a>
            </p>
          `,
        });

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "EMAIL SERVICE ERROR:",
        error
      );

      throw error;
    }
  },
};