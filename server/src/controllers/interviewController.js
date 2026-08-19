import mongoose from "mongoose";
import Question from "../models/Question.js";
import InterviewSession from "../models/InterviewSession.js";
import { callGeminiJSON } from "../utils/gemini.js";
import companies from "../config/companies.js";

/**
 * Generates questions for a role via Gemini and saves any new ones to the Question collection.
 */
async function generateAndSaveQuestions(role, category, count, company = null) {
  let companyContext = "";
  if (company) {
    companyContext = `\nContext: Target company for practice is "${company.name}". Commonly reported interview rounds for practice: ${company.typicalRounds.join(", ")}. Write questions reflecting the style, depth, and focus areas typical of that company's practice-known patterns, for practice purposes.`;
  }
  const prompt = `Generate exactly ${count} unique interview question(s) for the role: "${role}".
Category: "${category}". Difficulty: medium.${companyContext}
Return ONLY a JSON array of objects, each with: {"category":"${category}","difficulty":"medium","questionText":"..."}.
No markdown fences, no extra text.`;
  const generated = await callGeminiJSON(prompt);
  const arr = Array.isArray(generated) ? generated : [generated];
  const toInsert = [];

  for (const item of arr) {
    if (!item || typeof item.questionText !== "string" || !item.questionText.trim()) {
      continue;
    }
    const existing = await Question.findOne({
      role,
      questionText: item.questionText,
    }).lean();

    if (!existing) {
      toInsert.push(
        new Question({
          role,
          category: item.category || category,
          difficulty: "medium",
          questionText: item.questionText.trim(),
        })
      );
    }
  }

  if (toInsert.length > 0) {
    await Question.insertMany(toInsert);
  }
  return toInsert;
}

/**
 * POST /api/interview/start
 * Body: { role, companyId? }
 */
