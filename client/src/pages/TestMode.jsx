import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
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
  const [availableSubjects] = useState(GENERAL_SUBJECTS);
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

  // Payment & Detailed Report State
  const [detailedReport, setDetailedReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [upiTxnInput, setUpiTxnInput] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Percentile State
  const [percentileData, setPercentileData] = useState(null);

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

  // Fetch peer percentile rankings when test result is available
  useEffect(() => {
    if (!result?._id) {
      setPercentileData(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/analytics/percentile/${result._id}`);
        if (!cancelled) {
          setPercentileData(data);
        }
      } catch (err) {
        console.warn("Could not fetch percentile data:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result?._id]);

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
      setDetailedReport(null);
      setPaymentOrder(null);
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

  // Payment & Report Unlock Handlers
  const handleUnlockClick = async () => {
    if (!result?._id) return;
    setReportLoading(true);
    setPaymentError("");
    try {
      // Check if already unlocked
      try {
        const { data: reportData } = await api.get(
          `/test/session/${result._id}/detailed-report`
        );
        if (reportData.unlocked && reportData.report) {
          setDetailedReport(reportData.report);
          setReportLoading(false);
          return;
        }
      } catch {
        // Not yet unlocked, proceed to create payment order
      }

      const { data } = await api.post("/payment/create-order", {
        testSessionId: result._id,
      });

      if (data.unlocked) {
        const { data: reportData } = await api.get(
          `/test/session/${result._id}/detailed-report`
        );
        setDetailedReport(reportData.report);
      } else {
        setPaymentOrder(data);
        setUpiTxnInput("");
      }
    } catch (err) {
      setPaymentError(
        err?.response?.data?.message || "Could not initiate report unlock."
      );
    } finally {
      setReportLoading(false);
    }
  };

  const handleVerifyPayment = async (e) => {
    e.preventDefault();
    if (!upiTxnInput.trim()) {
      setPaymentError("Please enter your 12-digit UPI transaction ID / UTR.");
      return;
    }

    setPaymentSubmitting(true);
    setPaymentError("");
    try {
      const { data } = await api.post("/payment/submit-reference", {
        referenceCode: paymentOrder.referenceCode,
        upiTransactionId: upiTxnInput.trim(),
      });

      if (data.unlocked) {
        // Fetch detailed report
        const { data: reportData } = await api.get(
          `/test/session/${result._id}/detailed-report`
        );
        setDetailedReport(reportData.report);
        setPaymentOrder(null);
      }
    } catch (err) {
      setPaymentError(
        err?.response?.data?.message ||
          "Failed to verify payment reference. Please check your transaction ID."
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <div
      ref={testContainerRef}
      className="min-h-screen bg-bg px-4 py-10 font-body text-text-secondary"
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* Top Header */}
        {phase !== "testing" && (
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="font-mono text-xs text-text-primary/70 hover:underline"
            >
              ← Back to Dashboard
            </Link>
            <Link
              to="/history"
              className="font-mono text-xs text-text-primary/70 hover:underline"
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
              <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
                PREPPASS — PROCTORED TEST MODE
              </div>
              <span className="font-mono text-xs text-text-primary/60">
                15 MCQs · 10 Minutes
              </span>
            </div>

            <div>
              <h1 className="font-heading text-2xl text-text-primary sm:text-3xl">
                Proctored Timed MCQ Assessment
              </h1>
              <p className="mt-2 text-sm text-text-secondary/70 leading-relaxed">
                Test your knowledge in a strict, proctored environment. Select 1 to 3 subjects to assemble a tailored 15-question evaluation with automated trust and accuracy scoring.
              </p>
            </div>

            {/* Proctored Rules Notice */}
            <div className="rounded-lg border border-white/10 bg-surface/60 p-4 space-y-2 text-xs text-text-secondary/80">
              <div className="font-heading text-text-primary uppercase tracking-wider text-[11px] font-bold">
                ⚠️ Proctoring & Trust Score Rules
              </div>
              <ul className="list-disc pl-4 space-y-1 text-text-secondary/70">
                <li>The test requires <strong>Fullscreen Mode</strong> and active tab focus.</li>
                <li>Switching tabs, minimizing the browser, or exiting fullscreen triggers a <strong>Proctoring Warning</strong>.</li>
                <li>0 warnings = <strong>100% Trust Score</strong>. 1 warning = <strong>70%</strong>. 2 warnings = <strong>40%</strong>.</li>
                <li>A <strong>3rd warning</strong> immediately auto-submits your test with a <strong>0% Trust Score</strong>.</li>
              </ul>
            </div>

            {/* Suggested Subjects from Resume */}
            {suggestedSubjects.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-xs font-semibold text-text-primary">
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
                            : "bg-gold/15 text-text-primary hover:bg-gold/25"
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
              <span className="font-mono text-xs font-semibold text-text-primary">
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
                          ? "border-gold bg-stamp-navy/5"
                          : "hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xs text-text-primary">
                          {sub}
                        </span>
                        <span className="font-mono text-xs font-bold text-white">
                          {isSelected ? "SELECTED" : "+ ADD"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="font-mono text-xs text-text-primary/60">
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
            <div className="ticket-card p-4 flex flex-wrap items-center justify-between gap-3 bg-surface">
              <div className="flex items-center gap-3">
                <span className="ticket-stamp rounded px-2 py-0.5 font-mono text-[10px] uppercase text-text-primary">
                  PROCTORED EXAM
                </span>
                <span className="font-mono text-xs text-text-primary/70">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-primary/60">Time Left:</span>
                <span
                  className={`font-mono text-base font-bold px-2.5 py-0.5 rounded ${
                    timeLeft < 120
                      ? "bg-red-100 text-stamp-maroon animate-pulse"
                      : "bg-stamp-navy/10 text-text-primary"
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
                <span className="font-mono text-[11px] text-text-primary/70">
                  {violationCount === 0
                    ? "100% Trust"
                    : `${violationCount} Warning(s)`}
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
                      ? "✓ Saved"
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
                            ? "bg-stamp-navy text-white"
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
              <div className="text-[11px] font-mono text-text-primary/60 mb-2">
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
                PREPPASS — TEST REPORT
              </div>
              <span className="font-mono text-xs text-text-primary/60">
                {result.status === "auto-submitted"
                  ? "AUTO-SUBMITTED"
                  : "COMPLETED"}
              </span>
            </div>

            <div className="text-center">
              <h1 className="font-heading text-3xl text-text-primary">
                Assessment Graded
              </h1>
              <p className="mt-1 text-xs text-text-secondary/60">
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
                <span className="font-mono text-xs uppercase tracking-wider text-text-primary/60">
                  Proctoring Trust Score
                </span>
                <span
                  className={`rounded-full px-4 py-1.5 font-heading text-lg font-bold ${
                    result.trustScore === 100
                      ? "bg-green-100 text-green-800"
                      : result.trustScore === 70
                      ? "bg-yellow-100 text-yellow-800"
                      : result.trustScore === 40
                      ? "bg-gold text-white"
                      : "bg-red-100 text-stamp-maroon"
                  }`}
                >
                  {result.trustScore}% Trust Score
                </span>
                <p className="text-xs text-text-secondary/70 leading-relaxed">
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

            {/* Anonymized Peer Comparison Strip */}
            {percentileData && percentileData.subjectPercentiles && (
              <div className="rounded-xl border border-white/10 bg-surface/80 p-5 space-y-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <span className="font-heading text-xs uppercase tracking-wider text-text-primary font-bold">
                      Peer Percentile Ranking
                    </span>
                  </div>
                  {typeof percentileData.overallPercentile === "number" && (
                    <span className="font-mono text-xs font-bold text-text-primary bg-gold/20 px-2.5 py-0.5 rounded">
                      Top {Math.max(1, 100 - percentileData.overallPercentile)}% ({percentileData.overallPercentile}th Percentile)
                    </span>
                  )}
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
                  {percentileData.subjectPercentiles.map((sp, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-surface/40 p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-text-primary">{sp.subject}</span>
                        {sp.percentile !== null ? (
                          <span className="rounded bg-stamp-navy/10 px-2 py-0.5 font-bold text-text-primary">
                            {sp.percentile}th %ile
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-primary/50 font-medium">
                            Gathering stats
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-secondary/75 leading-relaxed">
                        {sp.percentile !== null
                          ? `You scored better than ${sp.percentile}% of test-takers in ${sp.subject}.`
                          : `Not enough data yet for ${sp.subject} (minimum 5 test-takers needed).`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Unlock Detailed Report / UPI QR Payment */}
            {!detailedReport && !paymentOrder && (
              <div className="rounded-xl border border-gold/40 bg-surface/80 p-6 text-center space-y-4">
                <div className="ticket-stamp inline-block rounded bg-gold/20 px-3 py-1 font-mono text-xs uppercase font-bold text-text-primary">
                  PREMIUM DIAGNOSTIC REPORT · ₹49
                </div>
                <div>
                  <h3 className="font-heading text-xl text-text-primary">
                    Unlock Subject-Wise Breakdown & Wrong Answers
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary/70 max-w-md mx-auto">
                    Get in-depth analytics including subject accuracy bars, exact correct answers for all questions, and personalized revision recommendations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleUnlockClick}
                  disabled={reportLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-7 py-3 font-heading text-sm font-semibold text-white hover:bg-gold-dark disabled:opacity-50 shadow-sm"
                >
                  {reportLoading ? "Loading QR…" : "Unlock Detailed Report — ₹49 ⚡"}
                </button>
              </div>
            )}

            {/* Payment Modal / Card with UPI QR */}
            {paymentOrder && !detailedReport && (
              <div className="rounded-xl border-2 border-white/10 bg-surface p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="ticket-stamp inline-block rounded bg-stamp-navy/10 px-2.5 py-1 font-mono text-[10px] uppercase font-bold text-text-primary">
                    UPI QR PAYMENT · ₹49
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentOrder(null)}
                    className="font-mono text-xs text-text-primary/60 hover:text-text-primary"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="text-center">
                  <h3 className="font-heading text-xl text-text-primary">
                    Scan QR Code to Pay ₹49
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary/70">
                    Scan with any UPI app (GPay, PhonePe, Paytm, BHIM), then enter your transaction ID / UTR below.
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-4 bg-bg/60 rounded-xl border border-white/10">
                  <div className="p-3 bg-surface rounded-lg shadow-sm">
                    <QRCodeSVG
                      value={paymentOrder.upiUri}
                      size={180}
                      bgColor="#ffffff"
                      fgColor="#0a192f"
                      level="Q"
                    />
                  </div>
                  <div className="mt-3 text-center space-y-1 font-mono text-xs text-text-primary/80">
                    <p>
                      <strong>Payee:</strong> {paymentOrder.payeeName}
                    </p>
                    <p>
                      <strong>UPI ID:</strong> {paymentOrder.upiId}
                    </p>
                    <p className="text-white font-bold">
                      <strong>Ref Code:</strong> {paymentOrder.referenceCode}
                    </p>
                  </div>
                  <p className="mt-2 text-[10px] font-mono text-text-secondary/50 italic">
                    Self-verified payment for demo purposes.
                  </p>
                </div>

                {/* Verification Form */}
                <form onSubmit={handleVerifyPayment} className="space-y-4">
                  {paymentError && (
                    <div className="rounded-lg bg-gold/10 p-3 font-mono text-xs text-stamp-maroon">
                      {paymentError}
                    </div>
                  )}

                  <div>
                    <label className="block font-mono text-xs text-text-primary/70 mb-1">
                      UPI Transaction ID / UTR Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 423456789012 or UPI Ref No."
                      value={upiTxnInput}
                      onChange={(e) => setUpiTxnInput(e.target.value)}
                      disabled={paymentSubmitting}
                      className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-stamp-navy/20 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentOrder(null)}
                      className="font-mono text-xs text-text-primary/70 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={paymentSubmitting || !upiTxnInput.trim()}
                      className="rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-xs font-semibold text-white hover:bg-stamp-navy/90 disabled:opacity-50"
                    >
                      {paymentSubmitting ? "Verifying…" : "Submit & Unlock Report ✓"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* UNLOCKED DETAILED REPORT VIEW */}
            {detailedReport && (
              <div className="rounded-xl border-2 border-gold/40 bg-surface/40 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="ticket-stamp inline-block rounded bg-green-100 px-3 py-1 font-mono text-xs uppercase font-bold text-green-900">
                    ✓ DETAILED DIAGNOSTIC REPORT UNLOCKED
                  </div>
                  <span className="font-mono text-xs text-text-primary/60">
                    Ref: {detailedReport.referenceCode}
                  </span>
                </div>

                {/* Subject-Wise Accuracy Breakdown */}
                <div>
                  <h3 className="font-heading text-lg text-text-primary mb-3">
                    Subject-Wise Accuracy Breakdown
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {detailedReport.subjectBreakdown?.map((sb, sbIdx) => (
                      <div
                        key={sbIdx}
                        className="rounded-lg border border-white/10 bg-surface p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-xs font-bold text-text-primary">
                            {sb.subject}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            {sb.accuracyPercent}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-stamp-navy/10 overflow-hidden">
                          <div
                            className="h-full bg-gold rounded-full transition-all duration-500"
                            style={{ width: `${sb.accuracyPercent}%` }}
                          />
                        </div>
                        <p className="text-[11px] font-mono text-text-secondary/60">
                          {sb.correct} of {sb.total} questions answered correctly
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Areas & Focus Recommendations */}
                <div className="rounded-lg border border-white/10 bg-surface p-4 space-y-2">
                  <h4 className="font-heading text-xs uppercase tracking-wider text-text-primary/80">
                    🎯 Personalized Revision Focus
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-text-secondary/80">
                    {detailedReport.weakAreas?.map((wa, waIdx) => (
                      <li key={waIdx}>{wa}</li>
                    ))}
                  </ul>
                </div>

                {/* Wrong & Corrected Questions Review */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg text-text-primary">
                    Comprehensive Question-by-Question Diagnostic
                  </h3>
                  <div className="space-y-3">
                    {detailedReport.allQuestions?.map((q) => (
                      <div
                        key={q.index}
                        className={`rounded-lg border p-4 text-xs space-y-2 ${
                          q.isCorrect
                            ? "border-green-300 bg-green-50/50"
                            : "border-red-200 bg-red-50/60"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-text-primary">
                            Q{q.index}. [{q.subject}]
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 font-bold uppercase text-[10px] ${
                              q.isCorrect
                                ? "bg-green-200 text-green-900"
                                : "bg-red-200 text-red-900"
                            }`}
                          >
                            {q.isCorrect ? "✓ Correct" : "✕ Needs Review"}
                          </span>
                        </div>

                        <p className="font-heading text-sm text-text-primary">
                          {q.questionText}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {q.options?.map((opt, optIdx) => {
                            const isUserPick = q.selectedIndex === optIdx;
                            const isCorrectOpt = q.correctOptionIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`rounded px-3 py-1.5 flex items-center justify-between ${
                                  isCorrectOpt
                                    ? "bg-green-200 text-green-950 font-bold border border-green-400/50"
                                    : isUserPick && !q.isCorrect
                                    ? "bg-red-200/80 text-red-950 font-medium border border-red-300"
                                    : "bg-surface/70 text-text-secondary/75"
                                }`}
                              >
                                <span>
                                  <span className="font-mono font-bold mr-1.5">
                                    {["A", "B", "C", "D"][optIdx]}.
                                  </span>
                                  {opt}
                                </span>
                                <span className="font-mono text-[10px]">
                                  {isCorrectOpt && "✓ Correct Answer"}
                                  {isUserPick && !isCorrectOpt && "✕ Your Answer"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Standard Question Breakdown (when detailed report not yet unlocked) */}
            {!detailedReport && (
              <div className="space-y-4 pt-4 border-t border-dashed border-white/10">
                <h3 className="font-heading text-lg text-text-primary">
                  Question Summary ({result.questions?.filter((q) => q.isCorrect).length || 0} of {result.questions?.length || 15} Correct)
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
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <button
                type="button"
                onClick={() => {
                  setPhase("select");
                  setResult(null);
                  setDetailedReport(null);
                  setPaymentOrder(null);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-sm font-semibold text-white hover:bg-stamp-navy/90"
              >
                Take Another Test 🔄
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

        {/* Proctoring Warning Modal */}
        {warningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="ticket-card max-w-md w-full bg-bg p-6 sm:p-8 space-y-4 border-2 border-stamp-maroon/40 shadow-2xl">
              <div className="ticket-stamp inline-block rounded bg-red-100 px-2.5 py-1 font-mono text-[10px] uppercase font-bold text-stamp-maroon">
                ⚠️ PROCTORING VIOLATION #{violationCount} OF 3
              </div>

              <h3 className="font-heading text-xl text-text-primary">
                Tab switch or fullscreen exit detected!
              </h3>

              <p className="text-xs text-text-secondary/80 leading-relaxed">
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
