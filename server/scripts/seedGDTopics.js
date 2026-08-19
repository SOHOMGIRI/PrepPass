import "dotenv/config";
import mongoose from "mongoose";
import GDTopic from "../src/models/GDTopic.js";
import { callGeminiJSON } from "../src/utils/gemini.js";

const CATEGORIES = [
  "Current Affairs",
  "Abstract",
  "Controversial/Debate",
  "Business & Economy",
  "Technology & Society",
];

function is429(err) {
  if (!err) return false;
  const message = err.message || "";
  if (err.status === 429) return true;
  if (String(err.code || "").includes("429")) return true;
  return /429|rate.?limit|quota|resource.?exhausted|too many requests|exhausted/i.test(
    message
  );
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not defined in environment");
    process.exit(1);
  }

  await mongoose.connect(mongoUri.trim());
  console.log("Connected to MongoDB");

  const completedCategories = [];

  for (const category of CATEGORIES) {
    const existingCount = await GDTopic.countDocuments({ category });
    if (existingCount >= 8) {
      console.log(`Skipping "${category}", already has ${existingCount} topic(s)`);
      completedCategories.push(category);
      continue;
    }

    try {
      const prompt = `Generate exactly 8 realistic, thought-provoking, and contemporary Group Discussion (GD) topics for the category: "${category}".
Context: Indian campus placements, graduate engineering/management job interviews, and corporate recruitment.
Return ONLY a JSON array of objects, each with: {"category":"${category}","topicText":"..."}.
Do not repeat topics. No markdown fences, no extra text.`;

      const generated = await callGeminiJSON(prompt);
      const arr = Array.isArray(generated) ? generated : [generated];

      let insertedCount = 0;

      for (const item of arr) {
        if (
          !item ||
          typeof item.topicText !== "string" ||
          !item.topicText.trim()
        ) {
          continue;
        }
        const topicText = item.topicText.trim();

        const existing = await GDTopic.findOne({ category, topicText }).lean();
        if (existing) {
          continue;
        }

        await GDTopic.create({
          category,
          topicText,
        });
        insertedCount++;
      }

      console.log(`Category "${category}": inserted ${insertedCount} new topic(s)`);
      completedCategories.push(category);
    } catch (err) {
      if (is429(err)) {
        console.log(`Rate limit (429) encountered while seeding "${category}".`);
        console.log(
          `Categories completed: ${
            completedCategories.length ? completedCategories.join(", ") : "(none)"
          }`
        );
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
        process.exit(0);
      }
      throw err;
    }
  }

  const totalCount = await GDTopic.countDocuments();
  console.log(`GD Topics seeding complete! Total topics in database: ${totalCount}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
}

main().catch((err) => {
  console.error("GD Topic seed script failed:", err.message || err);
  process.exit(1);
});
