import InterviewSession from "../models/InterviewSession.js";
import TestSession from "../models/TestSession.js";
import GDPracticeSession from "../models/GDPracticeSession.js";

/**
 * GET /api/analytics/trend
 * Returns readiness trends for Interviews, Tests, and GD Practice sessions.
 */
export const getReadinessTrend = async (req, res, next) => {
  try {
    const userId = req.userId;

    // 1. Interview Sessions (most recent 20 completed sessions, sorted by date ascending)
    const interviewSessions = await InterviewSession.find({
      userId,
      status: "completed",
      overallReadinessScore: { $ne: null },
    })
      .sort({ completedAt: -1, startedAt: -1 })
      .limit(20)
      .select("overallReadinessScore completedAt startedAt")
      .lean();

    const interviewTrend = interviewSessions
      .reverse()
      .map((s) => ({
        date: s.completedAt || s.startedAt,
        score: s.overallReadinessScore,
      }));

    // 2. Test Sessions (most recent 20 finalized sessions, sorted by date ascending)
    const testSessions = await TestSession.find({
      userId,
      status: { $in: ["completed", "auto-submitted"] },
      scorePercent: { $ne: null },
    })
      .sort({ completedAt: -1, startedAt: -1 })
      .limit(20)
      .select("scorePercent completedAt startedAt")
      .lean();

    const testTrend = testSessions
      .reverse()
      .map((s) => ({
        date: s.completedAt || s.startedAt,
        score: s.scorePercent,
      }));

    // 3. GD Practice Sessions (most recent 20 sessions, sorted by date ascending)
    const gdSessions = await GDPracticeSession.find({
      userId,
      "score.overall": { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("score.overall createdAt")
      .lean();

    const gdTrend = gdSessions
      .reverse()
      .map((s) => ({
        date: s.createdAt,
        score: s.score?.overall,
      }));

    return res.json({
      interviewTrend,
      testTrend,
      gdTrend,
    });
  } catch (err) {
    next(err);
  }
};
