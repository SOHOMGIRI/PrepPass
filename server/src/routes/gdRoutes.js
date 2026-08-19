import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { gdLimiter } from "../middleware/featureLimiters.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import {
  getTopics,
  submitPractice,
  getHistory,
} from "../controllers/gdController.js";

const router = express.Router();

// Check database connection before processing any requests
router.use(checkDbConnection);

// All routes protected by verifyAccessToken
router.use(verifyAccessToken);

router.get("/topics", getTopics);
router.post("/practice", gdLimiter, submitPractice);
router.get("/history", getHistory);

export default router;
