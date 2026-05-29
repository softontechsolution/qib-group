const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const { fetchLetterheadPDF } = require("../certificate/letterhead");

async function generateCertificatePDF(data) {
  // 1. Load letterhead PDF from Strapi
  const letterheadBytes = await fetchLetterheadPDF();

  // 2. Load PDF into pdf-lib
  const pdfDoc = await PDFDocument.load(letterheadBytes);

  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // =========================
  // 3. OVERLAY DYNAMIC DATA
  // =========================

  page.drawText(`CERTIFICATE OF INSURANCE`, {
    x: 160,
    y: 700,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Certificate No: ${data.certificateNo}`, {
    x: 50,
    y: 640,
    size: 12,
    font,
  });

  page.drawText(`Policy No: ${data.policyNo}`, {
    x: 50,
    y: 620,
    size: 12,
    font,
  });

  page.drawText(`Insured Name: ${data.insuredName}`, {
    x: 50,
    y: 600,
    size: 12,
    font,
  });

  page.drawText(`Vehicle: ${data.vehicleMake} ${data.vehicleModel}`, {
    x: 50,
    y: 580,
    size: 12,
    font,
  });

  page.drawText(`Cover Type: ${data.coverType}`, {
    x: 50,
    y: 560,
    size: 12,
    font,
  });

  // 4. Save final PDF
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

module.exports = {
  generateCertificatePDF,
};