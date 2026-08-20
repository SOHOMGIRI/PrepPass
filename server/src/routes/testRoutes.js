import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { testLimiter } from "../middleware/featureLimiters.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import {
  startTest,
  recordAnswer,
  recordViolation,
  submitTest,
  getSession,
  getHistory,
  getDetailedReport,
} from "../controllers/testController.js";

const router = express.Router();

// Ensure active database connection
router.use(checkDbConnection);

// All test routes are protected by access token
router.use(verifyAccessToken);

router.post("/start", testLimiter, startTest);
router.post("/answer", testLimiter, recordAnswer);
router.post("/violation", testLimiter, recordViolation);
router.post("/submit", testLimiter, submitTest);
router.get("/session/:id", getSession);
router.get("/session/:id/detailed-report", getDetailedReport);
router.get("/history", getHistory);

export default router;
