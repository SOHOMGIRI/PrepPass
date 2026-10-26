import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import InterviewCard from "../components/InterviewCard.jsx";
import SessionResults from "../components/SessionResults.jsx";
import CameraPreview from "../components/CameraPreview.jsx";
import { Mic, Video, ArrowLeft, Search, ShieldCheck, Sparkles, Building } from "lucide-react";

const CATEGORIES = [
  "All",
  "Engineering",
  "Data & AI",
  "Product & Design",
  "Business & Management",
  "Support & Operations",
];

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

  // Optional Voice & Camera Preferences
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const isSpeechSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Role selection state
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Fetch roles on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/interview/roles");
        if (!cancelled) setRoles(data.roles || []);
      } catch {
        if (!cancelled) setRoles([]);
      } finally {
        if (!cancelled) setRolesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRoles = roles.filter((r) => {
    const matchesCategory = category === "All" || r.category === category;
    const matchesSearch =
      !search.trim() ||
      r.label.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      setError(err?.response?.data?.message || "Could not start the assessment session.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!answer.trim()) {
      setError("Please articulate or type a response before submitting.");
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
        err?.response?.data?.message || "Evaluation service encountered a temporary error."
      );
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    setQuestion(nextQ);
    setPhase("live");
  };

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
      <div className="min-h-screen bg-transparent relative z-10 px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <SessionResults session={full} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative z-10 px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidate Dossier
        </Link>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-mono text-xs text-red-700">
            {error}
          </div>
        )}

        {phase === "select" ? (
          <div className="ticket-card mt-6 p-6 sm:p-10 space-y-7 border border-[#C5A059]/30">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
                <ShieldCheck size={12} className="text-[#C5A059]" />
                <span>PRÆPPASS ASSESSMENT BOARD</span>
              </div>
              <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
                Select Professional Track to Rehearse
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Four adaptive algorithmic & behavioral questions with real-time acoustic prosody telemetry.
              </p>
            </div>

            {/* Assessment Preferences (Voice & Camera) */}
            <div className="rounded-2xl border border-[#0A1128]/8 bg-transparent relative z-10 p-5 space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0A1128] font-bold block">
                Telemetry Sensors & Calibration
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex items-start gap-3 rounded-xl border p-4 transition select-none ${
                    !isSpeechSupported
                      ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200"
                      : voiceEnabled
                      ? "border-[#C5A059] bg-white shadow-xs cursor-pointer ring-1 ring-[#C5A059]/30"
                      : "border-[#0A1128]/10 bg-white hover:border-[#0A1128]/20 cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={(e) => isSpeechSupported && setVoiceEnabled(e.target.checked)}
                    disabled={!isSpeechSupported}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-[#C5A059]"
                  />
                  <div>
                    <span className="font-heading text-xs font-bold text-[#0A1128] flex items-center gap-1.5">
                      <Mic size={14} className="text-[#C5A059]" /> Live Acoustic Prosody (Web Audio)
                    </span>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      Measures words-per-minute cadence, silence pauses, and detects filler words in real time.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 rounded-xl border p-4 transition select-none cursor-pointer ${
                    cameraEnabled
                      ? "border-[#C5A059] bg-white shadow-xs ring-1 ring-[#C5A059]/30"
                      : "border-[#0A1128]/10 bg-white hover:border-[#0A1128]/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={cameraEnabled}
                    onChange={(e) => setCameraEnabled(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-900 focus:ring-[#C5A059]"
                  />
                  <div>
                    <span className="font-heading text-xs font-bold text-[#0A1128] flex items-center gap-1.5">
                      <Video size={14} className="text-[#C5A059]" /> Visual Posture Preview
                    </span>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      Mirrored browser-only video feed. Zero streaming to server; runs strictly local.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by engineering role or discipline (e.g., Full Stack, Backend, DevOps)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#0A1128]/10 bg-white pl-11 pr-4 py-3 text-sm text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] shadow-2xs"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-xl px-4 py-2 font-mono text-[11px] tracking-wide transition-all ${
                    category === cat
                      ? "bg-[#0A1128] text-white font-bold shadow-xs"
                      : "bg-[#0A1128]/5 text-slate-600 hover:bg-[#0A1128]/10 font-medium"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Roles Grid */}
            {rolesLoading ? (
              <p className="mt-6 text-center text-sm font-mono text-slate-400">Loading accredited roles…</p>
            ) : filteredRoles.length === 0 ? (
              <p className="mt-6 text-center text-sm font-mono text-slate-400">No matching tracks located.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRoles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => start(r.label)}
                    disabled={busy}
                    className="ticket-card p-5 text-left transition hover:border-[#C5A059]/60 hover:shadow-sm disabled:opacity-60 group"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block group-hover:text-[#9E7B35]">
                      {r.category}
                    </span>
                    <span className="mt-1 block font-heading text-sm font-bold text-[#0A1128]">
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
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
              voiceEnabled={voiceEnabled}
              setVoiceEnabled={setVoiceEnabled}
              isSpeechSupported={isSpeechSupported}
            />

            <CameraPreview
              enabled={cameraEnabled && (phase === "live" || phase === "feedback")}
              onClose={() => setCameraEnabled(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}
