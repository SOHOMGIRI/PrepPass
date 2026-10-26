import { Link } from "react-router-dom";
import GaugeCircle from "./GaugeCircle.jsx";
import ScoreBars from "./ScoreBars.jsx";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

export default function SessionResults({ session }) {
  if (!session) return null;
  const { role, companyId, overallReadinessScore, startedAt, questions = [] } = session;
  const scored = questions.filter(
    (q) => q && q.score && q.score.overall != null
  );

  return (
    <div className="ticket-card w-full max-w-3xl p-6 sm:p-10 border border-[#C5A059]/40 shadow-card">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
        <ShieldCheck size={12} className="text-[#C5A059]" />
        <span>PRÆPPASS — INTERVIEW EVALUATION CERTIFICATE</span>
      </div>
      <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-[#0A1128]">
        Candidate Assessment Concluded
      </h1>
      <p className="mt-1 font-mono text-xs text-slate-500">
        {companyId ? `${companyId.toUpperCase()} TRACK · ` : ""}{role} · {fmtDate(startedAt)}
      </p>

      <div className="mt-8 flex flex-col items-center">
        <GaugeCircle
          value={overallReadinessScore ?? 0}
          max={10}
          size={172}
          caption="Overall Readiness Grade"
        />
      </div>

      <div className="ticket-perf my-8" />

      <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0A1128]">
        Per-Question Diagnostic Rubric
      </h2>
      <div className="mt-4 space-y-4">
        {scored.map((q, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#0A1128]/8 bg-transparent relative z-10 p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                QUESTION {i + 1} · {q.category.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#0A1128]">{q.questionText}</p>
            <div className="mt-3 max-w-md">
              <ScoreBars score={q.score} />
            </div>
            {q.feedback && (
              <div className="mt-3 border-t border-dashed border-[#0A1128]/10 pt-3 text-xs text-slate-700 leading-relaxed">
                <strong className="text-navy-900 font-mono text-[11px] block mb-0.5">Examiner Rubric:</strong>
                {q.feedback}
              </div>
            )}
          </div>
        ))}
        {scored.length === 0 && (
          <p className="text-sm text-slate-500">No scored questions recorded in this session.</p>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#0A1128]/8 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A1128] px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition"
        >
          <ArrowLeft size={14} className="text-[#C5A059]" />
          <span>Return to Candidate Dossier</span>
        </Link>
        <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
          <CheckCircle2 size={13} /> ACCREDITED RESULT
        </span>
      </div>
    </div>
  );
}
