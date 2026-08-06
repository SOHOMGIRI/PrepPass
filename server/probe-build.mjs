import { PDFParse } from "pdf-parse";

function build(extraLen) {
  const content =
    "BT /F1 12 Tf 40 700 Td (Sohom Giri Software Engineer with five years building REST APIs in Node.js and MongoDB.) Tj ET";
  const objs = [];
  objs.push("<< /Type /Catalog /Pages 2 0 R >>");
  objs.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objs.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
  );
  objs.push(
    "<< /Length " +
      (Buffer.byteLength(content) + extraLen) +
      " >>\nstream\n" +
      content +
      "\nendstream"
  );
  objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const off = [0];
  for (let i = 0; i < objs.length; i++) {
    off.push(Buffer.byteLength(pdf, "utf8"));
    pdf += i + 1 + " 0 obj\n" + objs[i] + "\nendobj\n";
  }
  const x = Buffer.byteLength(pdf, "utf8");
  pdf += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
  for (let i = 0; i < objs.length; i++) {
    pdf += String(off[i + 1]).padStart(10, "0") + " 00000 n \n";
  }
  pdf +=
    "trailer\n<< /Size " +
    (objs.length + 1) +
    " /Root 1 0 R >>\nstartxref\n" +
    x +
    "\n%%EOF\n";
  return Buffer.from(pdf, "utf8");
}

for (const e of [0, 1, -1]) {
  const buf = build(e);
  const p = new PDFParse({ data: buf });
  const r = await p.getText();
  console.log(
    "extra=" +
      e +
      " LEN=" +
      ((r.text || "").trim().length) +
      " TEXT=" +
      JSON.stringify((r.text || "").trim())
  );
}
