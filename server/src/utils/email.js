import nodemailer from "nodemailer";
import { lookup } from "node:dns/promises";

const isEmailConfigured = Boolean(
  process.env.EMAIL_USER?.trim() && process.env.EMAIL_APP_PASSWORD?.trim()
);

const getGmailTransporter = async () => {
  if (!isEmailConfigured) return null;

  let host = "smtp.gmail.com";
  try {
    const res = await lookup("smtp.gmail.com", { family: 4 });
    if (res && res.address) {
      host = res.address;
    }
  } catch (err) {
    console.warn("[EMAIL] IPv4 lookup for smtp.gmail.com failed, falling back to domain:", err.message);
  }

  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    tls: {
      servername: "smtp.gmail.com",
    },
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: process.env.EMAIL_APP_PASSWORD.trim(),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

export const sendOtpEmail = async (to, otp) => {
  if (!isEmailConfigured) {
    console.log("=================================================");
    console.log(`[PRÆPPASS MOCK EMAIL] Verification OTP for ${to}: [ ${otp} ]`);
    console.log("=================================================");
    return { mock: true, message: "OTP logged to server console (mock mode)" };
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PræpPass Verification Code</title>
      </head>
      <body style="margin:0;padding:0;background-color:#FDFBF7;font-family:'Plus Jakarta Sans',Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#ffffff;border-radius:12px;padding:36px;border:1px solid rgba(10,17,40,0.08);box-shadow:0 12px 30px rgba(10,17,40,0.04);">
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;margin-bottom:16px;">
                      <h1 style="margin:0;font-size:26px;color:#0A1128;font-weight:800;letter-spacing:-0.5px;">Pr<span style="color:#C5A059;">æ</span>pPass</h1>
                    </div>
                    <p style="margin:0 0 20px;color:#64748B;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Candidate Authentication Code</p>
                    <p style="margin:0 0 16px;color:#1E293B;font-size:15px;line-height:1.6;">
                      Enter the single-use verification code below to authorize your assessment session. This security token expires in <strong>5 minutes</strong>.
                    </p>
                    <div style="background:#0A1128;border-radius:8px;padding:20px;text-align:center;margin:24px 0;border:1px solid #C5A059;">
                      <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#FDFBF7;font-family:monospace;">${otp}</span>
                    </div>
                    <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.5;">
                      If you did not initiate this candidate verification request on PræpPass, please disregard this transmission.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const transporter = await getGmailTransporter();
  await transporter.sendMail({
    from: `"PræpPass Intelligence" <${process.env.EMAIL_USER}>`,
    to,
    subject: `PræpPass Verification Token: ${otp}`,
    html,
  });
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  if (!isEmailConfigured) {
    console.log(`[PRÆPPASS MOCK CONTACT] From: ${name} <${email}> | Subject: ${subject}`);
    console.log(`Message: ${message}`);
    return { mock: true };
  }

  const transporter = await getGmailTransporter();
  await transporter.sendMail({
    from: `"PræpPass Dispatch" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `[Candidate Inquiry] ${subject} — ${name}`,
    text: `From: ${name} (${email})\n\n${message}`,
  });
};
