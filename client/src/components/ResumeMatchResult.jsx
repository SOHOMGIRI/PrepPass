import { Link } from "react-router-dom";
import GaugeCircle from "./GaugeCircle.jsx";

const TS =
  "ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary";

export default function ResumeMatchResult({ result, onReset }) {
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
          <div className={TS}>PREPPASS — MATCH RESULT</div>
          <div className="mt-6 flex flex-col items-center">
            <GaugeCircle
              value={result.matchScorePercent ?? 0}
              max={100}
              size={172}
              caption="Match Score"
            />
          </div>
          <div className="ticket-perf my-8" />

          <h2 className="font-heading text-sm uppercase tracking-wider text-text-primary/70">
            Matched skills
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.matchedSkills?.length ? (
              result.matchedSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full bg-green-600/15 px-3 py-1 text-xs font-medium text-green-800"
                >
                  ✓ {s}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-secondary/60">No matched skills reported.</p>
            )}
          </div>

          <h2 className="mt-6 font-heading text-sm uppercase tracking-wider text-text-primary/70">
            Missing skills
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.missingSkills?.length ? (
              result.missingSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full bg-gold px-3 py-1 text-xs font-medium text-[#0B0A14]"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-sm text-text-secondary/60">
                No missing skills found — great fit!
              </p>
            )}
          </div>

          <h2 className="mt-6 font-heading text-sm uppercase tracking-wider text-text-primary/70">
            Recommendations
          </h2>
          <ol className="mt-3 space-y-3">
            {result.recommendations?.length ? (
              result.recommendations.map((r, i) => (
                <li
                  key={i}
                  className="ticket-card flex gap-3 rounded-lg p-3 text-sm text-text-secondary/80"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold font-mono text-xs text-[#0B0A14]">
                    {i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-text-secondary/60">No recommendations.</li>
            )}
          </ol>

          <button
            type="button"
            onClick={onReset}
            className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-gold px-6 py-3 font-heading font-semibold tracking-wider text-[#0B0A14] hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 sm:w-auto"
          >
            New Match
          </button>
        </div>
      </div>
    </div>
  );
}

