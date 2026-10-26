import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import ResumeMatchResult from "../components/ResumeMatchResult.jsx";
import { UploadCloud, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const ACCEPT = ".pdf,.docx";
const ACCEPT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPT_EXT = [".pdf", ".docx"];

const isAccepted = (f) => {
  const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
  return ACCEPT_EXT.includes(ext) && (ACCEPT_TYPES.includes(f.type) || ext === ".pdf" || ext === ".docx");
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
    if (f.size > 5 * 1024 * 1024) {
      setError("File exceeds 5 MB payload limitation.");
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
    if (jobDesc.trim().length < 5) {
      setError("Please input a target Job Description or Role Title (at least 5 characters).");
      return;
    }
    submittingRef.current = true;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("jobDescription", jobDesc.trim());
      const { data } = await api.post("/resume/match", form);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not complete resume match. Please retry."
      );
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
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-900/70 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidate Dossier
        </Link>

        <div className="ticket-card mt-6 p-6 sm:p-10 border border-amber-300/40 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 font-mono text-[10px] uppercase tracking-widest text-amber-950 font-bold">
            <ShieldCheck size={12} className="text-amber-600" />
            <span>PRÆPPASS — ATS VECTOR MATCHER</span>
          </div>

          <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            Audit Resume Against Target Role
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload your candidate resume and supply the target Job Description to compute semantic match percentiles and keyword gaps.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 font-mono text-xs text-rose-800">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-6 space-y-6"
          >
            {/* File Upload Zone */}
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
                  ? "border-amber-500 bg-amber-100/50"
                  : "border-amber-300/60 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-100/30"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 shadow-2xs border border-amber-200/50">
                <UploadCloud size={24} className="text-amber-600" />
              </div>
              <span className="font-heading text-base font-bold text-slate-900">
                {file ? file.name : "Select or Drop Candidate Resume"}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-amber-800/60">
                PDF (.pdf) or Word (.docx) · Maximum size 5 MB
              </span>
              {file && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 font-mono text-xs font-bold text-emerald-800 shadow-2xs">
                  ✓ File Attached ({Math.round(file.size / 1024)} KB)
                </span>
              )}
            </div>

            {/* Target Job Description Text Area */}
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-2">
                Target Job Description or Role Title
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={7}
                placeholder="Paste the target role title or full job description (e.g. 'Software Engineer', 'Senior Backend Engineer with Node.js and Distributed Systems')..."
                className="w-full rounded-2xl border border-amber-300/50 bg-amber-50/20 p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white/80 leading-relaxed shadow-2xs transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #2D241E 0%, #1A1410 100%)",
                }}
              >
                {busy ? (
                  <>
                    <span className="animate-spin mr-1">⟳</span>
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
                  className="font-mono text-xs text-amber-800/70 hover:text-amber-950 underline"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
