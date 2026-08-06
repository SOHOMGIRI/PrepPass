import rateLimit from "express-rate-limit";

// Global fallback rate limiter: 150 requests per 15 minutes per IP.
// This sits alongside (not replacing) the existing per-route limiters.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
