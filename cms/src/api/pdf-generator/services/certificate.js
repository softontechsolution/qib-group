"use strict";

const QRCode = require("qrcode");

const fs = require("fs");
const path = require("path");

const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

module.exports = {
  async generateCertificate(data) {
    try {
      // =====================================================
      // STEP 1 — GET ACTIVE TEMPLATE
      // =====================================================

      const templates =
        await strapi.entityService.findMany(
          "api::certificate-template.certificate-template",
          {
            filters: { active: true },
            populate: ["background"],
          }
        );

      if (!templates.length) {
        throw new Error("No active certificate template found");
      }

      const template = templates[0];

      if (!template.background) {
        throw new Error("Certificate background missing");
      }

      const templatePath = path.join(
        process.cwd(),
        "public",
        template.background.url
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error("Template PDF file does not exist");
      }

      const existingPdfBytes = fs.readFileSync(templatePath);

      // =====================================================
      // STEP 2 — LOAD PDF
      // =====================================================

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page = pages[0];

      const { height } = page.getSize();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const registration = data.registration;

      // =====================================================
      // STEP 3 — INSURED NAME (FIXED LOGIC)
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
      // STEP 4 — REGISTRATION NUMBER (FIXED)
      // =====================================================

      const registrationNumber =
        registration.registrationNumber ||
        `${registration.plateFirst || ""}${registration.plateMiddle || ""}${registration.plateLast || ""}`;

      // =====================================================
      // STEP 5 — DRAW DATA ON LETTERHEAD
      // =====================================================

      page.drawText(insuredName, {
        x: 180,
        y: height - 250,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(data.policyNumber, {
        x: 180,
        y: height - 280,
        size: 12,
        font,
      });

      page.drawText(data.certificateNumber, {
        x: 180,
        y: height - 310,
        size: 12,
        font,
      });

      page.drawText(registrationNumber, {
        x: 180,
        y: height - 340,
        size: 12,
        font,
      });

      page.drawText(registration.vehicleMake || "", {
        x: 180,
        y: height - 370,
        size: 12,
        font,
      });

      page.drawText(registration.vehicleModel || "", {
        x: 180,
        y: height - 400,
        size: 12,
        font,
      });

      page.drawText(registration.coverType || "", {
        x: 180,
        y: height - 430,
        size: 12,
        font,
      });

      page.drawText(
        `₦${Number(registration.sumAssured || 0).toLocaleString()}`,
        {
          x: 180,
          y: height - 460,
          size: 12,
          font,
        }
      );

      // =====================================================
      // STEP 6 — ISSUE DATE (SAFE STANDARDIZED FIELD)
      // =====================================================

      const issueDate = new Date().toLocaleDateString();

      page.drawText(issueDate, {
        x: 180,
        y: height - 490,
        size: 12,
        font,
      });

      const frontendUrl = process.env.FRONTEND_URL;

      const verificationUrl =
        `${frontendUrl}/verify/${data.certificateNumber}`;

      const qrImageBuffer = await QRCode.toBuffer(
        verificationUrl,
        {
          width: 120,
          margin: 1,
        }
      );

      const qrImage = await pdfDoc.embedPng(qrImageBuffer);

      const qrDims = qrImage.scale(1);

      page.drawImage(qrImage, {
        x: width - 150,
        y: 80,
        width: 100,
        height: 100,
      });
      
      // =====================================================
      // STEP 7 — SAVE PDF
      // =====================================================

      const pdfBytes = await pdfDoc.save();

      const uploadDir = path.join(process.cwd(), "public", "certificates");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${data.certificateNumber}.pdf`;

      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, pdfBytes);

      // =====================================================
      // STEP 8 — PUBLIC URL
      // =====================================================

      const certificateUrl = `${process.env.STRAPI_URL}/certificates/${fileName}`;

      // =====================================================
      // STEP 9 — RETURN
      // =====================================================

      return {
        success: true,
        fileName,
        filePath,
        certificateUrl,
      };
    } catch (error) {
      console.error("PDF GENERATION ERROR:", error);
      throw error;
    }
  },
};