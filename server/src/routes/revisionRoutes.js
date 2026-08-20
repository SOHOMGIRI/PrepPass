import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { revisionLimiter } from "../middleware/featureLimiters.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import {
  getRevisionDeck,
  markCardStatus,
} from "../controllers/revisionController.js";

const router = express.Router();

// Ensure active database connection
router.use(checkDbConnection);

// Protected by access token
router.use(verifyAccessToken);

router.use(revisionLimiter);

router.get("/deck", getRevisionDeck);
router.post("/mark", markCardStatus);

export default router;
