import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import ResumeMatchResult from "../components/ResumeMatchResult.jsx";

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
    if (submittingRef.current) return; // prevent rapid-fire duplicate uploads
    setError("");
    if (!file) {
      setError("Please upload a resume (PDF or DOCX) first.");
      return;
    }
    if (jobDesc.trim().length < 20) {
      setError("Please paste a job description of at least 20 characters.");
      return;
    }
    submittingRef.current = true;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("jobDescription", jobDesc.trim());
      // FormData upload: axios sets multipart/form-data with a boundary itself.
      const { data } = await api.post("/resume/match", form);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Could not match your resume. Try again."
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
    <div className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/dashboard"
          className="font-mono text-xs text-stamp-navy/70 hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <div className="ticket-card mt-6 p-6 sm:p-8">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
            PREPPASS — RESUME MATCHER
          </div>
          <h1 className="mt-3 font-heading text-2xl text-stamp-navy">
            Match your resume to a role.
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Upload a PDF/DOCX and paste the job description.
          </p>

          {error && (
            <p className="mt-4 rounded-lg bg-gold/10 px-4 py-3 font-mono text-xs text-stamp-maroon">
              {error}
            </p>
          )}

          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-6">
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
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stamp-navy/25 px-6 py-10 text-center transition-colors ${
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
              <span className="font-heading text-stamp-navy">
                Drop resume here
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-stamp-navy/50">
                click or drop · .pdf / .docx · ≤ 5 MB
              </span>
              {file && (
                <span className="mt-3 rounded-full bg-stamp-navy/10 px-3 py-1 font-mono text-xs text-stamp-navy">
                  ✓ {file.name}
                </span>
              )}
            </div>

            <label className="mt-6 block font-mono text-[10px] uppercase tracking-wider text-stamp-navy/60">
              Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={7}
              placeholder="Paste the job description here…"
              className="mt-2 w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-ink placeholder-ink/40 focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/30"
            />

            <button
              type="submit"
              disabled={busy}
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-stamp-navy px-6 py-3 font-heading font-semibold tracking-wider text-white hover:bg-stamp-navy/90 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 disabled:opacity-60 sm:w-auto"
            >
              {busy ? "Analyzing your resume…" : "Match Resume"}
            </button>
            {busy && (
              <p className="mt-2 font-mono text-[10px] text-stamp-navy/50">
                This can take a few seconds.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
