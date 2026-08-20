import mongoose from "mongoose";

const testQuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length === 4,
      message: "Options must contain exactly 4 choices",
    },
  },
  correctOptionIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    trim: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TestQuestion = mongoose.model("TestQuestion", testQuestionSchema);

export default TestQuestion;
