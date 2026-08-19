import { Link } from "react-router-dom";
import GaugeCircle from "./GaugeCircle.jsx";
import ScoreBars from "./ScoreBars.jsx";

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

/**
 * Results screen for a completed interview. Shared by the live Interview flow
 * and the history session-detail view.
 */
export default function SessionResults({ session }) {
  if (!session) return null;
  const { role, companyId, overallReadinessScore, startedAt, questions = [] } = session;
  const scored = questions.filter(
    (q) => q && q.score && q.score.overall != null
  );

  return (
    <div className="ticket-card w-full max-w-2xl p-6 sm:p-8">
      <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
        PREPPASS — INTERVIEW COMPLETE
      </div>
      <h1 className="mt-3 font-heading text-2xl text-stamp-navy">
        Session complete.
      </h1>
      <p className="mt-1 font-mono text-xs text-stamp-navy/60">
        {companyId ? `${companyId.toUpperCase()} · ` : ""}{role} · {fmtDate(startedAt)}
      </p>

      <div className="mt-8 flex flex-col items-center">
        <GaugeCircle
          value={overallReadinessScore ?? 0}
          max={10}
          size={172}
          caption="Overall Readiness"
        />
      </div>

      <div className="ticket-perf my-8" />

      <h2 className="font-heading text-sm uppercase tracking-wider text-stamp-navy/70">
        Per-question breakdown
      </h2>
      <div className="mt-4 space-y-4">
        {scored.map((q, i) => (
          <div
            key={i}
            className="rounded-lg border border-stamp-navy/12 bg-ticket/60 p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-stamp-navy/50">
              Q{i + 1} · {q.category}
            </p>
            <p className="mt-1 text-sm text-ink">{q.questionText}</p>
            <div className="mt-3 max-w-md">
              <ScoreBars score={q.score} />
            </div>
            {q.feedback && (
              <p className="mt-3 border-t border-dashed border-stamp-navy/15 pt-3 text-sm text-ink/70">
                {q.feedback}
              </p>
            )}
          </div>
        ))}
        {scored.length === 0 && (
          <p className="text-sm text-ink/60">No scored questions yet.</p>
        )}
      </div>

      <Link
        to="/dashboard"
        className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-stamp-navy px-6 py-3 font-heading font-semibold tracking-wider text-white hover:bg-stamp-navy/90 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 sm:w-auto"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
