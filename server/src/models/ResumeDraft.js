import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endYear: { type: String, default: "" },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    techUsed: { type: String, default: "" },
  },
  { _id: false }
);

const resumeDraftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  personalInfo: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
  },
  education: {
    type: [educationSchema],
    default: [],
  },
  experience: {
    type: [experienceSchema],
    default: [],
  },
  projects: {
    type: [projectSchema],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  summary: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeDraft = mongoose.model("ResumeDraft", resumeDraftSchema);

export default ResumeDraft;
