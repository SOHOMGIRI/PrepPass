import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    title: "Resume Matcher",
    desc: "Match your resume to a job description.",
    to: "/resume-matcher",
    stamp: "RESUME",
  },
  {
    title: "View History",
    desc: "Review past sessions and match scores.",
    to: "/history",
    stamp: "HISTORY",
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [avg, setAvg] = useState(null);
  const [count, setCount] = useState(0);
  const displayName = user?.name?.split(" ")[0] || "friend";

  // Average readiness across the user's completed interview sessions.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/interview/history");
        if (cancelled) return;
        const scores = (data?.sessions || [])
          .map((s) => s.overallReadinessScore)
          .filter((v) => typeof v === "number");
        setCount(scores.length);
        if (scores.length) {
          const sum = scores.reduce((a, b) => a + b, 0);
          setAvg(Math.round((sum / scores.length) * 10) / 10);
        } else {
          setAvg(null);
        }
      } catch {
        if (!cancelled) setAvg(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

