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
  async sendWelcomeEmail({ email, firstName, tempPassword, loginUrl }) {
    try {
      await strapi.plugin("email").service("email").send({
        to: email,
        from: process.env.DEFAULT_FROM_EMAIL || "no-reply@yourdomain.com",
        subject: "Welcome to your Insurance Vault! 🔐",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2>Welcome, ${firstName}!</h2>
            <p>Your motor insurance policy has been successfully generated.</p>
            <p>To make it easy for you to access, download, and manage your certificates at any time, we have automatically created a secure <strong>Customer Vault</strong> for you.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Your Login Credentials:</strong></p>
              <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></p>
            </div>

            <a href="${loginUrl}" style="display: inline-block; background-color: #2563eb; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
              Log in to your Vault
            </a>

            <p style="font-size: 14px; color: #666;"><em>Note: For your security, please change your password immediately after logging in.</em></p>
          </div>
        `,
      });
      strapi.log.info(`[Email Service] Welcome email sent to ${email}`);
    } catch (error) {
      strapi.log.error(`[Email Service] Failed to send welcome email to ${email}: ${error.message}`);
      throw error;
    }
  },
};