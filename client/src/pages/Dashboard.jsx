import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const cards = [
  {
    title: "Start Interview",
    desc: "Practice with four adaptive questions.",
    to: "/interview",
    stamp: "INTERVIEW",
  },
  {
    title: "Test Mode",
    desc: "10-min proctored MCQ test with trust scoring.",
    to: "/test-mode",
    stamp: "TEST MODE",
  },
  {
    title: "Aptitude Practice",
    desc: "Untimed practice for Quants, Logic & Verbal.",
    to: "/aptitude",
    stamp: "APTITUDE",
  },
  {
    title: "Revision Deck",
    desc: "Flashcards generated from missed questions & feedback.",
    to: "/revision-deck",
    stamp: "REVISION DECK",
  },
  {
    title: "Company Prep",
    desc: "Targeted tracks for TCS, Amazon, Google & more.",
    to: "/company-prep",
    stamp: "COMPANY PREP",
  },
  {
    title: "Resume Builder",
    desc: "Create an ATS-friendly resume with AI bullet points.",
    to: "/resume-builder",
    stamp: "RESUME BUILDER",
  },
  {
    title: "GD Practice",
    desc: "Rehearse group discussions with AI rebuttal.",
    to: "/gd-practice",
    stamp: "GD PRACTICE",
  },
  {
    title: "Resume Matcher",
    desc: "Match your resume to a job description.",
    to: "/resume-matcher",
    stamp: "RESUME MATCH",
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

// Custom tooltip styled like an exam ticket
function CustomTrendTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-stamp-navy/20 bg-white p-3 font-mono text-xs shadow-md space-y-1">
        <p className="font-bold text-stamp-navy">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{entry.name}:</span>
            <span className="font-bold">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [hasInterview, setHasInterview] = useState(false);
  const [hasTest, setHasTest] = useState(false);
  const [hasGd, setHasGd] = useState(false);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const displayName = user?.name?.split(" ")[0] || "friend";

  // Average readiness across user's completed interview sessions & Readiness Trends
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ivRes, trendRes] = await Promise.all([
          api.get("/interview/history"),
          api.get("/analytics/trend"),
        ]);

        if (cancelled) return;

        // Average calculation
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

        // Trend formatting
        const { interviewTrend = [], testTrend = [], gdTrend = [] } =
          trendRes.data || {};

        setHasInterview(interviewTrend.length > 0);
        setHasTest(testTrend.length > 0);
        setHasGd(gdTrend.length > 0);

        // Combine into unified chronological dataset
        const mergedMap = new Map();

        const addPoint = (item, type, score) => {
          if (!item.date || typeof score !== "number") return;
          const key = new Date(item.date).toISOString().slice(0, 16); // Minute precision
          const dateLabel = fmtDateShort(item.date);
          const current = mergedMap.get(key) || { date: item.date, displayDate: dateLabel };
          current[type] = score;
          mergedMap.set(key, current);
        };

        // Interviews: 0-10 scale -> 0-100%
        interviewTrend.forEach((i) =>
          addPoint(i, "interview", Math.round(i.score <= 10 ? i.score * 10 : i.score))
        );

        // Tests: 0-100%
        testTrend.forEach((t) => addPoint(t, "test", Math.round(t.score)));

        // GD: 0-10 scale -> 0-100%
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
    return () => {
      cancelled = true;
    };
  }, []);

  const hasAnyTrend = hasInterview || hasTest || hasGd;

  return (
    <div className="min-h-screen bg-cream px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl text-stamp-navy">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-1 text-ink/60">
              Your exam passport is ready. Pick an activity below.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-stamp-navy px-4 py-2 font-mono text-xs text-stamp-navy hover:bg-stamp-navy/10 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2"
          >
            LOG OUT
          </button>
        </div>

        <div className="ticket-perf my-8" />

        {/* Summary strip */}
        <div className="ticket-card flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
          {avg != null ? (
            <>
              <div>
                <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-stamp-navy">
                  YOUR AVERAGE
                </div>
                <p className="mt-2 max-w-xs text-sm text-ink/70">
                  Average readiness across {count} completed interview session
                  {count === 1 ? "" : "s"}.
                </p>
              </div>
              <GaugeCircle
                value={avg}
                max={10}
                size={140}
                caption="Readiness Score"
              />
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
        </div>

        {/* Readiness Trend Chart */}
        <div className="ticket-card mt-6 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="ticket-stamp inline-block rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-stamp-navy">
                PERFORMANCE ANALYTICS
              </div>
              <h2 className="font-heading text-xl text-stamp-navy mt-1">
                Your Readiness Trend
              </h2>
            </div>
            {hasAnyTrend && (
              <span className="font-mono text-xs text-stamp-navy/60 hidden sm:inline">
                Normalized Accuracy & Readiness (0–100%)
              </span>
            )}
          </div>

          {loadingTrend ? (
            <div className="flex h-56 items-center justify-center font-mono text-xs text-stamp-navy/60">
              Loading performance trends…
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

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="ticket-card block p-6 transition-colors hover:border-stamp-navy/50"
            >
              <div className="ticket-stamp inline-block rounded px-2 py-1 font-mono text-[10px] mb-3 text-stamp-navy">
                {c.stamp}
              </div>
              <h2 className="font-heading text-lg text-stamp-navy">
                {c.title}
              </h2>
              <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

