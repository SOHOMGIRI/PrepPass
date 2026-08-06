import "dotenv/config";
import mongoose from "mongoose";
import Question from "../src/models/Question.js";
import { callGeminiJSON } from "../src/utils/gemini.js";

const ROLES = ["Software Engineer", "Data Analyst", "HR Generalist"];

/**
 * Detects whether an error represents a 429 / quota / rate-limit condition.
 * callGeminiJSON rethrows a clean Error whose message embeds the original
 * error message, so we inspect the message (and any carried status/code).
 */
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

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const completedRoles = [];

  for (const role of ROLES) {
    // Skip roles that already have questions seeded
    const existingCount = await Question.countDocuments({ role });
    if (existingCount > 0) {
      console.log(`Skipping ${role}, already has ${existingCount} questions`);
      completedRoles.push(role);
      continue;
    }

    try {
      // Request a batch of 10-15 questions in a single Gemini API call
      const count = Math.floor(Math.random() * 6) + 10; // 10..15 inclusive
      const prompt = `Generate exactly ${count} unique, diverse interview questions for the role: "${role}".
Mix of "technical" and "hr" categories, and easy/medium/hard difficulties.
Return ONLY a JSON array of objects, each with: {"role":"${role}","category":"technical|hr","difficulty":"easy|medium|hard","questionText":"..."}.
Do not repeat any question. No markdown fences, no extra text.`;

      // callGeminiJSON handles JSON parsing, fence stripping, and one retry
      const generated = await callGeminiJSON(prompt);
      const arr = Array.isArray(generated) ? generated : [generated];

      let insertedCount = 0;

      for (const item of arr) {
        if (
          !item ||
          typeof item.questionText !== "string" ||
          !item.questionText.trim()
        ) {
          continue;
        }
        const questionText = item.questionText.trim();

        // Avoid duplicates by exact questionText (and role)
        const existing = await Question.findOne({ role, questionText }).lean();
        if (existing) {
          continue;
        }

        await Question.create({
          role,
          category: item.category || "hr",
          difficulty: item.difficulty || "medium",
          questionText,
        });
        insertedCount++;
      }

      console.log(`Role "${role}": inserted ${insertedCount} new question(s)`);
      completedRoles.push(role);
    } catch (err) {
      if (is429(err)) {
        console.log(`Rate limit (429) encountered while seeding "${role}".`);
        console.log(
          `Roles completed successfully: ${
            completedRoles.length ? completedRoles.join(", ") : "(none)"
          }`
        );
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
        process.exit(0);
      }
      // Non-429 error: rethrow so the top-level handler logs a clean message
      throw err;
    }
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed script failed:", err.message || err);
  process.exit(1);
});
