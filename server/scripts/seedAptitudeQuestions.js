import "dotenv/config";
import mongoose from "mongoose";
import TestQuestion from "../src/models/TestQuestion.js";
import { callGeminiJSON } from "../src/utils/gemini.js";

const APTITUDE_CATEGORIES = [
  {
    name: "Quantitative Aptitude",
    topics: "Percentages, Profit and Loss, Time and Work, Speed Distance and Time, Simple and Compound Interest, Ratios and Proportions, Permutations and Combinations, Probability, Averages, Number Systems",
  },
  {
    name: "Logical Reasoning",
    topics: "Blood Relations, Syllogisms, Seating Arrangements, Coding-Decoding, Number and Letter Series, Direction Sense, Data Sufficiency, Clocks and Calendars, Statement and Assumptions",
  },
  {
    name: "Verbal Ability",
    topics: "Reading Comprehension, Sentence Correction and Grammar, Synonyms and Antonyms, Idioms and Phrases, Para Jumbles, Spotting Errors, Sentence Completion, Critical Reasoning",
  },
];

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not defined in environment");
    process.exit(1);
  }

  await mongoose.connect(mongoUri.trim());
  console.log("Connected to MongoDB");

  for (const cat of APTITUDE_CATEGORIES) {
    const existingCount = await TestQuestion.countDocuments({ subject: cat.name });
    console.log(`Checking "${cat.name}": currently has ${existingCount} question(s).`);

    const needed = Math.max(0, 15 - existingCount);
    if (needed === 0) {
      console.log(`"${cat.name}" already has 15+ questions, skipping generation.`);
      continue;
    }

    console.log(`Generating ${needed} campus-placement MCQ questions for "${cat.name}"...`);

    const prompt = `Generate exactly ${needed} realistic, high-quality multiple choice question(s) (MCQs) for campus placements in the section: "${cat.name}".
Topics covered can include: ${cat.topics}.
Difficulty: medium (appropriate for TCS, Infosys, Wipro, Accenture, Cognizant, Amazon, and general placement aptitude rounds).
Each question MUST have:
1. "questionText": Clear, self-contained problem statement.
2. "options": Array of exactly 4 plausible option strings (A, B, C, D).
3. "correctOptionIndex": Single integer (0, 1, 2, or 3) pointing to the right option.
4. "difficulty": "medium"

Return ONLY a JSON array of objects with this structure:
[
  {
    "questionText": "...",
    "options": ["...", "...", "...", "..."],
    "correctOptionIndex": 0,
    "difficulty": "medium"
  }
]
No markdown fences, no code blocks, no extra text.`;

    try {
      const generated = await callGeminiJSON(prompt);
      const arr = Array.isArray(generated) ? generated : [generated];

      let insertedCount = 0;

      for (const item of arr) {
        if (
          !item ||
          typeof item.questionText !== "string" ||
          !item.questionText.trim() ||
          !Array.isArray(item.options) ||
          item.options.length !== 4 ||
          typeof item.correctOptionIndex !== "number" ||
          item.correctOptionIndex < 0 ||
          item.correctOptionIndex > 3
        ) {
          continue;
        }

        const qText = item.questionText.trim();

        // Avoid duplicate question text in same category
        const exists = await TestQuestion.findOne({
          subject: cat.name,
          questionText: qText,
        }).lean();

        if (exists) continue;

        await TestQuestion.create({
          subject: cat.name,
          difficulty: item.difficulty || "medium",
          questionText: qText,
          options: item.options.map((opt) => String(opt).trim()),
          correctOptionIndex: item.correctOptionIndex,
        });

        insertedCount++;
      }

      console.log(`"${cat.name}": successfully inserted ${insertedCount} new question(s).`);
    } catch (err) {
      console.error(`Error seeding "${cat.name}":`, err.message);
    }
  }

  const totalAptitude = await TestQuestion.countDocuments({
    subject: { $in: APTITUDE_CATEGORIES.map((c) => c.name) },
  });
  console.log(`Aptitude questions seeding complete! Total aptitude questions in bank: ${totalAptitude}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
}

main().catch((err) => {
  console.error("Aptitude seed script failed:", err);
  process.exit(1);
});
