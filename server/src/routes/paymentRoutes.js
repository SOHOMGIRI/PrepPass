import express from "express";
import { verifyAccessToken } from "../middleware/auth.js";
import { checkDbConnection } from "../middleware/errorHandler.js";
import {
  createOrder,
  submitReference,
} from "../controllers/paymentController.js";

const router = express.Router();

// Ensure active database connection
router.use(checkDbConnection);

// Protected by user access token
router.use(verifyAccessToken);

router.post("/create-order", createOrder);
router.post("/submit-reference", submitReference);

export default router;
