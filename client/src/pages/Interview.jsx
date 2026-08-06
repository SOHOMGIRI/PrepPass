import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import InterviewCard from "../components/InterviewCard.jsx";
import SessionResults from "../components/SessionResults.jsx";

const ROLES = ["Software Engineer", "Data Analyst", "HR Generalist"];

export default function Interview() {
  const [phase, setPhase] = useState("select"); // select | live | feedback | complete
  const [role, setRole] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [last, setLast] = useState(null); // { score, feedback }
  const [nextQ, setNextQ] = useState("");
  const [full, setFull] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const start = async (chosen) => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/interview/start", { role: chosen });
      setRole(chosen);
      setSessionId(data.sessionId);
      setQuestion(data.question);
      setStep(0);
      setPhase("live");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not start the interview.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!answer.trim()) {
      setError("Please enter an answer.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/interview/answer", {
        sessionId,
        answerText: answer,
      });
      setLast({ score: data.score, feedback: data.feedback || "" });
      setAnswer("");
      if (data.completed) {
        // Pull the full session for the per-question breakdown.
        const { data: sd } = await api.get(`/interview/session/${sessionId}`);
        setFull(sd.session);
        setPhase("complete");
      } else {
        setNextQ(data.nextQuestion || "");
        setStep((s) => s + 1);
        setPhase("feedback");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong while submitting."
      );
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    setQuestion(nextQ);
    setPhase("live");
  };

  // Auto-advance a few seconds after showing the score/feedback.
  useEffect(() => {
    if (phase !== "feedback") return;
    const t = setTimeout(() => {
      setQuestion(nextQ);
      setPhase("live");
    }, 5000);
    return () => clearTimeout(t);
  }, [phase, nextQ]);

  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <SessionResults session={full} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/dashboard"
          className="font-mono text-xs text-stamp-navy/70 hover:underline"
        >
          ← Back to Dashboard
        </Link>
        {error && (
          <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
            {error}
          </p>
        )}
        {phase === "select" ? (
          <div className="ticket-card mt-6 p-6 sm:p-8">
            <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
              PREPPASS — INTERVIEW
            </div>
            <h1 className="mt-3 font-heading text-2xl text-stamp-navy">
              Select a role to rehearse.
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              Four adaptive questions, scored in real time.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => start(r)}
                  disabled={busy}
                  className="ticket-card px-4 py-5 text-left transition hover:border-stamp-navy/50 disabled:opacity-60"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stamp-navy/50">
                    ROLE
                  </span>
                  <span className="mt-1 block font-heading text-sm text-stamp-navy">
                    {r}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <InterviewCard
            phase={phase}
            role={role}
            step={step}
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            busy={busy}
            last={last}
            onNext={next}
            onSubmit={submit}
          />
        )}
      </div>
    </div>
  );
}
