import express from "express";
import { contactLimiter } from "../middleware/featureLimiters.js";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

// Public route protected by contactLimiter (5 requests/hour per IP)
router.post("/", contactLimiter, submitContact);

export default router;
