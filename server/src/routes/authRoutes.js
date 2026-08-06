import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { verifyAccessToken } from "../middleware/auth.js";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  refresh,
  logout,
  me,
} from "../controllers/authController.js";

const router = Router();

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many registration attempts. Please try again later." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

const resendOtpLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    req.body.email?.toLowerCase()?.trim() || ipKeyGenerator(req),
  message: { message: "Please wait 30 seconds before requesting another code." },
});

const passwordValidation = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[a-zA-Z]/)
  .withMessage("Password must contain at least one letter")
  .matches(/\d/)
  .withMessage("Password must contain at least one number");

router.post(
  "/register",
  registerLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("A valid email is required"),
    passwordValidation,
  ],
  validate,
  register
);

router.post(
  "/verify-otp",
  [
    body("email").trim().isEmail().withMessage("A valid email is required"),
    body("otp").trim().notEmpty().withMessage("Verification code is required"),
  ],
  validate,
  verifyOtp
);

router.post(
  "/resend-otp",
  resendOtpLimiter,
  [body("email").trim().isEmail().withMessage("A valid email is required")],
  validate,
  resendOtp
);

router.post(
  "/login",
  loginLimiter,
  [
    body("email").trim().isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", verifyAccessToken, me);

export default router;
