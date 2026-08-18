import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  formattingIssues: {
    type: [String],
    default: [],
  },
  missingSections: {
    type: [String],
    default: [],
  },
  suggestedSubjects: {
    type: [String],
    default: [],
  },
  improvementTips: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;
