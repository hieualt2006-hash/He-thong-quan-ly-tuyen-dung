const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extracts raw text from a PDF file
 * @param {string|Buffer} input - File path or File Buffer
 * @returns {Promise<string>} Extracted raw text
 */
async function extractTextFromPdf(input) {
  try {
    let dataBuffer;
    if (typeof input === 'string') {
      dataBuffer = fs.readFileSync(input);
    } else {
      dataBuffer = input;
    }

    const data = await pdfParse(dataBuffer);
    return data.text ? data.text.trim() : '';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return '';
  }
}

module.exports = {
  extractTextFromPdf
};
