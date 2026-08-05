// cms/src/templates/emails/policyRenewal.js

/**
 * Generates an HTML email template for policy renewal reminders.
 *
 * @param {Object} params
 * @param {string} params.policyNumber - The customer's policy registration number
 * @param {string|Date} params.expiryDate - The calculated expiration date
 * @returns {string} Clean HTML string for email dispatch
 */
module.exports = function getPolicyRenewalTemplate({ policyNumber, expiryDate }) {
  const formattedDate = new Date(expiryDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Policy Renewal Notice</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
        <h2 style="color: #0f172a; margin-top: 0;">Motor Insurance Renewal Reminder</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hello,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">
          This is a friendly reminder that your motor insurance policy 
          <strong style="color: #059669;">${policyNumber || 'N/A'}</strong> is set to expire on 
          <strong>${formattedDate}</strong>.
        </p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">
          To avoid any lapse in active road coverage or NPF verification clearance, please log in to your account and renew your policy before the expiration date.
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.PUBLIC_SERVER_URL || 'http://localhost:3000'}" 
             style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
            Renew Policy Now
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">
          QIB Group Insurance • All Rights Reserved
        </p>
      </div>
    </body>
    </html>
  `;
};