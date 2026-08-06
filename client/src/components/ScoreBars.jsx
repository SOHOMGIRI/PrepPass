const DIMENSIONS = [
  { key: "clarity", label: "Clarity" },
  { key: "correctness", label: "Correctness" },
  { key: "completeness", label: "Completeness" },
  { key: "overall", label: "Overall" },
];

/** Horizontal score bars for a 0-10 score breakdown object. */
export default function ScoreBars({ score }) {
  if (!score || typeof score !== "object") return null;
  return (
    <div className="space-y-2.5">
      {DIMENSIONS.map(({ key, label }) => {
        const val = Number(score[key]) || 0;
        const width = Math.max(0, Math.min(100, (val / 10) * 100));
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-wider text-stamp-navy/60">
              {label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stamp-navy/10">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${width}%`, transition: "width 0.7s ease" }}
              />
            </div>
            <span className="w-7 shrink-0 text-right font-mono text-xs text-stamp-navy">
              {Math.round(val * 10) / 10}
            </span>
          </div>
        );
      })}
    </div>
  );
}
