import React from "react";

/**
 * PræpPass Brand Logo Component
 * A modern, iconic Neural-Crest & Academic Pass Ligature emblem.
 * Features an energized 3D gradient contour transitioning from Electric Sapphire Blue (#2563EB)
 * through Radiant Indigo (#4F46E5) to Vivid Cyan (#06B6D4), crowned with an Aurum Gold (#F59E0B) beacon.
 */
export default function PraepPassLogo({
  className = "h-9 w-auto",
  showWordmark = true,
  size = "md", // "sm" | "md" | "lg"
  textColor = "text-slate-900",
}) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon Crest */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size] || iconSizes.md}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 opacity-25 blur-md" />
        
        {/* SVG Crest */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="wireframeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Isometric Rounded Hexagonal Shield */}
          <polygon
            points="50,6 88,27 88,73 50,94 12,73 12,27"
            fill="url(#shieldGrad)"
            stroke="#1E40AF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Internal Geometric Facet & Glass Reflection */}
          <polygon
            points="50,12 82,30 82,70 50,88"
            fill="#FFFFFF"
            fillOpacity="0.08"
          />

          {/* Inner Golden Neural Nexus Ring */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            strokeDasharray="4 3"
            fill="none"
          />

          {/* Stylized Interlocking Ligature 'P' and 'Æ' */}
          <path
            d="M36 72V30C36 30 46 26 56 26C64 26 69 31 69 37C69 44 63 48 54 48H45V72H36Z"
            fill="#FFFFFF"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
          />
          {/* Inner Loop Cutout for P */}
          <path
            d="M45 35V42H54C57 42 60 40 60 38C60 36 57 35 54 35H45Z"
            fill="#1E3A8A"
          />

          {/* Ligature Crossbar connecting Æ into P */}
          <path
            d="M50 48L68 72H60L51 58L42 72H34"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Neural Crown Node */}
          <circle cx="50" cy="14" r="3.5" fill="url(#goldGrad)" filter="url(#glow)" />
          <circle cx="82" cy="30" r="3" fill="#67E8F9" />
          <circle cx="18" cy="70" r="3" fill="#93C5FD" />
        </svg>
      </div>

      {/* Brand Typography Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-serif font-black ${textSizes[size] || textSizes.md} ${textColor}`}
              style={{ letterSpacing: "-0.03em" }}
            >
              Pr
            </span>
            <span
              className={`font-serif font-black ${textSizes[size] || textSizes.md} bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent`}
              style={{ letterSpacing: "-0.04em" }}
            >
              æ
            </span>
            <span
              className={`font-serif font-black ${textSizes[size] || textSizes.md} ${textColor}`}
              style={{ letterSpacing: "-0.03em" }}
            >
              pPass
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-slate-500 font-semibold mt-0.5">
            Academic Intelligence 2.0
          </span>
        </div>
      )}
    </div>
  );
}
