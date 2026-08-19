import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { interviewLimiter } from "../middleware/featureLimiters.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import roles from "../config/roles.js";
import {
  startInterview,
  answerQuestion,
  finishInterview,
  getSession,
  getHistory,
} from "../controllers/interviewController.js";

const router = express.Router();

// Check database connection before processing any requests
router.use(checkDbConnection);

// All routes protected by verifyAccessToken and interviewLimiter
router.use(verifyAccessToken, interviewLimiter);

router.post("/start", startInterview);
router.post("/answer", answerQuestion);
router.post("/finish", finishInterview);
router.get("/session/:id", getSession);
router.get("/history", getHistory);
router.get("/roles", (req, res) => res.json({ roles }));

export default router;
