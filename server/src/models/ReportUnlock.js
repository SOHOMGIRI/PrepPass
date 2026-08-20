import mongoose from "mongoose";

const reportUnlockSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  testSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestSession",
    required: true,
    index: true,
  },
  referenceCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  amount: {
    type: Number,
    default: 49,
  },
  upiTransactionId: {
    type: String,
    trim: true,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paidAt: {
    type: Date,
    default: null,
  },
});

const ReportUnlock = mongoose.model("ReportUnlock", reportUnlockSchema);

export default ReportUnlock;
