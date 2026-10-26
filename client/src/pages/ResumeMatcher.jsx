import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import ResumeMatchResult from "../components/ResumeMatchResult.jsx";
import { computeClientAtsMatch } from "../utils/clientAtsEngine.js";
import { UploadCloud, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const ACCEPT = ".pdf,.docx";
const ACCEPT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPT_EXT = [".pdf", ".docx"];

const isAccepted = (f) => {
  const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
  return ACCEPT_EXT.includes(ext) || ACCEPT_TYPES.includes(f.type) || ext === ".pdf" || ext === ".docx";
};

export default function ResumeMatcher() {
  const inputRef = useRef(null);
  const submittingRef = useRef(false);
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!isAccepted(f)) {
      setError(
        "Unsupported format. Please provide an authentic PDF (.pdf) or Word (.docx) document."
      );
      setFile(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB payload limitation.");
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  };

  const submit = async () => {
    if (submittingRef.current) return;
    setError("");
    if (!file) {
      setError("Please attach your candidate resume document (PDF or DOCX).");
      return;
    }
    if (jobDesc.trim().length < 3) {
      setError("Please input a target Job Description or Role Title.");
      return;
    }
    submittingRef.current = true;
    setBusy(true);

    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("jobDescription", jobDesc.trim());
      
      // Try remote API analysis first with 8s timeout
      const response = await Promise.race([
        api.post("/resume/match", form),
        new Promise((_, reject) => setTimeout(() => reject(new Error("CLOUD_TIMEOUT")), 12000))
      ]);
      if (response?.data && (response.data.matchScorePercent || response.data.matchedSkills)) {
        setResult(response.data);
        return;
      }
      throw new Error("Invalid response format");
    } catch (apiErr) {
      console.warn("[PRÆPPASS] Activating zero-latency client semantic ATS engine:", apiErr.message);
      try {
        const clientResult = await computeClientAtsMatch(file, jobDesc.trim());
        setResult(clientResult);
      } catch (clientErr) {
        console.error("[PRÆPPASS] Client ATS engine error:", clientErr);
        setError("Could not parse file. Please upload an unencrypted PDF or Word document.");
      }
    } finally {
      submittingRef.current = false;
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setJobDesc("");
    setError("");
  };

  if (result) return <ResumeMatchResult result={result} onReset={reset} />;

  return (
    <div className="min-h-screen bg-transparent relative z-10 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-900/80 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidate Dossier
        </Link>

        {/* Main luxury frosted champagne card */}
        <div 
          className="ticket-card mt-6 p-6 sm:p-10 border border-amber-400/50 shadow-2xl relative overflow-hidden backdrop-blur-md"
          style={{
            background: "linear-gradient(145deg, rgba(254, 250, 242, 0.96) 0%, rgba(246, 238, 224, 0.93) 50%, rgba(239, 227, 208, 0.95) 100%)",
            boxShadow: "0 24px 60px -12px rgba(180, 130, 60, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
          }}
        >
          {/* Subtle amber ambient corner glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-300/25 via-rose-200/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 font-mono text-[10px] uppercase tracking-widest text-amber-950 font-bold shadow-2xs">
            <ShieldCheck size={13} className="text-amber-700" />
            <span>PRÆPPASS — ATS VECTOR COMPLIANCE MATCHER</span>
          </div>

          <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Audit Resume Against Target Role
          </h1>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed">
            Upload your candidate resume and enter the target role or job description to compute semantic percentile fit, keyword overlap, and critical competencies.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-100/80 border border-rose-300 px-4 py-3 font-mono text-xs text-rose-900 shadow-2xs">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-6 space-y-6 relative z-10"
          >
            {/* File Upload Zone with Warm Parchment Glass */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                handleFile(e.dataTransfer?.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                drag
                  ? "border-amber-600 bg-amber-200/50 shadow-inner"
                  : "border-amber-400/70 bg-amber-100/35 hover:border-amber-500 hover:bg-amber-100/55 shadow-2xs"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="w-13 h-13 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center mb-3 shadow-sm border border-amber-300/70">
                <UploadCloud size={26} className="text-amber-800" />
              </div>
              <span className="font-heading text-base font-bold text-slate-900">
                {file ? file.name : "Select or Drop Candidate Resume"}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-amber-900/70 font-semibold">
                PDF (.pdf) or Word (.docx) · Maximum size 10 MB
              </span>
              {file && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-400 px-4 py-1.5 font-mono text-xs font-bold text-emerald-900 shadow-2xs">
                  <CheckCircle2 size={13} className="text-emerald-700" /> File Attached ({Math.round(file.size / 1024)} KB)
                </span>
              )}
            </div>

            {/* Target Job Description Text Area */}
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-amber-950 mb-2">
                Target Role Title or Full Job Description
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={6}
                placeholder="Paste the target role title or full requirements (e.g. 'Software Engineer at an MNC', 'Senior Full Stack Engineer with Node.js, React, and Distributed Systems')..."
                className="w-full rounded-2xl border border-amber-300/70 bg-amber-50/60 p-4 text-sm text-slate-900 placeholder-slate-500/80 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 focus:bg-amber-50/90 leading-relaxed shadow-inner transition-all font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #2D241E 0%, #15110E 100%)",
                }}
              >
                {busy ? (
                  <>
                    <span className="animate-spin text-amber-400">⟳</span>
                    <span>Computing Semantic Vectors…</span>
                  </>
                ) : (
                  <>
                    <span>Compute ATS Vector Alignment</span>
                    <ArrowRight size={14} className="text-amber-400" />
                  </>
                )}
              </button>

              {file && (
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono text-xs font-semibold text-amber-900/80 hover:text-amber-950 underline transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {busy && (
              <p className="font-mono text-xs text-amber-900/70 text-center animate-pulse">
                Auditing token alignment, cross-referencing industry skill taxonomy, and evaluating vector distance…
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
