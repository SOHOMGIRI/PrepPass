import React from "react";
import { Link } from "react-router-dom";

export default function PraepPassLogo({
  size = "md",
  showTagline = false,
  inverted = false,
  to = "/",
  className = "",
}) {
  // Size metrics
  const dimensions = {
    sm: { height: 28, text: "text-lg", tag: "text-[9px]" },
    md: { height: 38, text: "text-2xl", tag: "text-[10px]" },
    lg: { height: 48, text: "text-3xl", tag: "text-[11px]" },
    xl: { height: 60, text: "text-4xl", tag: "text-[12px]" },
  }[size] || { height: 38, text: "text-2xl", tag: "text-[10px]" };

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Imperial Seal Monogram Crest */}
      <svg
        height={dimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:rotate-3"
      >
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          fill={inverted ? "#FDFBF7" : "#0A1128"}
          stroke="#C5A059"
          strokeWidth="3.5"
        />
        {/* Subtle geometric inner quad */}
        <polygon
          points="50,14 84,50 50,86 16,50"
          fill="none"
          stroke="#C5A059"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeOpacity="0.4"
        />
        {/* Monogram P stem */}
        <path
          d="M34 76V30H50C57 30 62 33.5 62 40C62 46.5 57 50 50 50H34"
          stroke={inverted ? "#0A1128" : "#FDFBF7"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Ligature æ loop & bar */}
        <path
          d="M52 50H68C74 50 78 54 78 60C78 66 74 70 68 70H54C48 70 46 66 46 60C46 54 50 50 56 50"
          stroke="#C5A059"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M50 60H77"
          stroke="#C5A059"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Center aurum stud */}
        <circle cx="50" cy="50" r="3" fill="#C5A059" />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-heading font-extrabold tracking-tight ${dimensions.text} ${
            inverted ? "text-white" : "text-navy-900"
          }`}
        >
          Pr<span className="text-[#C5A059] font-serif font-black">æ</span>pPass
        </span>
        {showTagline && (
          <span
            className={`font-mono uppercase tracking-[0.22em] font-semibold mt-1 ${dimensions.tag} ${
              inverted ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Candidate Assessment Standard
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
