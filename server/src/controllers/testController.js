import mongoose from "mongoose";
import TestQuestion from "../models/TestQuestion.js";
import TestSession from "../models/TestSession.js";
import ReportUnlock from "../models/ReportUnlock.js";
import { callGeminiJSON } from "../utils/gemini.js";

/**
 * Helper to generate and save MCQ test questions via Gemini.
 */
async function generateAndSaveTestQuestions(subject, count) {
  const prompt = `Generate exactly ${count} unique, high-quality multiple choice question(s) (MCQs) for the technical/academic subject: "${subject}".
Difficulty: medium.
Each question MUST have exactly 4 plausible option strings and a single correctOptionIndex (0, 1, 2, or 3).
Return ONLY a JSON array of objects with this exact structure:
[
  {
    "questionText": "...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 0,
    "difficulty": "medium"
  }
]
No markdown formatting, no code fences.`;

  const generated = await callGeminiJSON(prompt);
  if (!Array.isArray(generated)) return [];

  const validQuestions = [];
  for (const item of generated) {
    if (
      item &&
      typeof item.questionText === "string" &&
      item.questionText.trim() &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      typeof item.correctOptionIndex === "number" &&
      item.correctOptionIndex >= 0 &&
      item.correctOptionIndex <= 3
    ) {
      validQuestions.push({
        subject: subject.trim(),
        difficulty: item.difficulty || "medium",
        questionText: item.questionText.trim(),
        options: item.options.map((opt) => String(opt).trim()),
        correctOptionIndex: item.correctOptionIndex,
      });
    }
  }

  if (validQuestions.length === 0) return [];

  try {
    const inserted = await TestQuestion.insertMany(validQuestions, {
      ordered: false,
    });
    return inserted;
  } catch (err) {
    // Return any successfully inserted docs
    if (err.insertedDocs && err.insertedDocs.length > 0) {
      return err.insertedDocs;
    }
    return [];
  }
}

/**
 * Helper to grade a session's questions and compute score and trust metrics.
 */
async function gradeSessionQuestions(session) {
  const questionIds = session.questions.map((q) => q.questionId);
  const originalQuestions = await TestQuestion.find({
    _id: { $in: questionIds },
  }).lean();

  const originalMap = new Map(
    originalQuestions.map((oq) => [oq._id.toString(), oq])
  );

  let correctCount = 0;
  for (const q of session.questions) {
    const original = originalMap.get(q.questionId.toString());
    if (
      original &&
      q.selectedIndex !== null &&
      q.selectedIndex !== undefined &&
      q.selectedIndex === original.correctOptionIndex
    ) {
      q.isCorrect = true;
      correctCount += 1;
    } else {
      q.isCorrect = false;
    }
  }

  const total = session.questions.length || 1;
  session.scorePercent = Math.round((correctCount / total) * 100);
}

/**
 * POST /api/test/start
 * Starts a 10-minute proctored MCQ test with 15 questions across 1-3 subjects.
 */
