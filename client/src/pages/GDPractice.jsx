import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";

const CATEGORIES = [
  "All",
  "Current Affairs",
  "Abstract",
  "Controversial/Debate",
  "Business & Economy",
  "Technology & Society",
];

const SCORE_DIMENSIONS = [
  { key: "clarity", label: "Clarity & Articulation" },
  { key: "structure", label: "Structure & Flow" },
  { key: "persuasiveness", label: "Persuasiveness & Impact" },
  { key: "overall", label: "Overall GD Score" },
];

export default function GDPractice() {
  const [phase, setPhase] = useState("select"); // "select" | "write" | "result"
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userArgument, setUserArgument] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Fetch topics on load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/gd/topics");
        if (!cancelled) setTopics(data.topics || []);
      } catch {
        if (!cancelled) setTopics([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTopics = topics.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  const handleSelectTopic = (t) => {
    setSelectedTopic(t);
    setUserArgument("");
    setError("");
    setPhase("write");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userArgument.trim().length < 20) {
      setError("Your argument must be at least 20 characters long.");
      return;
    }
    if (userArgument.trim().length > 2000) {
      setError("Your argument must not exceed 2000 characters.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/gd/practice", {
        topicId: selectedTopic._id,
        userArgument: userArgument.trim(),
      });
      setResult(data.session);
      setPhase("result");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not submit your argument for evaluation. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleResetSameTopic = () => {
    setUserArgument("");
    setError("");
    setPhase("write");
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setUserArgument("");
    setError("");
    setResult(null);
    setPhase("select");
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="font-mono text-xs text-text-primary/70 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          {phase !== "select" && (
            <button
              type="button"
              onClick={handleBackToTopics}
              className="font-mono text-xs text-text-primary/70 hover:underline"
            >
              Browse All Topics
            </button>
          )}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {/* Phase 1: Topic Selection */}
        {phase === "select" && (
          <div className="ticket-card mt-6 p-6 sm:p-8">
            <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
              PREPPASS — GROUP DISCUSSION
            </div>
            <h1 className="mt-3 font-heading text-2xl text-text-primary">
              Select a topic for GD practice.
            </h1>
            <p className="mt-1 text-sm text-text-secondary/60">
              Formulate your opening statement, receive expert scoring, and prepare for tough panel rebuttals.
            </p>

            {/* Category Pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-wide transition ${
                    selectedCategory === cat
                      ? "bg-stamp-navy text-gold"
                      : "bg-stamp-navy/10 text-text-primary hover:bg-stamp-navy/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Topics Grid */}
            {loading ? (
              <p className="mt-8 text-center text-sm text-text-secondary/50">
                Loading group discussion topics…
              </p>
            ) : filteredTopics.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm text-text-secondary/60">
                  No topics found in this category yet. Run the seed script or select "All".
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {filteredTopics.map((t) => (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => handleSelectTopic(t)}
                    className="ticket-card group block w-full p-5 text-left transition hover:border-white/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-text-primary/60">
                        {t.category}
                      </span>
                      <span className="font-mono text-xs text-gold opacity-0 transition group-hover:opacity-100">
                        Start Practice →
                      </span>
                    </div>
                    <p className="mt-1.5 font-heading text-base text-text-primary">
                      {t.topicText}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Write Opening Argument */}
        {phase === "write" && selectedTopic && (
          <div className="ticket-card mt-6 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
                GD PRACTICE · {selectedTopic.category}
              </div>
              <span className="font-mono text-xs text-text-secondary/40">
                20–2000 characters
              </span>
            </div>

            <h1 className="mt-3 font-heading text-xl text-text-primary sm:text-2xl">
              {selectedTopic.topicText}
            </h1>
            <p className="mt-1.5 text-xs text-text-secondary/60">
              State your initial position clearly. Include a strong opening hook, 2–3 supporting points or real-world examples, and a conclusive closing stance.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <textarea
                  rows={7}
                  placeholder="State your opening argument clearly. E.g., 'Good morning everyone. Today we are discussing whether AI will replace human software engineers. In my view, AI acts as a multiplier rather than a replacement for three reasons...'"
                  value={userArgument}
                  onChange={(e) => setUserArgument(e.target.value)}
                  disabled={busy}
                  className="w-full rounded-lg border border-white/10 bg-surface p-4 font-sans text-sm text-text-secondary placeholder-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/30 disabled:opacity-60"
                />
                <div className="mt-1.5 flex justify-between font-mono text-[11px] text-text-secondary/50">
                  <span>Minimum 20 characters</span>
                  <span
                    className={
                      userArgument.length > 2000
                        ? "text-stamp-maroon font-bold"
                        : ""
                    }
                  >
                    {userArgument.length} / 2000
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleBackToTopics}
                  disabled={busy}
                  className="rounded-lg border border-white/10 px-5 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5 disabled:opacity-60"
                >
                  Choose Different Topic
                </button>
                <button
                  type="submit"
                  disabled={busy || userArgument.trim().length < 20}
                  className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-sm font-semibold tracking-wider text-gold hover:bg-stamp-navy/90 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 disabled:opacity-50"
                >
                  {busy ? "Evaluating with AI…" : "Submit Argument for Evaluation"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Phase 3: Results & Counterpoints */}
        {phase === "result" && result && (
          <div className="ticket-card mt-6 p-6 sm:p-8">
            <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
              PREPPASS — EVALUATION REPORT
            </div>
            <h1 className="mt-3 font-heading text-2xl text-text-primary">
              Argument Evaluated.
            </h1>
            <p className="mt-1 font-mono text-xs text-text-primary/60">
              Topic: {result.topicText}
            </p>

            {/* Gauge Circle Score */}
            <div className="mt-8 flex flex-col items-center">
              <GaugeCircle
                value={result.score?.overall ?? 0}
                max={10}
                size={160}
                caption="Overall GD Score"
              />
            </div>

            {/* Score Breakdown */}
            <div className="mt-8 space-y-3">
              <h2 className="font-heading text-xs uppercase tracking-wider text-text-primary/70">
                Performance Dimensions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {SCORE_DIMENSIONS.map(({ key, label }) => {
                  const val = Number(result.score?.[key]) || 0;
                  const pct = Math.max(0, Math.min(100, (val / 10) * 100));
                  return (
                    <div
                      key={key}
                      className="rounded-lg border border-white/10 bg-surface/60 p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-primary/70">
                          {label}
                        </span>
                        <span className="font-mono text-sm font-semibold text-text-primary">
                          {Math.round(val * 10) / 10} / 10
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stamp-navy/10">
                        <div
                          className="h-full rounded-full bg-gold"
                          style={{ width: `${pct}%`, transition: "width 0.7s ease" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ticket-perf my-8" />

            {/* Panel Feedback */}
            <div>
              <h2 className="font-heading text-xs uppercase tracking-wider text-text-primary/70">
                Evaluator Feedback
              </h2>
              <div className="mt-2.5 rounded-lg border border-white/10 bg-surface/80 p-4 text-sm text-text-secondary/80 leading-relaxed">
                {result.feedback || "No specific feedback provided."}
              </div>
            </div>

            {/* Counterpoints to Rebut */}
            {result.counterpoints && result.counterpoints.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-stamp-maroon" />
                  <h2 className="font-heading text-xs uppercase tracking-wider text-stamp-maroon">
                    Be ready to rebut these counterpoints:
                  </h2>
                </div>
                <p className="mt-1 text-xs text-text-secondary/60">
                  In a real placement GD, other participants or the moderator will challenge your stance with these arguments:
                </p>
                <div className="mt-3 space-y-2.5">
                  {result.counterpoints.map((cp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border border-stamp-maroon/20 bg-stamp-maroon/5 p-3.5 text-sm text-text-secondary/85"
                    >
                      <span className="font-mono text-xs font-bold text-stamp-maroon shrink-0">
                        #{idx + 1}
                      </span>
                      <p className="leading-snug">{cp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Argument Reference */}
            <div className="mt-6">
              <details className="group rounded-lg border border-white/10 bg-surface/40 p-3 text-xs text-text-secondary/70">
                <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-text-primary/70 hover:text-text-primary">
                  View your submitted opening statement
                </summary>
                <p className="mt-2.5 whitespace-pre-wrap border-t border-dashed border-white/10 pt-2 text-text-secondary">
                  {result.userArgument}
                </p>
              </details>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleResetSameTopic}
                className="rounded-lg border border-white/10 px-5 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5"
              >
                Retry This Topic
              </button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBackToTopics}
                  className="rounded-lg bg-stamp-navy/10 px-5 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/20"
                >
                  Choose Another Topic
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-sm font-semibold tracking-wider text-gold hover:bg-stamp-navy/90"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
