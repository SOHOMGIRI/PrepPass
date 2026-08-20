import crypto from "crypto";
import mongoose from "mongoose";
import TestSession from "../models/TestSession.js";
import ReportUnlock from "../models/ReportUnlock.js";

/**
 * Generates a short 6-character alphanumeric reference code prefixed with PP-
 */
function generateReferenceCode() {
  const randomChars = crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
  return `PP-${randomChars}`;
}

/**
 * POST /api/payment/create-order
 * Creates a pending UPI payment order for unlocking a completed test report.
 */
export const createOrder = async (req, res, next) => {
  try {
    const { testSessionId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(testSessionId)) {
      return res.status(400).json({ message: "Invalid test session id" });
    }

    const session = await TestSession.findById(testSessionId);
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership check
    if (session.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    if (session.status !== "completed" && session.status !== "auto-submitted") {
      return res.status(400).json({
        message: "Test session must be finalized before unlocking the report",
      });
    }

    // Check if already paid
    const existingPaid = await ReportUnlock.findOne({
      userId: req.userId,
      testSessionId,
      status: "paid",
    });

    if (existingPaid) {
      return res.json({
        unlocked: true,
        message: "Detailed report is already unlocked",
        referenceCode: existingPaid.referenceCode,
      });
    }

    const referenceCode = generateReferenceCode();
    const amount = 49;
    const upiId = process.env.UPI_ID || "girisohom87@okicici";
    const payeeName = process.env.UPI_PAYEE_NAME || "30 SOHOM GIRI 11A";

    const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(referenceCode)}`;

    const unlock = new ReportUnlock({
      userId: req.userId,
      testSessionId,
      referenceCode,
      amount,
      status: "pending",
    });

    await unlock.save();

    return res.status(201).json({
      upiUri,
      referenceCode,
      amount,
      upiId,
      payeeName,
      unlocked: false,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/payment/submit-reference
 * Self-attested verification of UPI transaction ID.
 */
export const submitReference = async (req, res, next) => {
  try {
    const { referenceCode, upiTransactionId } = req.body || {};

    if (!referenceCode || typeof referenceCode !== "string") {
      return res.status(400).json({ message: "referenceCode is required" });
    }

    if (
      !upiTransactionId ||
      typeof upiTransactionId !== "string" ||
      upiTransactionId.trim().length < 4 ||
      upiTransactionId.trim().length > 50
    ) {
      return res.status(400).json({
        message: "Please enter a valid UPI Transaction ID / UTR (4-50 characters)",
      });
    }

    const cleanRef = referenceCode.trim().toUpperCase();
    const cleanTxnId = upiTransactionId.trim();

    const unlock = await ReportUnlock.findOne({
      referenceCode: cleanRef,
      userId: req.userId,
    });

    if (!unlock) {
      return res.status(404).json({
        message: "Payment order not found or unauthorized",
      });
    }

    unlock.upiTransactionId = cleanTxnId;
    unlock.status = "paid";
    unlock.paidAt = new Date();
    await unlock.save();

    return res.json({
      message: "Payment verified successfully. Detailed report unlocked!",
      unlocked: true,
      testSessionId: unlock.testSessionId,
      referenceCode: unlock.referenceCode,
    });
  } catch (err) {
    next(err);
  }
};
