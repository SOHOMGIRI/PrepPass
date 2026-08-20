import mongoose from "mongoose";
import TestSession from "../models/TestSession.js";
import TestQuestion from "../models/TestQuestion.js";
import InterviewSession from "../models/InterviewSession.js";
import RevisionCardStatus from "../models/RevisionCardStatus.js";

/**
 * GET /api/revision/deck
 * Aggregates weak-area questions from Test Sessions (wrong answers) and Interview Sessions (score < 6).
 */
export const getRevisionDeck = async (req, res, next) => {
  try {
    const { includeMastered } = req.query || {};
    const showMastered =
      includeMastered === "true" || includeMastered === true;

    // 1. Fetch Test Sessions for user (sorted newest first)
    const testSessions = await TestSession.find({
      userId: req.userId,
      status: { $in: ["completed", "auto-submitted"] },
    })
      .sort({ startedAt: -1 })
      .lean();

    const wrongTestQuestions = [];
    const seenQuestionIds = new Set();

    for (const session of testSessions) {
      for (const q of session.questions || []) {
        if (q.isCorrect === false && q.questionId) {
          const qIdStr = q.questionId.toString();
          if (!seenQuestionIds.has(qIdStr)) {
            seenQuestionIds.add(qIdStr);
            wrongTestQuestions.push({
              questionId: q.questionId,
              questionText: q.questionText,
              options: q.options,
              selectedIndex: q.selectedIndex,
              sourceDate: session.completedAt || session.startedAt,
              sessionSubjects: session.subjects,
            });
          }
        }
        if (wrongTestQuestions.length >= 30) break;
      }
      if (wrongTestQuestions.length >= 30) break;
    }

    // Populate TestQuestion details (correctOptionIndex, explanation, subject)
    const testQuestionIds = wrongTestQuestions.map((q) => q.questionId);
    const populatedTestQuestions = await TestQuestion.find({
      _id: { $in: testQuestionIds },
    }).lean();

    const testQuestionMap = new Map(
      populatedTestQuestions.map((tq) => [tq._id.toString(), tq])
    );

    const testCards = wrongTestQuestions.map((q) => {
      const tq = testQuestionMap.get(q.questionId.toString());
      const correctIdx = tq ? tq.correctOptionIndex : null;
      const opts = tq?.options || q.options || [];
      const correctText =
        correctIdx !== null && opts[correctIdx]
          ? opts[correctIdx]
          : "Review answer options";
      const explanation = tq?.explanation ? `\n\nExplanation: ${tq.explanation}` : "";

      return {
        cardKey: `test:${q.questionId.toString()}`,
        type: "test",
        front: q.questionText,
        back: `Correct Answer: ${correctText}${explanation}`,
        correctAnswer: correctText,
        explanation: tq?.explanation || null,
        options: opts,
        subjectOrRole: tq?.subject || q.sessionSubjects?.[0] || "Technical MCQ",
        sourceDate: q.sourceDate,
      };
    });

    // 2. Fetch Interview Sessions for user (sorted newest first)
    const interviewSessions = await InterviewSession.find({
      userId: req.userId,
      status: "completed",
    })
      .sort({ startedAt: -1 })
      .lean();

    const interviewCards = [];
    const seenInterviewQs = new Set();

    for (const session of interviewSessions) {
      for (const q of session.questions || []) {
        const overallScore = q.score?.overall;
        if (typeof overallScore === "number" && overallScore < 6) {
          const qKey = q._id ? q._id.toString() : q.questionText.trim();
          if (!seenInterviewQs.has(qKey)) {
            seenInterviewQs.add(qKey);
            interviewCards.push({
              cardKey: `interview:${qKey}`,
              type: "interview",
              front: q.questionText,
              back:
                q.feedback ||
                "Review core concepts, problem-solving structure, and communication clarity for this question.",
              feedback: q.feedback || "",
              score: q.score,
              userAnswer: q.answerText || "",
              subjectOrRole: session.role || q.category || "Interview Response",
              sourceDate: session.completedAt || session.startedAt,
            });
          }
        }
        if (interviewCards.length >= 20) break;
      }
      if (interviewCards.length >= 20) break;
    }

    // 3. Combine cards
    let allCards = [...testCards, ...interviewCards];

    // 4. Fetch RevisionCardStatus for user
    const cardStatuses = await RevisionCardStatus.find({
      userId: req.userId,
    }).lean();

    const statusMap = new Map(
      cardStatuses.map((cs) => [cs.cardKey, cs.status])
    );

    // Attach status to each card
    allCards = allCards.map((card) => ({
      ...card,
      status: statusMap.get(card.cardKey) || "learning",
    }));

    // Filter out mastered cards if not requested
    if (!showMastered) {
      allCards = allCards.filter((card) => card.status !== "mastered");
    }

    // Count statistics
    const masteredCount = cardStatuses.filter((s) => s.status === "mastered").length;
    const learningCount = allCards.filter((s) => s.status === "learning").length;

    return res.json({
      deck: allCards,
      totalCount: allCards.length,
      masteredCount,
      learningCount,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/revision/mark
 * Marks a card as "learning" or "mastered".
 */
export const markCardStatus = async (req, res, next) => {
  try {
    const { cardKey, status } = req.body || {};

    if (!cardKey || typeof cardKey !== "string") {
      return res.status(400).json({ message: "cardKey is required" });
    }

    if (!["learning", "mastered"].includes(status)) {
      return res.status(400).json({
        message: 'status must be either "learning" or "mastered"',
      });
    }

    const updated = await RevisionCardStatus.findOneAndUpdate(
      { userId: req.userId, cardKey: cardKey.trim() },
      {
        userId: req.userId,
        cardKey: cardKey.trim(),
        status,
        updatedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({
      message: `Card marked as ${status}`,
      cardKey: updated.cardKey,
      status: updated.status,
    });
  } catch (err) {
    next(err);
  }
};
