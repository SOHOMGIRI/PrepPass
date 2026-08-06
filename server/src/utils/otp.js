const OTP_EXPIRY_MS = 5 * 60 * 1000;

export const generateOtp = () => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
  return { otp, otpExpiresAt };
};
