const axios = require("axios");
const fs = require("fs");

async function fetchLetterheadPDF() {
  const res = await axios.get(
    "http://localhost:1337/api/certificate-template?populate=letterhead",
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    }
  );

  const fileUrl =
    res.data?.data?.attributes?.letterhead?.data?.attributes?.url;

  if (!fileUrl) {
    throw new Error("Letterhead PDF not found in Strapi");
  }

  const fullUrl = `http://localhost:1337${fileUrl}`;

  const pdfBuffer = await axios.get(fullUrl, {
    responseType: "arraybuffer",
  });

  return pdfBuffer.data;
}

module.exports = {
  fetchLetterheadPDF,
};