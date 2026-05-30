"use strict";

const QRCode = require("qrcode");

module.exports = {
  async generateVerificationQR(certificateNumber) {
    try {
      const baseUrl = process.env.FRONTEND_URL;

      const verificationUrl =
        `${baseUrl}/verify/${certificateNumber}`;

      const qrBuffer = await QRCode.toBuffer(
        verificationUrl,
        {
          type: "png",
          width: 250,
          margin: 2,
        }
      );

      return {
        qrBuffer,
        verificationUrl,
      };
    } catch (error) {
      strapi.log.error("QR GENERATION ERROR:", error);
      throw error;
    }
  },
};