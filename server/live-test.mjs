import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";

const API = `http://localhost:${process.env.PORT || 5000}/api`;
const EMAIL = "resumetest_" + Date.now() + "@example.com";
const PASSWORD = "TestPass123";
const JD =
  "We are hiring a Software Engineer who writes clean scalable code, works with REST APIs and databases, collaborates in agile teams, and has strong problem solving and communication skills.";

function buildMinimalPdf() {
  const objects = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>"
  );
  const content =
    "BT /F1 12 Tf 40 700 Td (Sohom Giri Software Engineer with five years building REST APIs in Node.js and MongoDB and strong problem solving skills.) Tj ET";
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

async function main() {
  fs.writeFileSync(new URL("./sample.pdf", import.meta.url), buildMinimalPdf());
  console.log("PDF_WRITTEN");

  const reg = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Resume Test", email: EMAIL, password: PASSWORD }),
  });
  console.log("REGISTER_STATUS=" + reg.status);

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  const User = (await import("./src/models/User.js")).default;
  const user = await User.findOne({ email: EMAIL }).lean();
  console.log("DB_USER_FOUND=" + !!user);
  const otp = user?.otpCode;

  const ver = await fetch(API + "/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, otp }),
  });
  console.log("VERIFY_STATUS=" + ver.status);

  const log = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const logData = await log.json();
  console.log("LOGIN_STATUS=" + log.status, "HAS_TOKEN=" + !!logData.accessToken);
  const token = logData.accessToken;

  const form = new FormData();
  form.append(
    "resume",
    new Blob([fs.readFileSync(new URL("./sample.pdf", import.meta.url))], {
      type: "application/pdf",
    }),
    "sample.pdf"
  );
  form.append("jobDescription", JD);

  const match = await fetch(API + "/resume/match", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: form,
  });
  console.log("MATCH_STATUS=" + match.status);
  console.log("MATCH_BODY_LEN=" + (await match.text()).length);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("LIVE_TEST_ERROR=" + (e && e.message));
  process.exit(1);
});
