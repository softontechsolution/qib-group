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

      // =====================================================
      // 3. LOAD REGULAR & BOLD CUSTOM FONTS
      // =====================================================
      const fontPath = path.join(process.cwd(), "src", "fonts", "Roboto-Regular.ttf");
      const boldFontPath = path.join(process.cwd(), "src", "fonts", "Roboto-Bold.ttf");
      
      if (!fs.existsSync(fontPath)) {
        throw new Error(`Custom regular font file missing at path: ${fontPath}`);
      }
      const fontBytes = fs.readFileSync(fontPath);
      const customFont = await pdfDoc.embedFont(fontBytes); 

      // Fallback mechanism: If bold file doesn't exist yet, use regular so it won't crash
      let customFontBold = customFont;
      if (fs.existsSync(boldFontPath)) {
        const boldFontBytes = fs.readFileSync(boldFontPath);
        customFontBold = await pdfDoc.embedFont(boldFontBytes);
      }

      // 4. Data Preparation & Cleaning
      const registration = data.registration || {};
      
      let insuredName = "";
      if (registration.policyHolderFirstName || registration.policyHolderLastName) {
        insuredName = [
          registration.policyHolderFirstName,
          registration.policyHolderMiddleName,
          registration.policyHolderLastName
        ].filter(Boolean).join(" ");
      } else {
        insuredName = registration.companyPolicyHolderName || registration.companyName || "";
      }

      const registrationNumber = registration.registrationNumber || `${registration.plateFirst || ""}${registration.plateMiddle || ""}${registration.plateLast || ""}`;

      let displayCertNumber = String(data.certificateNumber || `CERT/${registration.id}`);
      let displayPolicyNumber = String(data.policyNumber || `POL/${registration.id}`);

      if (displayCertNumber.includes("[object Object]")) {
        displayCertNumber = displayCertNumber.replace("[object Object]", `/${registration.id || "01"}`);
      }
      if (displayPolicyNumber.includes("[object Object]")) {
        displayPolicyNumber = displayPolicyNumber.replace("[object Object]", `/${registration.id || "01"}`);
      }

      const commencementDate = new Date(registration.createdAt || Date.now());
      const expiryDate = new Date(commencementDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const formatDate = (date) => {
        return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      };

      // =====================================================
      // 5. DESIGN MATRIX (PURE BLACK & RIGHT ALIGNED)
      // =====================================================
      const leftMargin = 20;       
      const rightMargin = width - 20; 
      let currentY = height - 120;

      currentY -= 25;

      // Inline Meta IDs (Right-aligned policy number)
      page.drawText(`CERTIFICATE NO: ${displayCertNumber}`, { x: leftMargin, y: currentY, size: 10, font: customFont, color: rgb(0, 0, 0) });
      
      const policyString = `POLICY NO: ${displayPolicyNumber}`;
      const policyWidth = customFont.widthOfTextAtSize(policyString, 10);
      page.drawText(policyString, { x: rightMargin - policyWidth, y: currentY, size: 10, font: customFont, color: rgb(0, 0, 0) });

      // Header lines
      currentY -= 12;
      page.drawLine({ start: { x: leftMargin, y: currentY }, end: { x: rightMargin, y: currentY }, thickness: 1, color: rgb(0, 0, 0) });
      
      currentY -= 25;

      // --- MIDDLE GRID: SCHEDULED ITEMS (RIGHT ALIGNED VIA TRUE BOLD FONT) ---
      const coreGridItems = [
        { label: "1. Index Mark and Registration No. of Vehicle:", value: registrationNumber.toUpperCase() },
        { label: "2. Vehicle Make & Model:", value: `${registration.vehicleMake || ""} (${registration.vehicleModel || ""})`.toUpperCase() },
        { label: "3. Name of Policy Holder:", value: insuredName.toUpperCase() },
        { label: "4. Effective Date of Commencement of Insurance:", value: formatDate(commencementDate) },
        { label: "5. Date of Expiry of Insurance:", value: formatDate(expiryDate) },
      ];

      coreGridItems.forEach(item => {
        // Draw Label (Regular Font)
        page.drawText(item.label, { x: leftMargin, y: currentY, size: 10, font: customFont, color: rgb(0, 0, 0) });
        
        // Aligned alignment layout using customFontBold bounds
        const valText = item.value || "N/A";
        const textWidth = customFontBold.widthOfTextAtSize(valText, 10);
        const alignedX = rightMargin - textWidth;

        // Draw Value (True Bold Font)
        page.drawText(valText, { 
          x: alignedX, 
          y: currentY, 
          size: 10, 
          font: customFontBold, 
          color: rgb(0, 0, 0)
        });
        
        currentY -= 24; 
      });

      currentY -= 5;

      // --- SECTION 6: DRIVER PERMISSIONS ---
      page.drawText("6. Persons or Classes of Persons Entitled to Drive*", { x: leftMargin, y: currentY, size: 10, font: customFont, color: rgb(0, 0, 0) });
      currentY -= 16;
      page.drawText("(a) The Policy holder.", { x: leftMargin + 15, y: currentY, size: 9, font: customFont, color: rgb(0, 0, 0) });
      currentY -= 15;
      
      const driverClause = "(b) Any other person who is driving on the Policy holder's order or with his/her permission provided that the person driving is permitted in accordance with licensing or other laws or regulations to drive the Motor Vehicle or has been so permitted and is not disqualified by order of a Court of Law.";
      
      const printWrappedText = (text, startX, startY, maxW, size, leading, targetFont = customFont) => {
        const words = text.split(" ");
        let line = "";
        let yOffset = startY;

        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + " ";
          let testWidth = targetFont.widthOfTextAtSize(testLine, size);
          if (testWidth > maxW && n > 0) {
            page.drawText(line, { x: startX, y: yOffset, size, font: targetFont, color: rgb(0, 0, 0) });
            line = words[n] + " ";
            yOffset -= leading;
          } else {
            line = testLine;
          }
        }
        page.drawText(line, { x: startX, y: yOffset, size, font: targetFont, color: rgb(0, 0, 0) });
        return yOffset - leading;
      };

      currentY = printWrappedText(driverClause, leftMargin + 15, currentY, rightMargin - (leftMargin + 15), 9, 13, customFont);
      currentY -= 12;

      // --- SECTION 7: LIMITATION TO USE ---
      page.drawText("7. Limitation to use:", { x: leftMargin, y: currentY, size: 10, font: customFont, color: rgb(0, 0, 0) });
      
      const uppercaseCover = String(registration.coverType || "THIRD-PARTY ONLY").toUpperCase();
      const uppercaseUse = String(registration.vehicleUse || "PRIVATE MOTOR").toUpperCase();
      const useText = `${uppercaseCover} (${uppercaseUse})`;
      const useWidth = customFontBold.widthOfTextAtSize(useText, 10);

      // Value text drawn with True Bold Font
      page.drawText(useText, { 
        x: rightMargin - useWidth, 
        y: currentY, 
        size: 10, 
        font: customFontBold, 
        color: rgb(0, 0, 0)
      });
      
      currentY -= 16;
      const limitationClause = "Use in connection with the Policy holder's business: whilst the vehicle is being so used in the carriage of passengers (other than for hire or reward) is permitted to Use for social domestic and pleasure purposes. The policy does not cover: Use for hire or reward or for racing, pace-making, reliability trial or speed testing.";
      currentY = printWrappedText(limitationClause, leftMargin + 15, currentY, rightMargin - (leftMargin + 15), 9, 13, customFont);

      // =====================================================
      // 6. QR CODE EMBEDDING & FOOTER REALIGNMENT (BOTTOM LEFT)
      // =====================================================
      const verificationUrl = `${process.env.FRONTEND_URL}/verify/${encodeURIComponent(displayCertNumber)}`;
      const qrSize = 75; 
      const qrImageBuffer = await QRCode.toBuffer(verificationUrl, { width: 120, margin: 1 });
      const qrImage = await pdfDoc.embedPng(qrImageBuffer);

      const qrX = leftMargin;
      const qrY = 40;
      page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });

      const footerTextX = leftMargin + qrSize + 15; 
      const footerMaxW = rightMargin - footerTextX;

      page.drawText(`Generated on: ${formatDate(new Date())} ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase()}`, {
        x: footerTextX,
        y: qrY + qrSize - 10,
        size: 8,
        font: customFont,
        color: rgb(0, 0, 0),
      });
      
      // 7. Storage Layer
      const uploadDir = path.join(process.cwd(), "public", "certificates");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const safeFileName = `${displayCertNumber.replace(/\//g, "-")}.pdf`;
      const filePath = path.join(uploadDir, safeFileName);
      
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