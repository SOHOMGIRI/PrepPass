import { useEffect, useState } from "react";

/**
 * Animated SVG circular gauge. Used for readiness scores (max 10) and
 * resume match percentages (max 100).
 */
export default function GaugeCircle({
  value = 0,
  max = 100,
  size = 168,
  stroke = 13,
  caption = "",
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  const target = circ - (pct / 100) * circ;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOffset(target), 80);
    return () => clearTimeout(t);
  }, [target]);

  const isPercent = max === 100;
  const main = isPercent
    ? `${Math.round(value)}%`
    : `${Math.round(value * 10) / 10}`;

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="block -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(212,167,44,0.18)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#d4a72c"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-heading text-stamp-navy"
            style={{ fontSize: size / 4.6 }}
          >
            {main}
          </span>
          {!isPercent && (
            <span className="font-mono text-[10px] text-stamp-navy/50">
              / {max}
            </span>
          )}
        </div>
      </div>
      {caption && (
        <div className="ticket-stamp mt-3 inline-flex items-center rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
          {caption}
        </div>
      )}
    </div>
  );
}
