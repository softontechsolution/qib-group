"use strict";

const fs = require("fs");
const path = require("path");

const {
  PDFDocument,
  rgb,
  StandardFonts,
} = require("pdf-lib");

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
            filters: {
              active: true,
            },

            populate: ["background"],
          }
        );

      if (!templates.length) {
        throw new Error(
          "No active certificate template found"
        );
      }

      const template = templates[0];

      // =====================================================
      // STEP 2 — VALIDATE BACKGROUND FILE
      // =====================================================

      if (!template.background) {
        throw new Error(
          "Certificate background missing"
        );
      }

      // =====================================================
      // STEP 3 — LOAD TEMPLATE PDF
      // =====================================================

      const templatePath = path.join(
        process.cwd(),
        "public",
        template.background.url
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(
          "Template PDF file does not exist"
        );
      }

      const existingPdfBytes =
        fs.readFileSync(templatePath);

      // =====================================================
      // STEP 4 — LOAD PDF DOCUMENT
      // =====================================================

      const pdfDoc =
        await PDFDocument.load(existingPdfBytes);

      const pages = pdfDoc.getPages();

      const firstPage = pages[0];

      const { width, height } =
        firstPage.getSize();

      // =====================================================
      // STEP 5 — LOAD FONT
      // =====================================================

      const font =
        await pdfDoc.embedFont(
          StandardFonts.Helvetica
        );

      // =====================================================
      // STEP 6 — DRAW CUSTOMER DATA
      // =====================================================

      firstPage.drawText(
        `${data.registration.firstName} ${data.registration.lastName}`,
        {
          x: 180,
          y: height - 250,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        }
      );

      // POLICY NUMBER
      firstPage.drawText(
        data.policyNumber,
        {
          x: 180,
          y: height - 280,
          size: 12,
          font,
        }
      );

      // CERTIFICATE NUMBER
      firstPage.drawText(
        data.certificateNumber,
        {
          x: 180,
          y: height - 310,
          size: 12,
          font,
        }
      );

      // VEHICLE MAKE
      firstPage.drawText(
        data.registration.vehicleMake || "",
        {
          x: 180,
          y: height - 340,
          size: 12,
          font,
        }
      );

      // VEHICLE MODEL
      firstPage.drawText(
        data.registration.vehicleModel || "",
        {
          x: 180,
          y: height - 370,
          size: 12,
          font,
        }
      );

      // REGISTRATION NUMBER
      firstPage.drawText(
        data.registration.registrationNumber ||
          "",
        {
          x: 180,
          y: height - 400,
          size: 12,
          font,
        }
      );

      // COVER TYPE
      firstPage.drawText(
        data.registration.coverType || "",
        {
          x: 180,
          y: height - 430,
          size: 12,
          font,
        }
      );

      // SUM ASSURED
      firstPage.drawText(
        `₦${Number(
          data.registration.sumAssured || 0
        ).toLocaleString()}`,
        {
          x: 180,
          y: height - 460,
          size: 12,
          font,
        }
      );

      // ISSUE DATE
      firstPage.drawText(
        new Date().toLocaleDateString(),
        {
          x: 180,
          y: height - 490,
          size: 12,
          font,
        }
      );

      // =====================================================
      // STEP 7 — SAVE GENERATED PDF
      // =====================================================

      const pdfBytes =
        await pdfDoc.save();

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "certificates"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
          recursive: true,
        });
      }

      const fileName =
        `${data.certificateNumber}.pdf`;

      const filePath = path.join(
        uploadDir,
        fileName
      );

      fs.writeFileSync(filePath, pdfBytes);

      // =====================================================
      // STEP 8 — BUILD PUBLIC URL
      // =====================================================

      const certificateUrl =
        `${process.env.STRAPI_URL}/certificates/${fileName}`;

      // =====================================================
      // STEP 9 — RETURN RESULT
      // =====================================================

      return {
        success: true,
        fileName,
        filePath,
        certificateUrl,
      };
    } catch (error) {
      console.error(
        "PDF GENERATION ERROR:",
        error
      );

      throw error;
    }
  },
};