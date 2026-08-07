import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendOtpEmail = async (to, otp) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PrepPass Verification Code</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#ffffff;border-radius:8px;padding:32px;">
                <tr>
                  <td>
                    <h1 style="margin:0 0 8px;font-size:24px;color:#111827;">PrepPass</h1>
                    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Your email verification code</p>
                    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.5;">
                      Use the code below to verify your email address. It expires in 5 minutes.
                    </p>
                    <div style="background:#f3f4f6;border-radius:6px;padding:16px;text-align:center;margin:0 0 24px;">
                      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111827;">${otp}</span>
                    </div>
                    <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.5;">
                      If you did not request this code, you can safely ignore this email.
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

  await transporter.sendMail({
    from: `"PrepPass" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your PrepPass verification code",
    html,
  });
};
