import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";
import { Skeleton } from "../components/ui/skeleton.jsx";

const section1Cards = [
  {
    title: "Resume Analysis",
    desc: "Instant ATS audit and suggested prep topics.",
    to: "/resume-analysis",
    stamp: "ATS AUDIT",
  },
  {
    title: "Resume Matcher",
    desc: "Match your resume to a job description.",
    to: "/resume-matcher",
    stamp: "RESUME MATCH",
  },
];

const section2Cards = [
  {
    title: "Resume Builder",
    desc: "Create an ATS-friendly resume with AI bullet points.",
    to: "/resume-builder",
    stamp: "RESUME BUILDER",
  },
];

const section3Cards = [
  {
    title: "Aptitude Practice",
    desc: "Untimed practice for Quants, Logic & Verbal.",
    to: "/aptitude",
    stamp: "APTITUDE",
  },
  {
    title: "Test Mode",
    desc: "10-min proctored MCQ test with trust scoring.",
    to: "/test-mode",
    stamp: "TEST MODE",
  },
  {
    title: "Start Interview",
    desc: "Practice with four adaptive questions.",
    to: "/interview",
    stamp: "INTERVIEW",
  },
  {
    title: "GD Practice",
    desc: "Rehearse group discussions with AI rebuttal.",
    to: "/gd-practice",
    stamp: "GD PRACTICE",
  },
  {
    title: "Company Prep",
    desc: "Targeted tracks for TCS, Amazon, Google & more.",
    to: "/company-prep",
    stamp: "COMPANY PREP",
  },
];

const section4Cards = [
  {
    title: "Revision Deck",
    desc: "Flashcards generated from missed questions & feedback.",
    to: "/revision-deck",
    stamp: "REVISION DECK",
  },
  {
    title: "View History",
    desc: "Review past sessions and match scores.",
    to: "/history",
    stamp: "HISTORY",
  },
];

