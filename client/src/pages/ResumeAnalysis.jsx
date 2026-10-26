import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";
import { computeClientAtsAnalysis } from "../utils/clientAtsEngine.js";
import { UploadCloud, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, FileText } from "lucide-react";

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

export default function ResumeAnalysis() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!isAccepted(f)) {
      setError(
        "Unsupported format. Only authentic PDF (.pdf) and Word (.docx) files are supported."
      );
      setFile(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB payload limit.");
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  };

  const submit = async () => {
    setError("");
    if (!file) {
      setError("Please attach your candidate resume document (PDF or DOCX).");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      const response = await Promise.race([
        api.post("/resume/analyze", form),
        new Promise((_, reject) => setTimeout(() => reject(new Error("CLOUD_TIMEOUT")), 12000))
      ]);
      const resData = response?.data?.analysis || response?.data;
      if (resData && typeof resData.atsScore === "number") {
        setResult(resData);
        return;
      }
      throw new Error("Invalid format");
    } catch (apiErr) {
      console.warn("[PRÆPPASS] Activating zero-latency client ATS audit engine:", apiErr.message);
      try {
        const clientResult = await computeClientAtsAnalysis(file);
        setResult(clientResult);
      } catch (clientErr) {
        console.error("[PRÆPPASS] Client ATS analysis error:", clientErr);
        setError("Could not parse file. Please upload an unencrypted PDF or Word document.");
      }
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-transparent relative z-10 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-900/80 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidate Dossier
        </Link>
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
            <span>PRÆPPASS — ATS PARSER AUDIT</span>
          </div>
          <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Automated Resume &amp; ATS Compliance Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed">
            Upload your resume for an automated 0–100 ATS compliance score, section completeness check, and personalized subject recommendations.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-100/80 border border-rose-300 px-4 py-3 font-mono text-xs text-rose-900 shadow-2xs">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="mt-6 space-y-6 relative z-10"
              >
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

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={busy || !file}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #2D241E 0%, #15110E 100%)" }}
                  >
                    {busy ? (
                      <>
                        <span className="animate-spin text-amber-400">⟳</span>
                        <span>Auditing ATS Tokens…</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Candidate Resume</span>
                        <ArrowRight size={14} className="text-amber-400" />
                      </>
                    )}
                  </button>
                </div>
                {busy && (
                  <p className="font-mono text-xs text-amber-900/70 text-center animate-pulse">
                    Auditing formatting tokens, verifying ATS single-column density, and computing section completeness…
                  </p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 space-y-6 relative z-10"
              >
                <div className="flex flex-col sm:flex-row gap-8 items-start pb-6 border-b border-amber-300/40">
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <GaugeCircle
                      value={result.atsScore}
                      max={100}
                      size={140}
                      caption="ATS Score"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-slate-900 mb-3">
                      ATS Compliance Summary
                    </h3>

                    {result.suggestedSubjects?.length > 0 && (
                      <div className="mb-4">
                        <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-amber-950 block mb-2">
                          Suggested Preparation Subjects
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.suggestedSubjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="bg-amber-100/90 border border-amber-300 px-3.5 py-1 rounded-full font-mono text-xs font-bold text-amber-950 shadow-2xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.missingSections?.length > 0 && (
                      <div className="mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-rose-800 block mb-1">
                          Missing ATS Sections
                        </span>
                        <ul className="list-disc pl-4 text-xs text-rose-800 space-y-1">
                          {result.missingSections.map((sec, idx) => (
                            <li key={idx}>{sec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {result.formattingIssues?.length > 0 && (
                  <div>
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                      Formatting &amp; Parser Warnings
                    </h4>
                    <ul className="list-disc pl-5 mt-2 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                      {result.formattingIssues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.improvementTips?.length > 0 && (
                  <div>
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                      Examiner Improvement Recommendations
                    </h4>
                    <ol className="list-decimal pl-5 mt-2 text-xs text-slate-800 space-y-2 leading-relaxed">
                      {result.improvementTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="pt-6 border-t border-amber-300/40 flex items-center justify-between">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #2D241E 0%, #15110E 100%)" }}
                  >
                    <span>Analyze Another Resume</span>
                    <ArrowRight size={13} className="text-amber-400" />
                  </button>
                  <Link
                    to="/dashboard"
                    className="font-mono text-xs font-semibold text-amber-900/80 hover:text-amber-950 underline"
                  >
                    Return to Dossier
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
