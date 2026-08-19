import mongoose from "mongoose";

const sessionQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isFollowUp: {
    type: Boolean,
    default: false,
  },
  answerText: {
    type: String,
    default: "",
  },
  score: {
    clarity: { type: Number },
    correctness: { type: Number },
    completeness: { type: Number },
    overall: { type: Number },
  },
  feedback: {
    type: String,
    default: "",
  },
});

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  questions: {
    type: [sessionQuestionSchema],
    default: [],
  },
  overallReadinessScore: {
    type: Number,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
