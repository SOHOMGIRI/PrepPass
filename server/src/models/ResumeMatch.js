import mongoose from "mongoose";

const resumeMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  matchScorePercent: {
    type: Number,
  },
  matchedSkills: {
    type: [String],
    default: [],
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  recommendations: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeMatch = mongoose.model("ResumeMatch", resumeMatchSchema);

export default ResumeMatch;
