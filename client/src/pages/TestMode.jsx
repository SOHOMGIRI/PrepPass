import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";

const GENERAL_SUBJECTS = [
  "Data Structures & Algorithms",
  "DBMS & SQL",
  "Operating Systems",
  "Computer Networks",
  "Object-Oriented Programming (OOP)",
  "JavaScript & Web Development",
  "Python Programming",
  "System Design Basics",
  "Software Engineering & Agile",
  "Cloud & DevOps Fundamentals",
];

export default function TestMode() {
  const [phase, setPhase] = useState("select"); // "select" | "testing" | "result"
  const [availableSubjects, setAvailableSubjects] = useState(GENERAL_SUBJECTS);
  const [suggestedSubjects, setSuggestedSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Test State
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins = 600s
  const [violationCount, setViolationCount] = useState(0);
  const [warningModal, setWarningModal] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Proctoring debounce ref
  const lastViolationTimeRef = useRef(0);
  const testContainerRef = useRef(null);

  // Fetch suggested subjects from resume analysis history if available
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/resume/analyze/history");
        if (!cancelled && data.analyses && data.analyses.length > 0) {
          const latest = data.analyses[0];
          if (Array.isArray(latest.suggestedSubjects) && latest.suggestedSubjects.length > 0) {
            setSuggestedSubjects(latest.suggestedSubjects);
            // Pre-select first 1-2 suggested subjects
            setSelectedSubjects(latest.suggestedSubjects.slice(0, 2));
          }
        }
      } catch {
        // Silently continue with general subjects
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSubject = (sub) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      if (selectedSubjects.length >= 3) {
        setError("You can select up to 3 subjects for a 15-question test.");
        return;
      }
      setError("");
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  // Start Test & Enter Fullscreen
  const startTest = async () => {
    if (selectedSubjects.length === 0) {
      setError("Please select at least 1 subject to start.");
      return;
    }
    setError("");
    setLoading(true);

    // Request fullscreen immediately from the user gesture
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (fsErr) {
      console.warn("Fullscreen request error:", fsErr);
    }

    try {
      const { data } = await api.post("/test/start", {
        subjects: selectedSubjects,
      });

      setSessionId(data.sessionId);
      setExpiresAt(new Date(data.expiresAt).getTime());
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setViolationCount(0);
      setPhase("testing");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not start the test. Please try again."
      );
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Test Function
  const submitTest = useCallback(
    async (autoTimeout = false) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const { data } = await api.post("/test/submit", { sessionId });
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        setResult(data.result);
        setPhase("result");
      } catch (err) {
        setError(
          err?.response?.data?.message || "Could not submit test. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [sessionId, submitting]
  );

  // Timer Countdown Effect
  useEffect(() => {
    if (phase !== "testing" || !expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        submitTest(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, expiresAt, submitTest]);

  // Handle Proctoring Violation
  const handleViolation = useCallback(async () => {
    if (phase !== "testing" || !sessionId || submitting) return;

    const now = Date.now();
    // Debounce simultaneous events within 500ms
    if (now - lastViolationTimeRef.current < 500) return;
    lastViolationTimeRef.current = now;

    try {
      const { data } = await api.post("/test/violation", { sessionId });
      setViolationCount(data.violationCount);

      if (data.forceSubmit) {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        setResult(data.result);
        setPhase("result");
      } else {
        setWarningModal(true);
      }
    } catch (err) {
      console.error("Violation recording error:", err);
    }
  }, [phase, sessionId, submitting]);

  // Proctoring Event Listeners
  useEffect(() => {
    if (phase !== "testing") return;

    const onFullscreenChange = () => {
      if (!document.fullscreenElement && phase === "testing") {
        handleViolation();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden && phase === "testing") {
        handleViolation();
      }
    };

    const onBlur = () => {
      if (phase === "testing") {
        handleViolation();
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [phase, handleViolation]);

  // Answer Option Selection
  const selectOption = async (optionIndex) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    // Snappy local update
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

  const reEnterFullscreen = async () => {
    setWarningModal(false);
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen retry error:", err);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={testContainerRef}
      className="min-h-screen bg-cream px-4 py-10 font-body text-ink"
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* Top Header */}
        {phase !== "testing" && (
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="font-mono text-xs text-stamp-navy/70 hover:underline"
            >
              ← Back to Dashboard
            </Link>
            <Link
              to="/history"
              className="font-mono text-xs text-stamp-navy/70 hover:underline"
            >
              Past Test Scores →
            </Link>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}

        {/* Phase 1: Subject Selection */}
        {phase === "select" && (
          <div className="ticket-card mt-6 p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
                PREPPASS — PROCTORED TEST MODE
              </div>
              <span className="font-mono text-xs text-stamp-navy/60">
                15 MCQs · 10 Minutes
              </span>
            </div>

            <div>
              <h1 className="font-heading text-2xl text-stamp-navy sm:text-3xl">
                Proctored Timed MCQ Assessment
              </h1>
              <p className="mt-2 text-sm text-ink/70 leading-relaxed">
                Test your knowledge in a strict, proctored environment. Select 1 to 3 subjects to assemble a tailored 15-question evaluation with automated trust and accuracy scoring.
              </p>
            </div>

            {/* Proctored Rules Notice */}
            <div className="rounded-lg border border-stamp-navy/15 bg-ticket/60 p-4 space-y-2 text-xs text-ink/80">
              <div className="font-heading text-stamp-navy uppercase tracking-wider text-[11px] font-bold">
                ⚠️ Proctoring & Trust Score Rules
              </div>
              <ul className="list-disc pl-4 space-y-1 text-ink/70">
                <li>The test requires <strong>Fullscreen Mode</strong> and active tab focus.</li>
                <li>Switching tabs, minimizing the browser, or exiting fullscreen triggers a <strong>Proctoring Warning</strong>.</li>
                <li>0 warnings = <strong>100% Trust Score</strong>. 1 warning = <strong>70%</strong>. 2 warnings = <strong>40%</strong>.</li>
                <li>A <strong>3rd warning</strong> immediately auto-submits your test with a <strong>0% Trust Score</strong>.</li>
              </ul>
            </div>

            {/* Suggested Subjects from Resume */}
            {suggestedSubjects.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-xs font-semibold text-stamp-navy">
                  Recommended for your Resume Profile:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedSubjects.map((sub) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`rounded-full px-3.5 py-1.5 font-mono text-xs tracking-wide transition ${
                          isSelected
                            ? "bg-gold text-white font-semibold shadow-sm"
                            : "bg-gold/15 text-stamp-navy hover:bg-gold/25"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Subjects List */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold text-stamp-navy">
                All Core Placement Subjects (Pick 1–3):
              </span>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`ticket-card p-3.5 text-left transition ${
                        isSelected
                          ? "border-stamp-navy bg-stamp-navy/5"
                          : "hover:border-stamp-navy/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xs text-stamp-navy">
                          {sub}
                        </span>
                        <span className="font-mono text-xs font-bold text-gold">
                          {isSelected ? "SELECTED" : "+ ADD"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="font-mono text-xs text-stamp-navy/60">
                Selected: {selectedSubjects.length} of 3 subjects
              </span>
              <button
                type="button"
                onClick={startTest}
                disabled={loading || selectedSubjects.length === 0}
                className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-8 py-3.5 font-heading text-sm font-semibold text-white hover:bg-stamp-navy/90 disabled:opacity-50"
              >
                {loading ? "Preparing Questions…" : "Enter Fullscreen & Start Test 🚀"}
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Live Proctored Test Screen */}
        {phase === "testing" && questions.length > 0 && (
          <div className="space-y-4">
            {/* Top Proctoring Bar */}
            <div className="ticket-card p-4 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <span className="ticket-stamp rounded px-2 py-0.5 font-mono text-[10px] uppercase text-stamp-navy">
                  PROCTORED EXAM
                </span>
                <span className="font-mono text-xs text-stamp-navy/70">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-stamp-navy/60">Time Left:</span>
                <span
                  className={`font-mono text-base font-bold px-2.5 py-0.5 rounded ${
                    timeLeft < 120
                      ? "bg-red-100 text-stamp-maroon animate-pulse"
                      : "bg-stamp-navy/10 text-stamp-navy"
                  }`}
                >
                  ⏱️ {formatTimer(timeLeft)}
                </span>
              </div>

              {/* Trust Score Live Badge */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    violationCount === 0
                      ? "bg-green-500"
                      : violationCount === 1
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="font-mono text-[11px] text-stamp-navy/70">
                  {violationCount === 0
                    ? "100% Trust"
                    : `${violationCount} Warning(s)`}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="ticket-card p-6 sm:p-8 space-y-6 bg-white">
              <div>
                <div className="flex items-center justify-between text-xs text-stamp-navy/50 font-mono mb-2">
                  <span>QUESTION #{currentIndex + 1}</span>
                  <span>
                    {questions[currentIndex]?.selectedIndex !== null
                      ? "✓ Saved"
                      : "Unanswered"}
                  </span>
                </div>
                <h2 className="font-heading text-lg text-stamp-navy sm:text-xl leading-snug">
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
                          ? "border-stamp-navy bg-stamp-navy/10 shadow-sm"
                          : "border-ink/20 bg-white hover:border-stamp-navy/50 hover:bg-ticket/40"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                          isSelected
                            ? "bg-stamp-navy text-white"
                            : "bg-stamp-navy/10 text-stamp-navy"
                        }`}
                      >
                        {labels[optIdx]}
                      </span>
                      <span className="text-sm text-ink/90 leading-relaxed">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation & Submit Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-dashed border-stamp-navy/15">
                <button
                  type="button"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="rounded-lg border border-stamp-navy/30 px-4 py-2 font-mono text-xs text-stamp-navy hover:bg-stamp-navy/5 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="rounded-lg bg-stamp-navy px-5 py-2 font-heading text-xs font-semibold text-white hover:bg-stamp-navy/90"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => submitTest(false)}
                    disabled={submitting}
                    className="rounded-lg bg-gold px-6 py-2.5 font-heading text-xs font-semibold text-white hover:bg-gold-dark disabled:opacity-50"
                  >
                    {submitting ? "Grading…" : "Finish & Submit Test ✓"}
                  </button>
                )}
              </div>
            </div>

            {/* Question Quick Jump Navigator */}
            <div className="ticket-card p-4">
              <div className="text-[11px] font-mono text-stamp-navy/60 mb-2">
                QUESTION GRID NAVIGATOR:
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
                          ? "ring-2 ring-stamp-navy bg-stamp-navy text-white"
                          : isAnswered
                          ? "bg-gold text-white"
                          : "bg-stamp-navy/10 text-stamp-navy hover:bg-stamp-navy/20"
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
              <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
                PREPPASS — TEST REPORT
              </div>
              <span className="font-mono text-xs text-stamp-navy/60">
                {result.status === "auto-submitted"
                  ? "AUTO-SUBMITTED"
                  : "COMPLETED"}
              </span>
            </div>

            <div className="text-center">
              <h1 className="font-heading text-3xl text-stamp-navy">
                Assessment Graded
              </h1>
              <p className="mt-1 text-xs text-ink/60">
                Subjects: {result.subjects?.join(" • ") || "Core Technical"}
              </p>
            </div>

            {/* Score & Trust Gauges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              <GaugeCircle
                value={result.scorePercent || 0}
                max={100}
                size={172}
                caption="Accuracy Score"
              />

              {/* Trust Score Callout */}
              <div className="flex flex-col items-center text-center max-w-xs space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-stamp-navy/60">
                  Proctoring Trust Score
                </span>
                <span
                  className={`rounded-full px-4 py-1.5 font-heading text-lg font-bold ${
                    result.trustScore === 100
                      ? "bg-green-100 text-green-800"
                      : result.trustScore === 70
                      ? "bg-yellow-100 text-yellow-800"
                      : result.trustScore === 40
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-stamp-maroon"
                  }`}
                >
                  {result.trustScore}% Trust Score
                </span>
                <p className="text-xs text-ink/70 leading-relaxed">
                  {result.trustScore === 100
                    ? "Verified proctoring integrity with zero tab/fullscreen violations."
                    : result.trustScore === 70
                    ? "1 proctoring warning detected during the test."
                    : result.trustScore === 40
                    ? "2 proctoring warnings detected during the test."
                    : "0% Trust Score due to multiple violations or auto-submission."}
                </p>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className="space-y-4 pt-4 border-t border-dashed border-stamp-navy/20">
              <h3 className="font-heading text-lg text-stamp-navy">
                Question Breakdown ({result.questions?.filter((q) => q.isCorrect).length || 0} of {result.questions?.length || 15} Correct)
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
                      <span className="font-bold text-stamp-navy">
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

                    <p className="font-heading text-sm text-stamp-navy">
                      {q.questionText}
                    </p>

                    <div className="grid gap-1.5 sm:grid-cols-2 pt-1 text-ink/80">
                      {q.options?.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`rounded px-2.5 py-1.5 ${
                            q.selectedIndex === oIdx
                              ? q.isCorrect
                                ? "bg-green-200/70 font-semibold"
                                : "bg-red-200/70 font-semibold"
                              : "bg-white/60"
                          }`}
                        >
                          <span className="font-mono font-bold mr-1">
                            {["A", "B", "C", "D"][oIdx]}.
                          </span>
                          {opt}
                          {q.selectedIndex === oIdx && (
                            <span className="font-mono text-[10px] ml-1.5 text-stamp-navy">
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
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setPhase("select");
                  setResult(null);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-sm font-semibold text-white hover:bg-stamp-navy/90"
              >
                Take Another Test 🔄
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-stamp-navy/30 bg-white px-5 py-2.5 font-mono text-xs text-stamp-navy hover:bg-stamp-navy/5"
              >
                Return to Dashboard →
              </Link>
            </div>
          </div>
        )}

        {/* Proctoring Warning Modal */}
        {warningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="ticket-card max-w-md w-full bg-cream p-6 sm:p-8 space-y-4 border-2 border-stamp-maroon/40 shadow-2xl">
              <div className="ticket-stamp inline-block rounded bg-red-100 px-2.5 py-1 font-mono text-[10px] uppercase font-bold text-stamp-maroon">
                ⚠️ PROCTORING VIOLATION #{violationCount} OF 3
              </div>

              <h3 className="font-heading text-xl text-stamp-navy">
                Tab switch or fullscreen exit detected!
              </h3>

              <p className="text-xs text-ink/80 leading-relaxed">
                You switched tabs, minimized your browser window, or exited fullscreen mode. PrepPass enforces proctoring standards.
              </p>

              <div className="rounded-lg bg-gold/10 p-3 text-xs text-stamp-maroon font-mono">
                {violationCount === 1 && "Warning 1 of 3: Your trust score is reduced to 70%."}
                {violationCount === 2 && "Warning 2 of 3: Your trust score is reduced to 40%. A 3rd warning will auto-submit your test with 0% trust score!"}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={reEnterFullscreen}
                  className="rounded-lg bg-stamp-navy px-5 py-2.5 font-heading text-xs font-semibold text-white hover:bg-stamp-navy/90"
                >
                  Re-enter Fullscreen & Continue →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
