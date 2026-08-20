import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { resumeBuilderLimiter } from "../middleware/featureLimiters.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import {
  getDraft,
  saveDraft,
  aiAssist,
} from "../controllers/resumeBuilderController.js";

const router = express.Router();

// Check database connection before processing any requests
router.use(checkDbConnection);

// All routes protected by verifyAccessToken
router.use(verifyAccessToken);

router.use(resumeBuilderLimiter);

router.get("/", getDraft);
router.put("/", saveDraft);
router.post("/ai-assist", aiAssist);

export default router;
