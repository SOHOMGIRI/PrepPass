import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import { getDashboardSummary } from "../controllers/dashboardController.js";

const router = express.Router();

// Ensure active database connection
router.use(checkDbConnection);

// Protected by access token
router.use(verifyAccessToken);

router.get("/summary", getDashboardSummary);

export default router;
