import mongoose from "mongoose";

const sessionQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestQuestion",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    selectedIndex: {
      type: Number,
      default: null,
      min: 0,
      max: 3,
    },
    isCorrect: {
      type: Boolean,
      default: null,
    },
  },
  { _id: true }
);

const testSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  subjects: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "auto-submitted"],
    default: "in-progress",
  },
  mode: {
    type: String,
    enum: ["proctored", "practice"],
    default: "proctored",
  },
  questions: {
    type: [sessionQuestionSchema],
    default: [],
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  violationCount: {
    type: Number,
    default: 0,
  },
  trustScore: {
    type: Number,
    default: 100,
  },
  scorePercent: {
    type: Number,
    default: null,
  },
  autoSubmittedByTimeout: {
    type: Boolean,
    default: false,
  },
});

const TestSession = mongoose.model("TestSession", testSessionSchema);

export default TestSession;
