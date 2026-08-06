import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { interviewLimiter } from "../middleware/featureLimiters.js";
import {
  startInterview,
  answerQuestion,
  finishInterview,
  getSession,
  getHistory,
} from "../controllers/interviewController.js";

const router = express.Router();

// All routes protected by verifyAccessToken and interviewLimiter
router.use(verifyAccessToken, interviewLimiter);

router.post("/start", startInterview);
router.post("/answer", answerQuestion);
router.post("/finish", finishInterview);
router.get("/session/:id", getSession);
router.get("/history", getHistory);

export default router;
