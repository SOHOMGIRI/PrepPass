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

export const gdLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProduction ? 30 : 300,
  message: { message: "Too many group discussion requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resumeBuilderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProduction ? 40 : 400,
  message: { message: "Too many resume builder AI assist requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProduction ? 5 : 50,
  message: { message: "Too many contact requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const testLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProduction ? 30 : 300,
  message: { message: "Too many test requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});



