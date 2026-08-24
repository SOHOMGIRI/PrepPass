import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";

const APTITUDE_CATEGORIES = [
  {
    name: "Quantitative Aptitude",
    desc: "Percentages, Time & Work, Speed & Distance, Probability, P&C, Ratios",
    icon: "📐",
  },
  {
    name: "Logical Reasoning",
    desc: "Blood Relations, Syllogisms, Series, Coding-Decoding, Seating",
    icon: "🧩",
  },
  {
    name: "Verbal Ability",
    desc: "Reading Comprehension, Sentence Correction, Synonyms, Para Jumbles",
    icon: "📖",
  },
];

const QUESTION_COUNTS = [5, 10, 15];

export default function AptitudePractice() {
  const [phase, setPhase] = useState("select"); // "select" | "practice" | "result"
  const [selectedSubjects, setSelectedSubjects] = useState([
    "Quantitative Aptitude",
  ]);
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Practice state
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleSubject = (name) => {
    if (selectedSubjects.includes(name)) {
      if (selectedSubjects.length === 1) {
        setError("Please select at least 1 aptitude section.");
        return;
      }
      setError("");
      setSelectedSubjects(selectedSubjects.filter((s) => s !== name));
    } else {
      setError("");
      setSelectedSubjects([...selectedSubjects, name]);
    }
  };

  const startPractice = async () => {
    if (selectedSubjects.length === 0) {
      setError("Please select at least 1 section.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/test/start", {
        subjects: selectedSubjects,
        mode: "practice",
        questionCount,
      });

      setSessionId(data.sessionId);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setPhase("practice");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not start aptitude practice. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectOption = async (optionIndex) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const updated = [...questions];
    updated[currentIndex] = { ...currentQ, selectedIndex: optionIndex };
    setQuestions(updated);

    try {
      await api.post("/test/answer", {
        sessionId,
        questionId: currentQ._id || currentQ.questionId,
        selectedIndex: optionIndex,
      });
    } catch (err) {
      console.warn("Failed to autosave answer:", err);
    }
  };

  const submitPractice = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/test/submit", { sessionId });
      setResult(data.result);
      setPhase("result");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not submit practice session. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-10 font-body text-text-secondary">
      <div className="mx-auto w-full max-w-3xl">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="font-mono text-xs text-text-primary/70 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          <Link
            to="/test-mode"
            className="font-mono text-xs text-text-primary/70 hover:underline"
          >
            Switch to Proctored Test Mode →
          </Link>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {/* Phase 1: Section & Question Count Selection */}
        {phase === "select" && (
          <div className="ticket-card mt-6 p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
                PREPPASS — APTITUDE PRACTICE
              </div>
              <span className="font-mono text-xs text-text-primary/60">
                Untimed & Relaxed Mode
              </span>
            </div>

            <div>
              <h1 className="font-heading text-2xl text-text-primary sm:text-3xl">
                Placement Aptitude Practice
              </h1>
              <p className="mt-2 text-sm text-text-secondary/70 leading-relaxed">
                Sharpen your problem-solving skills with placement-standard aptitude questions. No timer pressure, no proctoring restrictions—just pure practice.
              </p>
            </div>

            {/* Category Selector */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-semibold text-text-primary">
                Choose Aptitude Sections:
              </span>
              <div className="grid gap-3 sm:grid-cols-3">
                {APTITUDE_CATEGORIES.map((cat) => {
                  const isSelected = selectedSubjects.includes(cat.name);
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => toggleSubject(cat.name)}
                      className={`ticket-card p-4 text-left transition flex flex-col justify-between ${
                        isSelected
                          ? "border-gold bg-stamp-navy/5 shadow-sm"
                          : "hover:border-white/10"
                      }`}
                    >
                      <div>
                        <span className="text-2xl">{cat.icon}</span>
                        <h3 className="mt-2 font-heading text-sm text-text-primary">
                          {cat.name}
                        </h3>
                        <p className="mt-1 text-[11px] text-text-secondary/60 line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>
                      <span className="mt-3 font-mono text-[10px] font-bold text-gold">
                        {isSelected ? "✓ SELECTED" : "+ ADD"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold text-text-primary">
                Number of Questions:
              </span>
              <div className="flex gap-3">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`rounded-lg px-5 py-2 font-mono text-xs font-bold transition ${
                      questionCount === count
                        ? "bg-stamp-navy text-gold shadow-sm"
                        : "bg-stamp-navy/10 text-text-primary hover:bg-stamp-navy/20"
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-dashed border-white/10">
              <span className="font-mono text-xs text-text-primary/60">
                Ready to practice {questionCount} questions across {selectedSubjects.length} section(s)
              </span>
              <button
                type="button"
                onClick={startPractice}
                disabled={loading || selectedSubjects.length === 0}
                className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-8 py-3 font-heading text-sm font-semibold text-gold hover:bg-stamp-navy/90 disabled:opacity-50"
              >
                {loading ? "Preparing Questions…" : "Start Practice Session →"}
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Practice Question Screen */}
        {phase === "practice" && questions.length > 0 && (
          <div className="space-y-4">
            {/* Top Bar */}
            <div className="ticket-card p-4 flex flex-wrap items-center justify-between gap-3 bg-surface">
              <div className="flex items-center gap-3">
                <span className="ticket-stamp rounded px-2.5 py-0.5 font-mono text-[10px] uppercase text-text-primary">
                  PRACTICE MODE
                </span>
                <span className="font-mono text-xs text-text-primary/70">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded bg-gold/15 px-2.5 py-0.5 font-mono text-[11px] text-text-primary font-bold">
                  🌱 Untimed Practice
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="ticket-card p-6 sm:p-8 space-y-6 bg-surface">
              <div>
                <div className="flex items-center justify-between text-xs text-text-primary/50 font-mono mb-2">
                  <span>QUESTION #{currentIndex + 1}</span>
                  <span>
                    {questions[currentIndex]?.selectedIndex !== null
                      ? "✓ Answered"
                      : "Unanswered"}
                  </span>
                </div>
                <h2 className="font-heading text-lg text-text-primary sm:text-xl leading-snug">
                  {questions[currentIndex]?.questionText}
                </h2>
              </div>

              {/* 4 Options */}
              <div className="space-y-3 pt-2">
                {questions[currentIndex]?.options?.map((opt, optIdx) => {
                  const isSelected =
                    questions[currentIndex]?.selectedIndex === optIdx;
                  const labels = ["A", "B", "C", "D"];
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => selectOption(optIdx)}
                      className={`w-full rounded-lg border p-4 text-left transition flex items-start gap-3.5 ${
                        isSelected
                          ? "border-gold bg-stamp-navy/10 shadow-sm"
                          : "border-white/10 bg-surface hover:border-white/10 hover:bg-surface/40"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                          isSelected
                            ? "bg-stamp-navy text-gold"
                            : "bg-stamp-navy/10 text-text-primary"
                        }`}
                      >
                        {labels[optIdx]}
                      </span>
                      <span className="text-sm text-text-secondary/90 leading-relaxed">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation & Submit Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-dashed border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-text-primary hover:bg-stamp-navy/5 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="rounded-lg bg-stamp-navy px-5 py-2 font-heading text-xs font-semibold text-gold hover:bg-stamp-navy/90"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitPractice}
                    disabled={submitting}
                    className="rounded-lg bg-gold px-6 py-2.5 font-heading text-xs font-semibold text-gold hover:bg-gold-dark disabled:opacity-50"
                  >
                    {submitting ? "Grading…" : "Finish & View Results ✓"}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Jump Navigator */}
            <div className="ticket-card p-4">
              <div className="text-[11px] font-mono text-text-primary/60 mb-2">
                QUESTION GRID:
              </div>
              <div className="flex flex-wrap gap-2">
                {questions.map((q, qIdx) => {
                  const isCurrent = currentIndex === qIdx;
                  const isAnswered = q.selectedIndex !== null;
                  return (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => setCurrentIndex(qIdx)}
                      className={`h-8 w-8 rounded-lg font-mono text-xs font-bold transition ${
                        isCurrent
                          ? "ring-2 ring-stamp-navy bg-stamp-navy text-gold"
                          : isAnswered
                          ? "bg-gold text-gold"
                          : "bg-stamp-navy/10 text-text-primary hover:bg-stamp-navy/20"
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Results Screen */}
        {phase === "result" && result && (
          <div className="ticket-card mt-6 p-6 sm:p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
                PREPPASS — APTITUDE REPORT
              </div>
              <span className="font-mono text-xs text-text-primary/60">
                PRACTICE SESSION COMPLETE
              </span>
            </div>

            <div className="text-center">
              <h1 className="font-heading text-3xl text-text-primary">
                Practice Completed!
              </h1>
              <p className="mt-1 text-xs text-text-secondary/60">
                Sections: {result.subjects?.join(" • ") || "Aptitude"}
              </p>
            </div>

            {/* Accuracy Score */}
            <div className="flex flex-col items-center justify-center py-2">
              <GaugeCircle
                value={result.scorePercent || 0}
                max={100}
                size={172}
                caption="Accuracy Score"
              />
              <p className="mt-3 font-mono text-xs text-text-primary/70">
                {result.questions?.filter((q) => q.isCorrect).length || 0} of{" "}
                {result.questions?.length || questionCount} questions answered correctly
              </p>
            </div>

            {/* Question Review Breakdown */}
            <div className="space-y-4 pt-4 border-t border-dashed border-white/10">
              <h3 className="font-heading text-lg text-text-primary">
                Question Review & Solutions
              </h3>

              <div className="space-y-3">
                {result.questions?.map((q, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border p-4 text-xs space-y-2 ${
                      q.isCorrect
                        ? "border-green-300 bg-green-50/50"
                        : "border-red-200 bg-red-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-text-primary">
                        Q{idx + 1}.
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 font-bold uppercase text-[10px] ${
                          q.isCorrect
                            ? "bg-green-200 text-green-900"
                            : "bg-red-200 text-red-900"
                        }`}
                      >
                        {q.isCorrect ? "✓ Correct" : "✕ Incorrect"}
                      </span>
                    </div>

                    <p className="font-heading text-sm text-text-primary">
                      {q.questionText}
                    </p>

                    <div className="grid gap-1.5 sm:grid-cols-2 pt-1 text-text-secondary/80">
                      {q.options?.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`rounded px-2.5 py-1.5 ${
                            q.selectedIndex === oIdx
                              ? q.isCorrect
                                ? "bg-green-200/70 font-semibold"
                                : "bg-red-200/70 font-semibold"
                              : "bg-surface/60"
                          }`}
                        >
                          <span className="font-mono font-bold mr-1">
                            {["A", "B", "C", "D"][oIdx]}.
                          </span>
                          {opt}
                          {q.selectedIndex === oIdx && (
                            <span className="font-mono text-[10px] ml-1.5 text-text-primary">
                              (Your Choice)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-dashed border-white/10">
              <button
                type="button"
                onClick={() => {
                  setPhase("select");
                  setResult(null);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-sm font-semibold text-gold hover:bg-stamp-navy/90"
              >
                Practice Another Set 🔄
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-surface px-5 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5"
              >
                Return to Dashboard →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
