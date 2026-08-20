import mongoose from "mongoose";
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

/**
 * GET /api/analytics/percentile/:testSessionId
 * Computes anonymized peer percentile rankings per subject and blended overall.
 */
export const getTestPercentile = async (req, res, next) => {
  try {
    const { testSessionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testSessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await TestSession.findById(testSessionId).lean();
    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Ownership check
    if (session.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    if (session.status === "in-progress" || session.scorePercent === null) {
      return res.status(400).json({ message: "Session is not finalized yet" });
    }

    const subjects = session.subjects || [];
    const userScore = session.scorePercent;

    const subjectPercentiles = [];

    for (const subject of subjects) {
      // Find all completed/auto-submitted sessions across ALL users that included this subject
      const allSessionsForSubject = await TestSession.find({
        subjects: subject,
        status: { $in: ["completed", "auto-submitted"] },
        scorePercent: { $ne: null },
      })
        .select("scorePercent")
        .lean();

      const totalSessions = allSessionsForSubject.length;

      if (totalSessions < 5) {
        subjectPercentiles.push({
          subject,
          percentile: null,
          notEnoughData: true,
          totalSessions,
          message: "Not enough data yet for this subject",
        });
      } else {
        const countLowerOrEqual = allSessionsForSubject.filter(
          (s) => s.scorePercent <= userScore
        ).length;

        const percentile = Math.round(
          (countLowerOrEqual / totalSessions) * 100
        );

        subjectPercentiles.push({
          subject,
          percentile,
          notEnoughData: false,
          totalSessions,
        });
      }
    }

    // Blended overall percentile (simple average of valid subject percentiles)
    const validPercentiles = subjectPercentiles
      .filter((sp) => typeof sp.percentile === "number")
      .map((sp) => sp.percentile);

    const overallPercentile =
      validPercentiles.length > 0
        ? Math.round(
            validPercentiles.reduce((a, b) => a + b, 0) / validPercentiles.length
          )
        : null;

    return res.json({
      testSessionId: session._id,
      scorePercent: session.scorePercent,
      subjectPercentiles,
      overallPercentile,
    });
  } catch (err) {
    next(err);
  }
};

