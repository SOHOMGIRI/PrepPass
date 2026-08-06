import rateLimit from "express-rate-limit";

// Environment-aware rate limits. Kept generous in local dev so testing the
// AI-backed endpoints (Gemini scoring, pdf/docx parsing) doesn't trip them.
const isProduction = process.env.NODE_ENV === "production";

export const interviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProduction ? 60 : 500,
  message: { message: "Too many interview requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resumeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProduction ? 20 : 200,
  message: { message: "Too many resume match requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

