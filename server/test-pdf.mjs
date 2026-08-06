import { Buffer } from "buffer";
import { PDFParse } from "pdf-parse";

// Build a small but valid PDF (correct xref offsets) in memory.
function buildMinimalPdf() {
  const objects = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
  );
  const content =
    "BT /F1 18 Tf 20 100 Td (Hello PrepPass resume matcher test) Tj ET";
  objects.push(
    "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream"
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += i + 1 + " 0 obj\n" + objects[i] + "\nendobj\n";
  }
  const xrefPos = Buffer.byteLength(pdf, "utf8");
  pdf += "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
  for (let i = 0; i < objects.length; i++) {
    pdf += String(offsets[i + 1]).padStart(10, "0") + " 00000 n \n";
  }
  pdf +=
    "trailer\n<< /Size " +
    (objects.length + 1) +
    " /Root 1 0 R >>\nstartxref\n" +
    xrefPos +
    "\n%%EOF\n";
  return Buffer.from(pdf, "utf8");
}

const buf = buildMinimalPdf();
try {
  const parser = new PDFParse({ data: buf });
  const out = await parser.getText();
  console.log("PDF_PARSE_RESULT_OK");
  console.log("TEXT_LEN=" + (out.text || "").trim().length);
} catch (e) {
  console.log("PDF_PARSE_RESULT_ERROR");
  console.log("MESSAGE=" + (e && e.message));
  console.log("CODE=" + (e && e.code));
}