function fmtDateShort(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function CustomTrendTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stamp-navy/20 bg-white p-3 font-mono text-xs shadow-md space-y-1">
        <p className="font-bold text-stamp-navy">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}:</span>
            <span className="font-bold">
              <CountUp end={entry.value} duration={0.5} />%
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function getRecommendation(summary) {
  if (!summary) return null;
  if (!summary.hasResumeAnalysis) {
    return {
      title: "Start by uploading your resume for an ATS score",
      desc: "Upload your resume to get instant ATS feedback, identify missing keywords, and unlock personalized subject recommendations.",
      to: "/resume-matcher",
      buttonText: "Upload Resume ↗",
      badge: "RECOMMENDED NEXT STEP",
    };
  }
  if (summary.interviewCount === 0 && summary.testCount === 0) {
    return {
      title: "Try your first practice — Aptitude or a Mock Interview",
      desc: "Warm up with untimed aptitude drills or jump straight into an adaptive 4-question mock interview.",
      to: "/aptitude",
      buttonText: "Start Practice ↗",
      badge: "RECOMMENDED NEXT STEP",
    };
  }
  if (summary.hasWeakAreaCards) {
    return {
      title: "You have weak areas to review",
      desc: "Reinforce your concepts by going through interactive flashcards built from your missed questions and feedback.",
      to: "/revision-deck",
      buttonText: "Open Revision Deck ↗",
      badge: "RECOMMENDED NEXT STEP",
    };
  }
  return {
    title: "Keep your streak going — try Company Prep or GD Practice",
    desc: "Sharpen recruitment patterns for top recruiters or rehearse group discussions with AI counter-arguments.",
    to: "/company-prep",
    buttonText: "Explore Company Prep ↗",
    badge: "RECOMMENDED NEXT STEP",
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [hasInterview, setHasInterview] = useState(false);
  const [hasTest, setHasTest] = useState(false);
  const [hasGd, setHasGd] = useState(false);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [summary, setSummary] = useState(null);
  const displayName = user?.name?.split(" ")[0] || "friend";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ivRes, trendRes, summaryRes] = await Promise.all([
          api.get("/interview/history"),
          api.get("/analytics/trend"),
          api.get("/dashboard/summary"),
        ]);

        if (cancelled) return;

        if (summaryRes?.data) setSummary(summaryRes.data);

        const scores = (ivRes.data?.sessions || [])
          .map((s) => s.overallReadinessScore)
          .filter((v) => typeof v === "number");
        setCount(scores.length);
        if (scores.length) {
          const sum = scores.reduce((a, b) => a + b, 0);
          setAvg(Math.round((sum / scores.length) * 10) / 10);
        } else {
          setAvg(null);
        }

        const { interviewTrend = [], testTrend = [], gdTrend = [] } = trendRes.data || {};
        setHasInterview(interviewTrend.length > 0);
        setHasTest(testTrend.length > 0);
        setHasGd(gdTrend.length > 0);

        const mergedMap = new Map();
        const addPoint = (item, type, score) => {
          if (!item.date || typeof score !== "number") return;
          const key = new Date(item.date).toISOString().slice(0, 16);
          const dateLabel = fmtDateShort(item.date);
          const current = mergedMap.get(key) || { date: item.date, displayDate: dateLabel };
          current[type] = score;
          mergedMap.set(key, current);
        };

        interviewTrend.forEach((i) =>
          addPoint(i, "interview", Math.round(i.score <= 10 ? i.score * 10 : i.score))
        );
        testTrend.forEach((t) => addPoint(t, "test", Math.round(t.score)));
        gdTrend.forEach((g) =>
          addPoint(g, "gd", Math.round(g.score <= 10 ? g.score * 10 : g.score))
        );

        const chronological = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setTrendData(chronological);
      } catch {
        if (!cancelled) {
          setAvg(null);
          setTrendData([]);
        }
      } finally {
        if (!cancelled) setLoadingTrend(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const hasAnyTrend = hasInterview || hasTest || hasGd;
  const recommendation = getRecommendation(summary);

  return (
    <div className="min-h-screen bg-cream px-6 py-10">
      <motion.div 
        className="mx-auto max-w-4xl space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl text-stamp-navy">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-1 text-ink/60">
              Your exam passport is ready. Follow your guided preparation path below.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-stamp-navy px-4 py-2 font-mono text-xs text-stamp-navy hover:bg-stamp-navy/10 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2"
          >
            LOG OUT
          </button>
        </motion.div>

        {recommendation && (
          <motion.div variants={itemVariants} className="ticket-card p-6 border-2 border-gold/40 bg-gradient-to-br from-ticket/90 via-cream to-ticket/60 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎯</span>
                  <span className="ticket-stamp inline-block rounded bg-gold/20 px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-stamp-navy">
                    {recommendation.badge}
                  </span>
                </div>
                <h2 className="font-heading text-lg text-stamp-navy sm:text-xl">
                  {recommendation.title}
                </h2>
                <p className="text-xs text-ink/70 max-w-xl leading-relaxed">
                  {recommendation.desc}
                </p>
              </div>
              <Link
                to={recommendation.to}
                className="inline-flex items-center justify-center shrink-0 rounded-lg bg-gold px-5 py-2.5 font-heading text-xs font-semibold text-white hover:bg-gold-dark shadow-sm transition"
              >
                {recommendation.buttonText}
              </Link>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="ticket-perf my-4" />

        <motion.div variants={itemVariants} className="ticket-card flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
          {avg != null ? (
            <>
              <div>
                <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-stamp-navy">
                  YOUR AVERAGE
                </div>
                <p className="mt-2 max-w-xs text-sm text-ink/70">
                  Average readiness across <CountUp end={count} duration={1} /> completed interview session
                  {count === 1 ? "" : "s"}.
                </p>
              </div>
              <div className="transition-transform duration-700 ease-out">
                <GaugeCircle
                  value={avg}
                  max={10}
                  size={140}
                  caption="Readiness Score"
                />
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-md text-center">
              <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-stamp-navy">
                FIRST TIME HERE?
              </div>
              <p className="mt-3 text-sm text-ink/70">
                No sessions yet — your readiness score will appear here once you
                finish an interview. Go ahead, your auditor is waiting.
              </p>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
              01
            </span>
            <h2 className="font-heading text-lg text-stamp-navy">
              1. Know Where You Stand
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {section1Cards.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="ticket-card block p-6 transition-all duration-200 hover:border-stamp-navy/50 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] mb-3 text-stamp-navy">
                  {c.stamp}
                </div>
                <h3 className="font-heading text-lg text-stamp-navy">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
              02
            </span>
            <h2 className="font-heading text-lg text-stamp-navy">
              2. Build & Improve
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {section2Cards.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="ticket-card block p-6 transition-all duration-200 hover:border-stamp-navy/50 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] mb-3 text-stamp-navy">
                  {c.stamp}
                </div>
                <h3 className="font-heading text-lg text-stamp-navy">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
              03
            </span>
            <h2 className="font-heading text-lg text-stamp-navy">
              3. Practice & Rehearse
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section3Cards.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="ticket-card block p-6 transition-all duration-200 hover:border-stamp-navy/50 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] mb-3 text-stamp-navy">
                  {c.stamp}
                </div>
                <h3 className="font-heading text-lg text-stamp-navy">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
              04
            </span>
            <h2 className="font-heading text-lg text-stamp-navy">
              4. Review & Track
            </h2>
          </div>

          <div className="ticket-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="ticket-stamp inline-block rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-stamp-navy">
                  PERFORMANCE ANALYTICS
                </div>
                <h3 className="font-heading text-xl text-stamp-navy mt-1">
                  Your Readiness Trend
                </h3>
              </div>
              {hasAnyTrend && (
                <span className="font-mono text-xs text-stamp-navy/60 hidden sm:inline">
                  Normalized Accuracy & Readiness (0–100%)
                </span>
              )}
            </div>

            {loadingTrend ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-56 w-full rounded-lg" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ) : !hasAnyTrend ? (
              <div className="flex h-44 flex-col items-center justify-center text-center p-4">
                <p className="font-mono text-xs text-ink/60 max-w-sm">
                  No activity trend recorded yet. Complete an interview, proctored test, or GD session to visualize your progress over time!
                </p>
              </div>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#0a192f15" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 11, fill: "#0a192f90", fontFamily: "monospace" }}
                      stroke="#0a192f30"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#0a192f90", fontFamily: "monospace" }}
                      stroke="#0a192f30"
                      unit="%"
                    />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: "12px", fontFamily: "monospace", paddingTop: "8px" }}
                    />
                    {hasInterview && (
                      <Line
                        type="monotone"
                        dataKey="interview"
                        name="Interview Readiness"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#d97706" }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    )}
                    {hasTest && (
                      <Line
                        type="monotone"
                        dataKey="test"
                        name="Test Accuracy"
                        stroke="#0a192f"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#0a192f" }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    )}
                    {hasGd && (
                      <Line
                        type="monotone"
                        dataKey="gd"
                        name="GD Performance"
                        stroke="#881337"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#881337" }}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {section4Cards.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="ticket-card block p-6 transition-all duration-200 hover:border-stamp-navy/50 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] mb-3 text-stamp-navy">
                  {c.stamp}
                </div>
                <h3 className="font-heading text-lg text-stamp-navy">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
