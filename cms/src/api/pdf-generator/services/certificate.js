"use strict";

const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

module.exports = {
  async generateCertificate(data) {
    try {
      // 1. Fetch Template
      const templates = await strapi.entityService.findMany("api::certificate-template.certificate-template", {
        filters: { active: true },
        populate: ["background"],
      });

      if (!templates?.length || !templates[0].background) {
        throw new Error("Active certificate template or background missing");
      }

      const templatePath = path.join(process.cwd(), "public", templates[0].background.url);
      const existingPdfBytes = fs.readFileSync(templatePath);

      // 2. Load PDF
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize(); // Added missing width
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // 3. Data Preparation
      const registration = data.registration;
      const insuredName = registration.policyHolderFirstName 
        ? `${registration.policyHolderFirstName} ${registration.policyHolderMiddleName || ""} ${registration.policyHolderLastName}`.trim()
        : (registration.companyPolicyHolderName || registration.companyName || "");

      const registrationNumber = registration.registrationNumber || `${registration.plateFirst || ""}${registration.plateMiddle || ""}${registration.plateLast || ""}`;

      // 4. Draw Content
      const drawSettings = { size: 12, font, color: rgb(0, 0, 0) };
      const startX = 180;
      
      const fields = [
        { text: insuredName, y: height - 250 },
        { text: data.policyNumber, y: height - 280 },
        { text: data.certificateNumber, y: height - 310 },
        { text: registrationNumber, y: height - 340 },
        { text: registration.vehicleMake || "", y: height - 370 },
        { text: registration.vehicleModel || "", y: height - 400 },
        { text: registration.coverType || "", y: height - 430 },
        { text: `₦${Number(registration.sumAssured || 0).toLocaleString()}`, y: height - 460 },
        { text: new Date().toLocaleDateString(), y: height - 490 },
      ];

      fields.forEach(f => page.drawText(f.text, { x: startX, y: f.y, ...drawSettings }));

      // 5. QR Code Generation
      const verificationUrl = `${process.env.FRONTEND_URL}/verify/${data.certificateNumber}`;
      const qrImageBuffer = await QRCode.toBuffer(verificationUrl, { width: 120, margin: 1 });
      const qrImage = await pdfDoc.embedPng(qrImageBuffer);

      page.drawImage(qrImage, {
        x: width - 150,
        y: 80,
        width: 100,
        height: 100,
      });
      
      // 6. Save PDF
      const pdfBytes = await pdfDoc.save();
      const uploadDir = path.join(process.cwd(), "public", "certificates");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `${data.certificateNumber}.pdf`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, pdfBytes);

      return {
        success: true,
        certificateUrl: `${process.env.STRAPI_URL}/certificates/${fileName}`,
      };
    } catch (error) {
      strapi.log.error(`[PDF Service] Generation failed: ${error.message}`);
      throw error; // Rethrow so the Processor knows to mark as failed
    }
  },
};