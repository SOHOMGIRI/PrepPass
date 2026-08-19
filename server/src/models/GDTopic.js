import mongoose from "mongoose";

const gdTopicSchema = new mongoose.Schema({
  topicText: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      "Current Affairs",
      "Abstract",
      "Controversial/Debate",
      "Business & Economy",
      "Technology & Society",
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GDTopic = mongoose.model("GDTopic", gdTopicSchema);

export default GDTopic;
