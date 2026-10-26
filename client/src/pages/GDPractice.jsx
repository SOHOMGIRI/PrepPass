import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";
import { Users, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

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
      setError("Your argument must contain at least 20 characters.");
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
          "Could not submit your argument for evaluation. Please retry."
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
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Candidate Dossier
          </Link>
          {phase !== "select" && (
            <button
              type="button"
              onClick={handleBackToTopics}
              className="font-mono text-xs text-[#0A1128] hover:text-[#C5A059] font-bold"
            >
              Browse All Topics →
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-mono text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Phase 1: Topic Selection */}
        {phase === "select" && (
          <div className="ticket-card mt-6 p-6 sm:p-10 border border-[#C5A059]/30 shadow-card">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
              <Users size={12} className="text-[#C5A059]" />
              <span>PRÆPPASS — GROUP DISCUSSION ARENA</span>
            </div>
            <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
              Select Debate Motion for Round Rehearsal
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Formulate your opening thesis, receive multi-dimensional rubric scoring, and inspect AI-generated peer counterpoints.
            </p>

            {/* Category Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-4 py-2 font-mono text-[11px] tracking-wide transition-all ${
                    selectedCategory === cat
                      ? "bg-[#0A1128] text-white font-bold"
                      : "bg-[#0A1128]/5 text-slate-600 hover:bg-[#0A1128]/10 font-medium"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Topics List */}
            {loading ? (
              <p className="mt-8 text-center text-sm font-mono text-slate-400">
                Loading discussion motions…
              </p>
            ) : filteredTopics.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-[#0A1128]/15 p-8 text-center bg-white">
                <p className="text-sm text-slate-600">
                  No discussion motions found in this category. Select "All" to browse the global repository.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {filteredTopics.map((t) => (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => handleSelectTopic(t)}
                    className="ticket-card group block w-full p-6 text-left transition hover:border-[#C5A059]/60 hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                        {t.category}
                      </span>
                      <span className="font-mono text-xs text-[#0A1128] font-bold opacity-0 transition group-hover:opacity-100 flex items-center gap-1">
                        Take the Floor <ArrowRight size={13} className="text-[#C5A059]" />
                      </span>
                    </div>
                    <p className="mt-2.5 font-heading text-base font-bold text-[#0A1128]">
                      {t.topicText}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Phase 2: Opening Argument */}
        {phase === "write" && selectedTopic && (
          <div className="ticket-card mt-6 p-6 sm:p-10 border border-[#C5A059]/30 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-[#0A1128]/8">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-0.5 rounded border border-[#C5A059]/20">
                GD MOTION · {selectedTopic.category}
              </span>
              <span className="font-mono text-xs text-slate-400">
                20–2000 characters
              </span>
            </div>

            <h1 className="mt-4 font-heading text-xl sm:text-2xl font-bold text-[#0A1128]">
              {selectedTopic.topicText}
            </h1>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Structure your opening statement: start with a hook, present 2–3 empirical premises or real-world precedents, and summarize your stance.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <textarea
                  rows={7}
                  placeholder="State your opening statement clearly. E.g., 'Good morning colleagues and honorable panel. Today we are deliberating whether artificial intelligence constitutes a net displacement or multiplier of engineering talent. In my view, historical precedents demonstrate...'"
                  value={userArgument}
                  onChange={(e) => setUserArgument(e.target.value)}
                  disabled={busy}
                  className="w-full rounded-xl border border-[#0A1128]/10 bg-white p-4 font-sans text-sm text-[#0A1128] placeholder-slate-400 focus:border-[#C5A059] focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 leading-relaxed shadow-2xs"
                />
                <div className="mt-2 flex justify-between font-mono text-xs text-slate-400">
                  <span>Minimum 20 characters</span>
                  <span className={userArgument.length > 2000 ? "text-red-600 font-bold" : ""}>
                    {userArgument.length} / 2000
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleBackToTopics}
                  disabled={busy}
                  className="rounded-xl border border-[#0A1128]/15 px-5 py-3 font-mono text-xs font-semibold text-slate-700 hover:bg-[#0A1128]/5"
                >
                  Choose Different Topic
                </button>
                <button
                  type="submit"
                  disabled={busy || userArgument.trim().length < 20}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1128] px-7 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm disabled:opacity-50"
                >
                  <span>{busy ? "Evaluating Synthesis & Logic…" : "Submit Opening Argument"}</span>
                  <ArrowRight size={14} className="text-[#C5A059]" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Phase 3: Results & AI Counterpoints */}
        {phase === "result" && result && (
          <div className="ticket-card mt-6 p-6 sm:p-10 border border-[#C5A059]/40 shadow-card">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
              <ShieldCheck size={12} className="text-[#C5A059]" />
              <span>PRÆPPASS — DEBATE EVALUATION DOSSIER</span>
            </div>
            <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
              Argument Articulation Audit
            </h1>
            <p className="mt-1 font-mono text-xs text-slate-500">
              Motion: {result.topicText}
            </p>

            <div className="mt-8 flex flex-col items-center">
              <GaugeCircle
                value={result.score?.overall ?? 0}
                max={10}
                size={160}
                caption="Overall GD Score"
              />
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128]">
                Performance Dimensions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {SCORE_DIMENSIONS.map(({ key, label }) => {
                  const val = Number(result.score?.[key]) || 0;
                  const pct = Math.max(0, Math.min(100, (val / 10) * 100));
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-[#0A1128]/8 bg-[#FDFBF7] p-4 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                          {label}
                        </span>
                        <span className="font-mono text-sm font-bold text-[#0A1128]">
                          {Math.round(val * 10) / 10} / 10
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[#C5A059]"
                          style={{ width: `${pct}%`, transition: "width 0.7s ease" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ticket-perf my-8" />

            {/* Evaluator Feedback */}
            <div>
              <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128]">
                Panel Moderator Feedback
              </h2>
              <div className="mt-2.5 rounded-xl border border-[#0A1128]/8 bg-[#FDFBF7] p-5 text-sm text-slate-700 leading-relaxed shadow-2xs">
                {result.feedback || "Argument structure demonstrated clear thesis development."}
              </div>
            </div>

            {/* Counterpoints to Rebut */}
            {result.counterpoints && result.counterpoints.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-700" />
                  <h2 className="font-heading text-xs uppercase tracking-wider font-bold text-amber-800">
                    Prepare to Rebut These Peer Counterpoints:
                  </h2>
                </div>
                <div className="mt-3 space-y-2.5">
                  {result.counterpoints.map((cp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 shadow-2xs"
                    >
                      <span className="font-mono text-xs font-bold text-amber-800 shrink-0">
                        #{idx + 1}
                      </span>
                      <p className="leading-relaxed">{cp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-[#0A1128]/8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetSameTopic}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#0A1128]/15 bg-white px-5 py-2.5 font-mono text-xs font-semibold text-slate-700 hover:bg-[#0A1128]/5"
              >
                <RotateCcw size={13} /> Retry Motion
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBackToTopics}
                  className="rounded-xl border border-[#0A1128]/15 bg-white px-5 py-2.5 font-mono text-xs font-semibold text-slate-700 hover:bg-[#0A1128]/5"
                >
                  Other Topics
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1128] px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B]"
                >
                  <span>Dossier</span>
                  <ArrowRight size={13} className="text-[#C5A059]" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
