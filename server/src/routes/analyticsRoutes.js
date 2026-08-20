import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { analyticsLimiter } from "../middleware/featureLimiters.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import {
  getReadinessTrend,
  getTestPercentile,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Ensure active database connection
router.use(checkDbConnection);

// Protected by access token
router.use(verifyAccessToken);

router.use(analyticsLimiter);

router.get("/trend", getReadinessTrend);
router.get("/percentile/:testSessionId", getTestPercentile);

export default router;
