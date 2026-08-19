import mongoose from "mongoose";

const gdPracticeSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topicText: {
    type: String,
    required: true,
    trim: true,
  },
  userArgument: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    clarity: { type: Number },
    structure: { type: Number },
    persuasiveness: { type: Number },
    overall: { type: Number },
  },
  feedback: {
    type: String,
    default: "",
  },
  counterpoints: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GDPracticeSession = mongoose.model(
  "GDPracticeSession",
  gdPracticeSessionSchema
);

export default GDPracticeSession;
