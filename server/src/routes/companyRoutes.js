import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import companies from "../config/companies.js";

const router = express.Router();

// Protected by verifyAccessToken
router.use(verifyAccessToken);

/**
 * GET /api/companies
 * Returns list of company prep profiles with round patterns.
 */
router.get("/", (req, res) => {
  return res.json({ companies });
});

export default router;
