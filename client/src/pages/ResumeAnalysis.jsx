import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";
import { UploadCloud, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, FileText } from "lucide-react";

const ACCEPT = ".pdf,.docx";
const ACCEPT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPT_EXT = [".pdf", ".docx"];

const isAccepted = (f) => {
  const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
  return ACCEPT_EXT.includes(ext) && ACCEPT_TYPES.includes(f.type);
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
    if (f.size > 5 * 1024 * 1024) {
      setError("File exceeds 5 MB payload limit.");
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
      const { data } = await api.post("/resume/analyze", form);
      setResult(data.analysis);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not analyze resume. Please retry in a moment."
      );
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
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidate Dossier
        </Link>
        <div className="ticket-card mt-6 p-6 sm:p-10 border border-[#C5A059]/35 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
            <ShieldCheck size={12} className="text-[#C5A059]" />
            <span>PRÆPPASS — ATS PARSER AUDIT</span>
          </div>
          <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
            Automated Resume & ATS Compliance Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload your resume for an automated 0–100 ATS compliance score, section completeness check, and personalized subject recommendations.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-mono text-xs text-red-700">
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
                className="mt-6 space-y-6"
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
                      ? "border-[#C5A059] bg-[#C5A059]/10"
                      : "border-[#0A1128]/15 bg-white hover:border-[#C5A059] hover:bg-[#FDFBF7]"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#0A1128]/5 flex items-center justify-center text-[#0A1128] mb-3">
                    <UploadCloud size={24} className="text-[#C5A059]" />
                  </div>
                  <span className="font-heading text-base font-bold text-[#0A1128]">
                    {file ? file.name : "Select or Drop Candidate Resume"}
                  </span>
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    PDF (.pdf) or Word (.docx) · Maximum size 5 MB
                  </span>
                  {file && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 font-mono text-xs font-bold text-emerald-800">
                      ✓ File Ready ({Math.round(file.size / 1024)} KB)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={busy || !file}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1128] px-8 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition disabled:opacity-50"
                  >
                    <span>{busy ? "Parsing ATS Document…" : "Analyze Candidate Resume"}</span>
                    <ArrowRight size={15} className="text-[#C5A059]" />
                  </button>
                </div>
                {busy && (
                  <p className="font-mono text-xs text-slate-400 text-center">
                    Auditing formatting tokens and section completeness…
                  </p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-8 items-start pb-6 border-b border-[#0A1128]/8">
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <GaugeCircle
                      value={result.atsScore}
                      max={100}
                      size={140}
                      caption="ATS Score"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-[#0A1128] mb-3">
                      ATS Compliance Summary
                    </h3>

                    {result.suggestedSubjects?.length > 0 && (
                      <div className="mb-4">
                        <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-2">
                          Suggested Preparation Subjects
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.suggestedSubjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="bg-[#C5A059]/10 border border-[#C5A059]/25 text-[#9E7B35] px-3 py-1 rounded-full font-mono text-xs font-bold"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.missingSections?.length > 0 && (
                      <div className="mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-red-700 block mb-1">
                          Missing ATS Sections
                        </span>
                        <ul className="list-disc pl-4 text-xs text-red-700 space-y-1">
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
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128] mb-2">
                      Formatting & Parser Warnings
                    </h4>
                    <ul className="list-disc pl-5 mt-2 text-xs text-slate-600 space-y-1.5 leading-relaxed">
                      {result.formattingIssues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.improvementTips?.length > 0 && (
                  <div>
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128] mb-2">
                      Examiner Improvement Recommendations
                    </h4>
                    <ol className="list-decimal pl-5 mt-2 text-xs text-slate-700 space-y-2 leading-relaxed">
                      {result.improvementTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="pt-6 border-t border-[#0A1128]/8 flex items-center justify-between">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0A1128] px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B]"
                  >
                    <span>Analyze Another Resume</span>
                    <ArrowRight size={13} className="text-[#C5A059]" />
                  </button>
                  <Link
                    to="/dashboard"
                    className="font-mono text-xs font-semibold text-slate-500 hover:text-navy-900"
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
