import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import GaugeCircle from "../components/GaugeCircle.jsx";
import { motion, AnimatePresence } from "framer-motion";

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
  const submittingRef = useRef(false);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!isAccepted(f)) {
      setError(
        "Unsupported file type. Only PDF (.pdf) and DOCX (.docx) are accepted."
      );
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File is larger than 5 MB.");
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
      setError("Please upload a resume (PDF or DOCX) first.");
      return;
    }
    submittingRef.current = true;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      const { data } = await api.post("/resume/analyze", form);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not analyze your resume. Try again."
      );
    } finally {
      submittingRef.current = false;
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/dashboard"
          className="font-mono text-xs text-text-primary/70 hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <div className="ticket-card mt-6 p-6 sm:p-8">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
            PREPPASS • ATS AUDIT
          </div>
          <h1 className="mt-3 font-heading text-2xl text-text-primary">
            Resume Analysis
          </h1>
          <p className="mt-1 text-sm text-text-secondary/60">
            Upload your resume to get an instant ATS compatibility score, identify missing sections, and discover suggested preparation topics.
          </p>

          {error && (
            <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
              {error}
            </p>
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
                className="mt-6"
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
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 px-6 py-10 text-center transition-colors ${
                    drag ? "bg-stamp-navy/5" : ""
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  <span className="font-heading text-text-primary">
                    Drop resume here
                  </span>
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-text-primary/50">
                    click or drop • .pdf / .docx • ≤ 5 MB
                  </span>
                  {file && (
                    <span className="mt-3 rounded-full bg-stamp-navy/10 px-3 py-1 font-mono text-xs text-text-primary">
                      📄 {file.name}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-stamp-navy px-6 py-3 font-heading font-semibold tracking-wider text-white hover:bg-stamp-navy/90 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 disabled:opacity-60 sm:w-auto"
                >
                  {busy ? "Analyzing your resume..." : "Analyze Resume"}
                </button>
                {busy && (
                  <p className="mt-2 font-mono text-[10px] text-text-primary/50">
                    This can take up to 20 seconds. We're parsing and scoring your document.
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
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <GaugeCircle
                      value={result.analysis.atsScore}
                      max={100}
                      size={140}
                      caption="ATS Score"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl text-text-primary border-b border-white/10 pb-2 mb-4">
                      Overview
                    </h3>
                    
                    {result.analysis.suggestedSubjects?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-text-primary/60 mb-2">Suggested Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.analysis.suggestedSubjects.map((subject, idx) => (
                            <span key={idx} className="bg-gold/20 text-gold-dark px-2.5 py-1 rounded-full font-mono text-xs">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.analysis.missingSections?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-text-primary/60 mb-2">Missing Sections</h4>
                        <ul className="list-disc pl-4 text-sm text-stamp-maroon space-y-1">
                          {result.analysis.missingSections.map((sec, idx) => (
                            <li key={idx}>{sec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {result.analysis.formattingIssues?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-text-primary/60 mb-2 border-b border-white/10 pb-2">
                      Formatting Issues
                    </h4>
                    <ul className="list-disc pl-5 mt-3 text-sm text-text-secondary/80 space-y-2">
                      {result.analysis.formattingIssues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.analysis.improvementTips?.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-text-primary/60 mb-2 border-b border-white/10 pb-2">
                      Improvement Tips
                    </h4>
                    <ol className="list-decimal pl-5 mt-3 text-sm text-text-secondary/80 space-y-2">
                      {result.analysis.improvementTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="pt-6">
                  <button
                    onClick={reset}
                    className="inline-flex items-center justify-center rounded-lg border-2 border-dashed border-white/10 px-6 py-2.5 font-heading font-semibold tracking-wider text-text-primary hover:bg-stamp-navy/10 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2"
                  >
                    Analyze Another Resume
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
