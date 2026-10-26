import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import ResumeMatchResult from "../components/ResumeMatchResult.jsx";
import { UploadCloud, FileText, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

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
    if (jobDesc.trim().length < 20) {
      setError("Please input a target Job Description with at least 20 characters.");
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
            <span>PRÆPPASS — ATS VECTOR MATCHER</span>
          </div>
          <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
            Audit Resume Against Target Role
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload your candidate resume and supply the target Job Description to compute semantic match percentiles and keyword gaps.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-mono text-xs text-red-700">
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
                  ✓ File Attached ({Math.round(file.size / 1024)} KB)
                </span>
              )}
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A1128] mb-2">
                Target Job Description
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={7}
                placeholder="Paste the target requirements, qualifications, and responsibilities verbatim from the job listing…"
                className="w-full rounded-xl border border-[#0A1128]/10 bg-white p-4 text-sm text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] leading-relaxed shadow-2xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1128] px-8 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition disabled:opacity-50"
              >
                <span>{busy ? "Parsing Semantic Vectors…" : "Compute ATS Vector Alignment"}</span>
                <ArrowRight size={15} className="text-[#C5A059]" />
              </button>
            </div>
            {busy && (
              <p className="font-mono text-xs text-slate-400 text-center">
                Processing document tokens and computing vector distance…
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