export const startTest = async (req, res, next) => {
  try {
    const { subjects } = req.body || {};

    if (
      !Array.isArray(subjects) ||
      subjects.length < 1 ||
      subjects.length > 3
    ) {
      return res
        .status(400)
        .json({ message: "Please select between 1 and 3 subjects." });
    }

    const cleanSubjects = subjects
      .map((s) => (typeof s === "string" ? s.trim() : ""))
      .filter((s) => s.length > 0);

    if (cleanSubjects.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one valid subject name is required." });
    }

    // Determine question distribution for 15 questions total
    let countsPerSubject = [];
    if (cleanSubjects.length === 1) {
      countsPerSubject = [15];
    } else if (cleanSubjects.length === 2) {
      countsPerSubject = [8, 7];
    } else {
      countsPerSubject = [5, 5, 5];
    }

    let assembledQuestions = [];

    for (let i = 0; i < cleanSubjects.length; i++) {
      const subject = cleanSubjects[i];
      const needed = countsPerSubject[i];

      let bank = await TestQuestion.find({ subject }).lean();

      if (bank.length < needed) {
        const shortfall = needed - bank.length;
        await generateAndSaveTestQuestions(subject, shortfall);
        bank = await TestQuestion.find({ subject }).lean();
      }

      // If still fewer, generate generous batch
      if (bank.length < needed) {
        await generateAndSaveTestQuestions(subject, needed);
        bank = await TestQuestion.find({ subject }).lean();
      }

      const selected = bank.slice(0, needed);
      assembledQuestions.push(...selected);
    }

    if (assembledQuestions.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to assemble test questions. Please try again." });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    const sessionQuestions = assembledQuestions.map((q) => ({
      questionId: q._id,
      questionText: q.questionText,
      options: q.options,
      selectedIndex: null,
      isCorrect: null,
    }));

    const session = new TestSession({
      userId: req.userId,
      subjects: cleanSubjects,
      status: "in-progress",
      startedAt: now,
      expiresAt,
      questions: sessionQuestions,
      violationCount: 0,
      trustScore: 100,
    });

    await session.save();

    // Strip correctOptionIndex completely so client receives zero answer leak
    const clientQuestions = session.questions.map((q) => ({
      _id: q._id,
      questionId: q.questionId,
      questionText: q.questionText,
      options: q.options,
      selectedIndex: q.selectedIndex,
    }));

    return res.status(201).json({
      sessionId: session._id,
      expiresAt: session.expiresAt,
      questions: clientQuestions,
      subjects: session.subjects,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/test/answer
 * Autosaves selected answer index for a question in an in-progress session.
 */
export const recordAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionId, selectedIndex } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership check
    if (session.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    if (session.status !== "in-progress") {
      return res
        .status(400)
        .json({ message: "Test session is already finalized" });
    }

    const question = session.questions.find(
      (q) =>
        q._id.toString() === questionId ||
        q.questionId.toString() === questionId
    );

    if (question && typeof selectedIndex === "number" && selectedIndex >= 0 && selectedIndex <= 3) {
      question.selectedIndex = selectedIndex;
      await session.save();
    }

    return res.json({ message: "Answer saved" });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/test/violation
 * Increments proctoring violation count. Auto-submits test if violations reach 3.
 */
export const recordViolation = async (req, res, next) => {
  try {
    const { sessionId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership check
    if (session.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    if (session.status !== "in-progress") {
      return res.json({ forceSubmit: true, result: session });
    }

    session.violationCount += 1;

    if (session.violationCount >= 3) {
      // Auto-submit immediately with trustScore = 0
      await gradeSessionQuestions(session);
      session.status = "auto-submitted";
      session.trustScore = 0;
      session.completedAt = new Date();
      await session.save();

      return res.json({
        forceSubmit: true,
        violationCount: session.violationCount,
        result: session,
      });
    }

    await session.save();

    return res.json({
      forceSubmit: false,
      violationCount: session.violationCount,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/test/submit
 * Finalizes test, grades answers, and computes final trust score based on violation count.
 */
export const submitTest = async (req, res, next) => {
  try {
    const { sessionId } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership check
    if (session.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    // If already finalized, return existing result idempotently
    if (session.status !== "in-progress") {
      return res.json({ result: session });
    }

    const now = new Date();
    // 5-second grace period past expiresAt
    if (now.getTime() > new Date(session.expiresAt).getTime() + 5000) {
      session.autoSubmittedByTimeout = true;
    }

    // Grade questions
    await gradeSessionQuestions(session);

    // Compute trustScore scale: 0 violations = 100, 1 = 70, 2 = 40, 3+ = 0
    if (session.violationCount === 0) {
      session.trustScore = 100;
    } else if (session.violationCount === 1) {
      session.trustScore = 70;
    } else if (session.violationCount === 2) {
      session.trustScore = 40;
    } else {
      session.trustScore = 0;
    }

    session.status = "completed";
    session.completedAt = now;
    await session.save();

    return res.json({ result: session });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/test/session/:id
 * Fetches full session details.
 */
export const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(id).lean();
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership check
    if (session.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    return res.json({ session });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/test/history
 * Fetches all past test sessions for current user.
 */
export const getHistory = async (req, res, next) => {
  try {
    const sessions = await TestSession.find({ userId: req.userId })
      .sort({ startedAt: -1 })
      .select(
        "subjects status scorePercent trustScore violationCount autoSubmittedByTimeout startedAt completedAt"
      )
      .lean();

    return res.json({ sessions });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/test/session/:id/detailed-report
 * Returns full detailed performance analytics, subject-wise accuracy, and wrong-question review.
 * Protected by ReportUnlock status: "paid" check. Returns 402 if not unlocked.
 */
export const getDetailedReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(id).lean();
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership check
    if (session.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    // Check if report has been unlocked via paid order
    const unlock = await ReportUnlock.findOne({
      userId: req.userId,
      testSessionId: id,
      status: "paid",
    }).lean();

    if (!unlock) {
      return res.status(402).json({
        message: "Detailed report requires unlock",
        unlocked: false,
      });
    }

    // Fetch original questions to extract correct answers and subjects
    const questionIds = session.questions.map((q) => q.questionId);
    const originalQuestions = await TestQuestion.find({
      _id: { $in: questionIds },
    }).lean();

    const originalMap = new Map(
      originalQuestions.map((oq) => [oq._id.toString(), oq])
    );

    // Subject breakdown
    const subjectStats = {};
    for (const sub of session.subjects || []) {
      subjectStats[sub] = { total: 0, correct: 0 };
    }

    const questionDetails = session.questions.map((q, idx) => {
      const oq = originalMap.get(q.questionId?.toString());
      const sub = oq?.subject || session.subjects[0] || "General";
      if (!subjectStats[sub]) subjectStats[sub] = { total: 0, correct: 0 };
      subjectStats[sub].total += 1;
      if (q.isCorrect) subjectStats[sub].correct += 1;

      return {
        index: idx + 1,
        questionText: q.questionText,
        options: q.options,
        selectedIndex: q.selectedIndex,
        selectedOptionText:
          q.selectedIndex !== null && q.options && q.options[q.selectedIndex]
            ? q.options[q.selectedIndex]
            : "Not Answered",
        correctOptionIndex: oq ? oq.correctOptionIndex : null,
        correctOptionText:
          oq && oq.options && oq.options[oq.correctOptionIndex]
            ? oq.options[oq.correctOptionIndex]
            : "",
        isCorrect: q.isCorrect,
        subject: sub,
      };
    });

    const subjectBreakdown = Object.keys(subjectStats).map((sub) => {
      const s = subjectStats[sub];
      return {
        subject: sub,
        total: s.total,
        correct: s.correct,
        accuracyPercent:
          s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      };
    });

    const wrongAnswers = questionDetails.filter((q) => !q.isCorrect);

    const weakAreas = subjectBreakdown
      .filter((s) => s.accuracyPercent < 70)
      .map((s) => `Revise ${s.subject} (Accuracy: ${s.accuracyPercent}%)`);

    if (weakAreas.length === 0) {
      weakAreas.push(
        "Strong performance across all tested subjects! Focus on speed and edge-case MCQs."
      );
    }

    return res.json({
      unlocked: true,
      report: {
        sessionId: session._id,
        subjects: session.subjects,
        scorePercent: session.scorePercent,
        trustScore: session.trustScore,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        totalQuestions: session.questions.length,
        correctCount: session.questions.filter((q) => q.isCorrect).length,
        subjectBreakdown,
        wrongAnswers,
        allQuestions: questionDetails,
        weakAreas,
        paidAt: unlock.paidAt,
        referenceCode: unlock.referenceCode,
      },
    });
  } catch (err) {
    next(err);
  }
};

