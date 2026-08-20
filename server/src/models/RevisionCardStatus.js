import mongoose from "mongoose";

const revisionCardStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  cardKey: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["learning", "mastered"],
    default: "learning",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index so each user has one status record per cardKey
revisionCardStatusSchema.index({ userId: 1, cardKey: 1 }, { unique: true });

const RevisionCardStatus = mongoose.model(
  "RevisionCardStatus",
  revisionCardStatusSchema
);

export default RevisionCardStatus;
