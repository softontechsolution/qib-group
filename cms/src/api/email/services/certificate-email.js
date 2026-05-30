"use strict";

module.exports = {
  async sendCertificate(data) {
    try {
      const registration = data.registration;

      // =====================================================
      // STEP 1 — DETERMINE RECIPIENT EMAIL (FIXED)
      // =====================================================

      const recipient =
        registration.email ||
        registration.policyEmail ||
        registration.companyEmail;

      if (!recipient) {
        throw new Error("No valid email found for recipient");
      }

      // =====================================================
      // STEP 2 — BUILD INSURED NAME (FIXED FOR BOTH TYPES)
      // =====================================================

      let insuredName = "";

      if (registration.policyHolderFirstName) {
        insuredName = [
          registration.policyHolderFirstName,
          registration.policyHolderMiddleName,
          registration.policyHolderLastName,
        ]
          .filter(Boolean)
          .join(" ");
      } else {
        insuredName =
          registration.companyPolicyHolderName ||
          registration.companyName ||
          `${registration.firstName || ""} ${registration.lastName || ""}`.trim();
      }

      // =====================================================
      // STEP 3 — SEND EMAIL
      // =====================================================

      await strapi.plugin("email").service("email").send({
        to: recipient,

        subject: "Motor Insurance Certificate",

        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            
            <h2>Motor Insurance Certificate</h2>

            <p>Dear ${insuredName},</p>

            <p>
              Your motor insurance certificate has been successfully generated and is now active.
            </p>

            <hr />

            <p>
              <strong>Policy Number:</strong><br/>
              ${data.policyNumber}
            </p>

            <p>
              <strong>Certificate Number:</strong><br/>
              ${data.certificateNumber}
            </p>

            <p>
              <strong>Status:</strong> Active
            </p>

            <br />

            <p>
              You can download your certificate using the link below:
            </p>

            <p>
              <a href="${data.certificateUrl}" target="_blank">
                Download Insurance Certificate
              </a>
            </p>

            <br />

            <p style="font-size: 12px; color: #777;">
              If you did not request this policy, please contact support immediately.
            </p>

          </div>
        `,
      });

      // =====================================================
      // STEP 4 — SUCCESS RESPONSE
      // =====================================================

      return {
        success: true,
        sentTo: recipient,
      };

    } catch (error) {
      console.error("EMAIL SERVICE ERROR:", error);
      throw error;
    }
  },
};