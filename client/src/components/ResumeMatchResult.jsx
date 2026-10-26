import { Link } from "react-router-dom";
import GaugeCircle from "./GaugeCircle.jsx";
import { ArrowLeft, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function ResumeMatchResult({ result, onReset }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Candidate Dossier
        </Link>
        <div className="ticket-card mt-6 p-6 sm:p-10 border border-[#C5A059]/40 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
            <ShieldCheck size={12} className="text-[#C5A059]" />
            <span>PRÆPPASS — ATS VECTOR COMPLIANCE AUDIT</span>
          </div>

          <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
            Job Description Semantic Match
          </h1>

          <div className="mt-8 flex flex-col items-center">
            <GaugeCircle
              value={result.matchScorePercent ?? 0}
              max={100}
              size={172}
              caption="ATS Alignment Index"
            />
          </div>
          <div className="ticket-perf my-8" />

          {/* Matched Skills */}
          <div>
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128] mb-3">
              Matched Keywords & Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills?.length ? (
                result.matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-800"
                  >
                    <CheckCircle2 size={12} /> {s}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No matched keywords detected in target JD.</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="mt-8">
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128] mb-3">
              Critical Keywords to Integrate
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills?.length ? (
                result.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-mono font-semibold text-amber-900"
                  >
                    <AlertTriangle size={12} className="text-amber-700" /> {s}
                  </span>
                ))
              ) : (
                <p className="text-sm text-emerald-700 font-medium">
                  Zero keyword gaps detected — excellent ATS keyword density.
                </p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8">
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128] mb-3">
              Candidate Resume Recommendations
            </h2>
            <ol className="space-y-3">
              {result.recommendations?.length ? (
                result.recommendations.map((r, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-[#0A1128]/8 bg-[#FDFBF7] p-4 flex gap-3 text-sm text-slate-700 shadow-2xs"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0A1128] font-mono text-xs font-bold text-[#C5A059]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500">No specific keyword modifications required.</li>
              )}
            </ol>
          </div>

          <div className="mt-10 pt-6 border-t border-[#0A1128]/8 flex items-center justify-between">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1128] px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition"
            >
              <span>Audit Another Job Description</span>
              <ArrowRight size={14} className="text-[#C5A059]" />
            </button>
            <Link
              to="/dashboard"
              className="font-mono text-xs font-semibold text-slate-500 hover:text-navy-900"
            >
              Return to Dossier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
