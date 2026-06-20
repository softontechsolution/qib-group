"use strict";

const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");

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

      // 2. Load PDF and Register Fontkit
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit); 

      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize(); 

      // 3. Load and Embed Custom Font
      const fontPath = path.join(process.cwd(), "src", "fonts", "Roboto-Regular.ttf");
      if (!fs.existsSync(fontPath)) {
        throw new Error(`Custom font file missing at path: ${fontPath}`);
      }
      const fontBytes = fs.readFileSync(fontPath);
      const customFont = await pdfDoc.embedFont(fontBytes); 

      // 4. Data Preparation & Cleaning
      const registration = data.registration || {};
      const insuredName = registration.policyHolderFirstName 
        ? `${registration.policyHolderFirstName} ${registration.policyHolderMiddleName || ""} ${registration.policyHolderLastName}`.trim()
        : (registration.companyPolicyHolderName || registration.companyName || "");

      const registrationNumber = registration.registrationNumber || `${registration.plateFirst || ""}${registration.plateMiddle || ""}${registration.plateLast || ""}`;

      // Extract and sanitize numbers, removing any '[object Object]' noise
      let displayCertNumber = String(data.certificateNumber || `CERT/${registration.id}`);
      let displayPolicyNumber = String(data.policyNumber || `POL/${registration.id}`);

      if (displayCertNumber.includes("[object Object]")) {
        displayCertNumber = displayCertNumber.replace("[object Object]", `/${registration.id || "01"}`);
      }
      if (displayPolicyNumber.includes("[object Object]")) {
        displayPolicyNumber = displayPolicyNumber.replace("[object Object]", `/${registration.id || "01"}`);
      }

      // 5. Draw Content (Slashes appear perfectly on the PDF)
      const drawSettings = { size: 12, font: customFont, color: rgb(0, 0, 0) };
      const startX = 180;
      
      const fields = [
        { text: insuredName, y: height - 250 },
        { text: displayPolicyNumber, y: height - 280 }, 
        { text: displayCertNumber, y: height - 310 },   
        { text: registrationNumber, y: height - 340 },
        { text: registration.vehicleMake || "", y: height - 370 },
        { text: registration.vehicleModel || "", y: height - 400 },
        { text: registration.coverType || "", y: height - 430 },
        { text: `₦${Number(registration.sumAssured || 0).toLocaleString()}`, y: height - 460 },
        { text: new Date().toLocaleDateString(), y: height - 490 },
      ];

      fields.forEach(f => page.drawText(f.text, { x: startX, y: f.y, ...drawSettings }));

      // 6. QR Code Generation
      const verificationUrl = `${process.env.FRONTEND_URL}/verify/${encodeURIComponent(displayCertNumber)}`;
      const qrImageBuffer = await QRCode.toBuffer(verificationUrl, { width: 120, margin: 1 });
      const qrImage = await pdfDoc.embedPng(qrImageBuffer);

      page.drawImage(qrImage, {
        x: width - 150,
        y: 80,
        width: 100,
        height: 100,
      });
      
      // 7. Storage Layer: Save PDF safely using OS-friendly filenames
      const uploadDir = path.join(process.cwd(), "public", "certificates");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      // 🔄 Convert slashes to dashes ONLY for the physical hard-drive file name
      const safeFileName = `${displayCertNumber.replace(/\//g, "-")}.pdf`;
      const filePath = path.join(uploadDir, safeFileName);
      
      // ✅ THE FIX: Compiling the document modifications back into raw bytes
      const pdfBytes = await pdfDoc.save();
      
      fs.writeFileSync(filePath, pdfBytes);

      return {
        success: true,
        certificateUrl: `${process.env.STRAPI_URL}/certificates/${safeFileName}`,
      };
    } catch (error) {
      strapi.log.error(`[PDF Service] Generation failed: ${error.message}`);
      throw error; 
    }
  },
};