export const startInterview = async (req, res, next) => {
  try {
    const { role, companyId } = req.body;

    if (
      !role ||
      typeof role !== "string" ||
      role.trim().length === 0 ||
      role.trim().length > 50
    ) {
      return res
        .status(400)
        .json({ message: "role is required and must be a string (max 50 chars)" });
    }
    const cleanRole = role.trim();

    let company = null;
    if (companyId && typeof companyId === "string" && companyId.trim()) {
      company =
        companies.find((c) => c.id === companyId.trim().toLowerCase()) || null;
    }

    let orderedQueue = [];

    if (company) {
      // Generate company-tailored questions
      const techGenerated = await generateAndSaveQuestions(
        cleanRole,
        "technical",
        2,
        company
      );
      const hrGenerated = await generateAndSaveQuestions(
        cleanRole,
        "hr",
        2,
        company
      );

      let techQs = techGenerated.slice(0, 2);
      let hrQs = hrGenerated.slice(0, 2);

      // If duplicate questions were skipped during insert, fallback to existing bank
      if (techQs.length < 2 || hrQs.length < 2) {
        const freshBank = await Question.find({ role: cleanRole }).lean();
        if (techQs.length < 2)
          techQs = freshBank
            .filter((q) => q.category === "technical")
            .slice(0, 2);
        if (hrQs.length < 2)
          hrQs = freshBank.filter((q) => q.category === "hr").slice(0, 2);
      }

      if (techQs[0]) orderedQueue.push(techQs[0]);
      if (hrQs[0]) orderedQueue.push(hrQs[0]);
      if (techQs[1]) orderedQueue.push(techQs[1]);
      if (hrQs[1]) orderedQueue.push(hrQs[1]);
    } else {
      const bank = await Question.find({ role: cleanRole }).lean();
      const techQuestions = bank.filter((q) => q.category === "technical");
      const hrQuestions = bank.filter((q) => q.category === "hr");

      if (techQuestions.length < 2) {
        await generateAndSaveQuestions(
          cleanRole,
          "technical",
          2 - techQuestions.length
        );
      }
      if (hrQuestions.length < 2) {
        await generateAndSaveQuestions(
          cleanRole,
          "hr",
          2 - hrQuestions.length
        );
      }

      // Re-fetch after potential inserts
      const freshBank = await Question.find({ role: cleanRole }).lean();
      const techQs = freshBank
        .filter((q) => q.category === "technical")
        .slice(0, 2);
      const hrQs = freshBank.filter((q) => q.category === "hr").slice(0, 2);

      // Build a 4-question queue: T, HR, T, HR (or fallbacks)
      if (techQs[0]) orderedQueue.push(techQs[0]);
      if (hrQs[0]) orderedQueue.push(hrQs[0]);
      if (techQs[1]) orderedQueue.push(techQs[1]);
      if (hrQs[1]) orderedQueue.push(hrQs[1]);
    }

    if (orderedQueue.length === 0) {
      return res
        .status(400)
        .json({ message: "Could not generate questions for this role" });
    }

    const session = new InterviewSession({
      userId: req.userId,
      role: cleanRole,
      companyId: company ? company.id : null,
      status: "in-progress",
      questions: [
        {
          questionText: orderedQueue[0].questionText,
          category: orderedQueue[0].category,
          isFollowUp: false,
          answerText: "",
        },
      ],
    });

    await session.save();

    return res.status(201).json({
      sessionId: session._id,
      question: session.questions[0].questionText,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/interview/answer
 * Body: { sessionId, answerText }
 */
export const answerQuestion = async (req, res, next) => {
  try {
    const { sessionId, answerText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid sessionId" });
    }
    if (!answerText || typeof answerText !== "string" || answerText.trim().length === 0) {
      return res.status(400).json({ message: "answerText is required" });
    }
    if (answerText.length > 3000) {
      return res.status(400).json({ message: "answerText must not exceed 3000 characters" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden: not your session" });
    }

    // Find the current unanswered question (earliest unanswered)
    const currentQ = session.questions.find(
      (q) => !q.answerText || q.answerText.trim().length === 0
    );
    if (!currentQ) {
      return res.status(400).json({ message: "No unanswered question found in this session" });
    }

    const answeredCountBefore = session.questions.filter((q) => q.answerText && q.answerText.trim().length > 0).length;
    currentQ.answerText = answerText;

    // Score the answer
    const scoringPrompt = `You are a professional interviewer. Score the user's answer and give feedback.
Question: "${currentQ.questionText}"
Answer: "${answerText}"
Return ONLY JSON (no markdown) with these exact fields:
{"clarity": <0-10 number>, "correctness": <0-10 number>, "completeness": <0-10 number>, "overall": <0-10 number>, "feedback": "<one short paragraph>"}`;

    const scoreResult = await callGeminiJSON(scoringPrompt);

    currentQ.score = {
      clarity: Number(scoreResult.clarity),
      correctness: Number(scoreResult.correctness),
      completeness: Number(scoreResult.completeness),
      overall: Number(scoreResult.overall),
    };
    currentQ.feedback = scoreResult.feedback || "";

    let nextQuestion = null;
    let sessionComplete = false;

    // answeredCountBefore is 0-indexed count of questions answered before this one
    const step = answeredCountBefore; // 0,1,2,3 for the 4 bank questions

    if (step === 0 || step === 2) {
      // Generate a live follow-up based on what the user just answered
      const followUpPrompt = `For an interview in role "${session.role}", generate one follow-up question based on the user's answer.
The original question was: "${currentQ.questionText}"
The user answered: "${answerText}"
Return ONLY JSON (no markdown) with: {"questionText": "..."}`;
      const followUpResult = await callGeminiJSON(followUpPrompt);
      const followUpText = followUpResult.questionText;
      if (followUpText && typeof followUpText === "string" && followUpText.trim()) {
        session.questions.push({
          questionText: followUpText.trim(),
          category: currentQ.category,
          isFollowUp: true,
          answerText: "",
        });
        nextQuestion = followUpText.trim();
      }
    } else if (step === 1) {
      // Pull the next unused bank question of the opposite category
      const oppositeCategory = currentQ.category === "technical" ? "hr" : "technical";
      const bank = await Question.find({ role: session.role }).lean();
      const usedTexts = new Set();
      for (const sq of session.questions) {
        if (sq.questionText) usedTexts.add(sq.questionText);
      }
      const unusedBank = bank.filter(
        (q) => q.category === oppositeCategory && !usedTexts.has(q.questionText)
      );
      if (unusedBank.length > 0) {
        const nextBankQ = unusedBank[0];
        session.questions.push({
          questionText: nextBankQ.questionText,
          category: nextBankQ.category,
          isFollowUp: false,
          answerText: "",
        });
        nextQuestion = nextBankQ.questionText;
      }
    } else if (step >= 3) {
      // Session complete
      session.status = "completed";
      session.completedAt = new Date();

      const scoredQuestions = session.questions.filter(
        (q) => q.score && q.score.overall != null
      );
      if (scoredQuestions.length > 0) {
        const avg =
          scoredQuestions.reduce((sum, q) => sum + q.score.overall, 0) /
          scoredQuestions.length;
        session.overallReadinessScore = Math.round(avg * 10) / 10;
      }
      sessionComplete = true;
    }

    await session.save();

    if (sessionComplete) {
      return res.json({
        sessionId: session._id,
        completed: true,
        overallReadinessScore: session.overallReadinessScore,
        score: currentQ.score,
        feedback: currentQ.feedback,
      });
    }

    return res.json({
      sessionId: session._id,
      score: currentQ.score,
      feedback: currentQ.feedback,
      nextQuestion,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/interview/finish
 * Body: { sessionId }
 */
export const finishInterview = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid sessionId" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden: not your session" });
    }

    session.status = "completed";
    session.completedAt = new Date();

    const scoredQuestions = session.questions.filter(
      (q) => q.score && q.score.overall != null
    );
    if (scoredQuestions.length > 0) {
      const avg =
        scoredQuestions.reduce((sum, q) => sum + q.score.overall, 0) /
        scoredQuestions.length;
      session.overallReadinessScore = Math.round(avg * 10) / 10;
    }

    await session.save();

    return res.json({ session });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/interview/session/:id
 */
export const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await InterviewSession.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden: not your session" });
    }

    return res.json({ session });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/interview/history
 */
export const getHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.userId })
      .sort({ startedAt: -1 })
      .select("role companyId status overallReadinessScore startedAt")
      .lean();

    return res.json({ sessions });
  } catch (err) {
    next(err);
  }
};
