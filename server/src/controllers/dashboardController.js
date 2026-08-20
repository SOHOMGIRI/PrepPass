import ResumeAnalysis from "../models/ResumeAnalysis.js";
import ResumeDraft from "../models/ResumeDraft.js";
import InterviewSession from "../models/InterviewSession.js";
import TestSession from "../models/TestSession.js";
import GDPracticeSession from "../models/GDPracticeSession.js";

/**
 * GET /api/dashboard/summary
 * Returns cheap summary flags and counts for guiding the user on the dashboard.
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.userId;

    const [
      hasResumeAnalysis,
      hasResumeDraft,
      interviewCount,
      testCount,
      gdCount,
      wrongTestSession,
      lowInterviewSession,
    ] = await Promise.all([
      ResumeAnalysis.exists({ userId }),
      ResumeDraft.exists({ userId }),
      InterviewSession.countDocuments({ userId, status: "completed" }),
      TestSession.countDocuments({
        userId,
        status: { $in: ["completed", "auto-submitted"] },
      }),
      GDPracticeSession.countDocuments({ userId }),
      TestSession.exists({
        userId,
        status: { $in: ["completed", "auto-submitted"] },
        "questions.isCorrect": false,
      }),
      InterviewSession.exists({
        userId,
        status: "completed",
        "questions.score.overall": { $lt: 6 },
      }),
    ]);

    const hasWeakAreaCards = Boolean(wrongTestSession || lowInterviewSession);

    return res.json({
      hasResumeAnalysis: Boolean(hasResumeAnalysis),
      hasResumeDraft: Boolean(hasResumeDraft),
      interviewCount,
      testCount,
      gdCount,
      hasWeakAreaCards,
    });
  } catch (err) {
    next(err);
  }
};
