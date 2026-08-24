import { useEffect, useState } from "react";

const DURATION = 120; // seconds per question

/** Depleting circular countdown ring. Remount (via key) to reset. */
export default function QuestionTimer() {
  const [left, setLeft] = useState(DURATION);

  useEffect(() => {
    const id = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const size = 84;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = left / DURATION;
  const dash = circ * (1 - pct);
  const expiring = left <= 20;

  const mmss = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(
    left % 60
  ).padStart(2, "0")}`;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(26,34,126,0.10)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={expiring ? "#7a0c0c" : "#d4a72c"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.4s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-mono text-sm ${
            expiring ? "text-stamp-maroon" : "text-text-primary"
          }`}
        >
          {mmss}
        </span>
        <span className="font-mono text-[9px] uppercase text-text-primary/50">
          time
        </span>
      </div>
    </div>
  );
}
