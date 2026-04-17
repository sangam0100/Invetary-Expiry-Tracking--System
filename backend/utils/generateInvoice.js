const PDFDocument = require("pdfkit");
const fs = require("fs");

const getBarcodeBits = (value) => {
  const bits = [];
  if (!value) return bits;

  for (const char of value) {
    const code = char.charCodeAt(0);
    for (let bit = 7; bit >= 0; bit -= 1) {
      bits.push((code >> bit) & 1);
    }
    bits.push(0, 0);
  }

  return bits;
};

const generateInvoice = (order, filePath) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("INVOICE", { align: "center" });

  const barcodeX = 430;
  const barcodeY = 70;

  doc.fontSize(12).text(`Customer: ${order.customerName}`);
  if (order.gender) doc.text(`Gender: ${order.gender}`);
  if (order.mobile) doc.text(`Mobile: ${order.mobile}`);
  if (order.dob) doc.text(`DOB: ${order.dob}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  const bits = getBarcodeBits(order._id);
  doc.save();
  doc.fillColor("black");
  const barX = barcodeX;
  const barY = barcodeY + 15;
  const barHeight = 80;
  let currentX = barX;

  bits.forEach((bit) => {
    if (bit) {
      doc.rect(currentX, barY, 2, barHeight).fill();
    }
    currentX += 3;
  });

  doc.restore();
  doc.fontSize(9).text(order._id.slice(0, 16), barX, barY + barHeight + 8, {
    width: currentX - barX,
    align: "center"
  });

  order.products.forEach(p => {
    doc.text(`${p.name} - ${p.quantity} x ₹${p.price}`);
  });

  doc.moveDown();
  doc.text(`Total: ₹${order.totalAmount}`);

  doc.end();
};

module.exports = generateInvoice;