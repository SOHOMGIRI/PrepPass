import React, { useState, useEffect, useRef, useCallback } from "react";
import { Crosshair, TrendingUp } from "lucide-react";

/**
 * CompetencyRadarCanvas — Warm Frosted Glass Hexagonal Radar
 * Uses a warm champagne/bronze frosted glass container with a hexagonal shape,
 * animated orbit ring, and colorful pulsing nodes.
 */
const AXES = [
  { id: "dist", label: "Distributed Systems", short: "DIST SYS", value: 92, benchmark: 85, color: "#E879A0" },
  { id: "conc", label: "Concurrency & Async", short: "ASYNC", value: 88, benchmark: 80, color: "#A78BFA" },
  { id: "dsa", label: "Algorithmic Rigor", short: "DSA", value: 95, benchmark: 90, color: "#34D399" },
  { id: "prosody", label: "Speech Fluency", short: "PROSODY", value: 96, benchmark: 75, color: "#F59E0B" },
  { id: "ats", label: "ATS Semantic Match", short: "ATS", value: 94, benchmark: 82, color: "#60A5FA" },
  { id: "behavioral", label: "Leadership & STAR", short: "BEHAV", value: 89, benchmark: 78, color: "#FB923C" },
];

export default function CompetencyRadarCanvas() {
  const [activeAxis, setActiveAxis] = useState(null);
  const [orbitAngle, setOrbitAngle] = useState(0);

  const size = 320;
  const center = size / 2;
  const radius = 115;
  const totalAxes = AXES.length;

  const getCoords = useCallback((index, pct) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (pct / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }, [totalAxes, center, radius]);

  // Orbit animation
  useEffect(() => {
    let t = 0;
    let id;
    const tick = () => {
      t += 0.006;
      setOrbitAngle(t);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const orbitX = center + (radius + 18) * Math.cos(orbitAngle);
  const orbitY = center + (radius + 18) * Math.sin(orbitAngle);

  const candidatePoints = AXES.map((a, i) => {
    const pt = getCoords(i, a.value);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  const benchmarkPoints = AXES.map((a, i) => {
    const pt = getCoords(i, a.benchmark);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  return (
    <div className="relative w-full max-w-[420px]">
      {/* Warm Frosted Glass Container */}
      <div className="rounded-[28px] border border-amber-300/30 shadow-[0_24px_60px_rgba(180,140,60,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(255,248,235,0.92) 0%, rgba(253,240,213,0.88) 50%, rgba(245,230,200,0.9) 100%)", backdropFilter: "blur(16px)" }}>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-amber-200/40">
          <div className="flex items-center gap-2">
            <Crosshair size={14} className="text-amber-700" />
            <span className="font-mono text-[11px] font-bold text-amber-900 uppercase tracking-widest">
              Cognitive Topology
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] text-emerald-700 font-bold">LIVE</span>
          </div>
        </div>

        {/* Radar Viewport */}
        <div className="relative flex items-center justify-center p-3">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] h-auto">
            <defs>
              <linearGradient id="hexFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E879A0" stopOpacity="0.18" />
                <stop offset="33%" stopColor="#A78BFA" stopOpacity="0.15" />
                <stop offset="66%" stopColor="#34D399" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E879A0" />
                <stop offset="33%" stopColor="#A78BFA" />
                <stop offset="66%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Concentric Hexagonal Grid Rings */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, idx) => (
              <polygon
                key={idx}
                points={Array.from({ length: totalAxes })
                  .map((_, i) => { const pt = getCoords(i, ratio * 100); return `${pt.x},${pt.y}`; })
                  .join(" ")}
                fill="none"
                stroke={idx === 4 ? "rgba(180, 140, 60, 0.25)" : "rgba(180, 140, 60, 0.12)"}
                strokeWidth={idx === 4 ? "1.3" : "0.7"}
              />
            ))}

            {/* Axis Spokes */}
            {AXES.map((_, i) => {
              const edge = getCoords(i, 100);
              return <line key={i} x1={center} y1={center} x2={edge.x} y2={edge.y} stroke="rgba(180, 140, 60, 0.15)" strokeWidth="0.7" />;
            })}

            {/* Benchmark Hex */}
            <polygon points={benchmarkPoints} fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />

            {/* Candidate Hex */}
            <polygon points={candidatePoints} fill="url(#hexFill)" stroke="url(#hexStroke)" strokeWidth="2.2" strokeLinejoin="round" />

            {/* Orbiting Satellite Dot */}
            <circle cx={orbitX} cy={orbitY} r="3" fill="#A78BFA" opacity="0.7" filter="url(#softGlow)">
              <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={orbitX} cy={orbitY} r="1.5" fill="#A78BFA" />

            {/* Data Nodes */}
            {AXES.map((axis, i) => {
              const pt = getCoords(i, axis.value);
              const labelPt = getCoords(i, 115);
              const isHovered = activeAxis?.id === axis.id;
              return (
                <g key={axis.id} className="cursor-pointer"
                  onMouseEnter={() => setActiveAxis(axis)}
                  onMouseLeave={() => setActiveAxis(null)}>
                  {/* Pulse halo */}
                  <circle cx={pt.x} cy={pt.y} r={isHovered ? 14 : 9} fill={axis.color} fillOpacity={isHovered ? 0.3 : 0.12} className="transition-all duration-300" />
                  {/* Core */}
                  <circle cx={pt.x} cy={pt.y} r={isHovered ? 5 : 3.5} fill={axis.color} stroke="rgba(255,248,235,0.9)" strokeWidth="2" className="transition-all duration-300" />
                  {/* Label */}
                  <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle" className="font-mono"
                    style={{ fontSize: "8px", fill: isHovered ? axis.color : "rgba(120, 90, 40, 0.6)", fontWeight: isHovered ? 700 : 500, letterSpacing: "0.08em", transition: "all 0.2s" }}>
                    {axis.short}
                  </text>
                </g>
              );
            })}

            {/* Center dot */}
            <circle cx={center} cy={center} r="2.5" fill="#D97706" opacity="0.5" />
            <circle cx={center} cy={center} r="1.2" fill="#D97706" />
          </svg>
        </div>

        {/* Bottom Telemetry */}
        <div className="px-5 py-3 border-t border-amber-200/40">
          {activeAxis ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeAxis.color }} />
                <span className="font-mono text-xs font-bold text-amber-900">{activeAxis.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-amber-800">
                  <span className="font-black">{activeAxis.value}%</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-700 border border-emerald-200/60">
                  +{activeAxis.value - activeAxis.benchmark}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-700/70">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={12} className="text-amber-600" />
                Hover to inspect axes
              </span>
              <span>6 Axes • θ +1.42</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
