"use strict";

module.exports = {
  async sendCertificate(data) {
    try {
      const registration = data.registration;

      // =====================================================
      // STEP 1 — DETERMINE RECIPIENT EMAIL
      // =====================================================
      const recipient =
        registration.email ||
        registration.policyEmail ||
        registration.companyEmail;

      if (!recipient) {
        throw new Error("No valid email found for recipient");
      }

      // =====================================================
      // STEP 2 — BUILD INSURED NAME
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
      // STEP 3 — SEND EMAIL WITH LIVE LIFECYCLE LOGS
      // =====================================================
      strapi.log.info(`[Email Service] Attempting to dispatch certificate email to: ${recipient}...`);

      const emailPayload = {
        to: recipient,
        subject: `Motor Insurance Certificate - ${data.policyNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0;">
            <h2 style="color: #1a365d;">Motor Insurance Certificate Generated</h2>
            <p>Dear <strong>${insuredName}</strong>,</p>
            <p>Your motor insurance certificate has been successfully generated and is now active.</p>
            
            <div style="background-color: #f7fafc; padding: 15px; border-left: 4px solid #3182ce; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Policy Number:</strong> ${data.policyNumber}</p>
              <p style="margin: 0 0 10px 0;"><strong>Certificate Number:</strong> ${data.certificateNumber}</p>
              <p style="margin: 0;"><strong>Status:</strong> <span style="color: #38a169; font-weight: bold;">Active</span></p>
            </div>

            <p>You can instantly view or download your official certificate using the link below:</p>
            <p style="margin: 25px 0;">
              <a href="${data.certificateUrl}" target="_blank" style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Download Insurance Certificate
              </a>
            </p>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #a0aec0; line-height: 1.4;">
              This is an automated operational email regarding your active insurance policy setup. If you did not request this insurance coverage policy, please contact our support desk immediately.
            </p>
          </div>
        `,
      };

      await strapi.plugin("email").service("email").send(emailPayload);

      // 🎉 SUCCESS LOG: Confirms your SMTP configuration accepted and routed the email
      strapi.log.info(`[Email Service] EMAIL SENT SUCCESSFULLY to ${recipient} for Policy: ${data.policyNumber}`);

      // =====================================================
      // STEP 4 — SUCCESS RESPONSE
      // =====================================================
      return {
        success: true,
        sentTo: recipient,
      };

    } catch (error) {
      // Custom log layout to capture SMTP/Nodemailer handshake issues (like wrong ports or passwords)
      strapi.log.error(`[Email Service] CRITICAL DELIVERY FAILURE for ${data.policyNumber}: ${error.message || error}`);
      throw error;
    }
  },
};