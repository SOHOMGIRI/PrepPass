import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Activity, Cpu, ShieldCheck, Compass, Info } from "lucide-react";

/**
 * CompetencyRadarCanvas
 * An interactive, real-time 6-Axis Cognitive Competency Radar & Neural Topology graph.
 * Provides the signature visual centerpiece for PræpPass (equivalent to the campus transit map in ÆtherTransit).
 */
const AXES = [
  { id: "dist", label: "Distributed Systems", value: 92, benchmark: 85, metric: "PACELC / CRDTs", bloom: "Level 6: Synthesis" },
  { id: "conc", label: "Concurrency & Async", value: 88, benchmark: 80, metric: "Event Loop / Locks", bloom: "Level 5: Analysis" },
  { id: "dsa", label: "Algorithmic Rigor", value: 95, benchmark: 90, metric: "O(N log N) / DP", bloom: "Level 5: Analysis" },
  { id: "prosody", label: "Acoustic Speech Fluency", value: 96, benchmark: 75, metric: "142 WPM / 0.4% Fillers", bloom: "Cadence: Optimal" },
  { id: "ats", label: "ATS Semantic Match", value: 94, benchmark: 82, metric: "Cosine Sim: 0.94", bloom: "Google X-Y-Z" },
  { id: "behavioral", label: "Leadership & STAR", value: 89, benchmark: 78, metric: "Conflict & Trade-offs", bloom: "Level 4: Evaluation" },
];

export default function CompetencyRadarCanvas() {
  const [activeAxis, setActiveAxis] = useState(null);
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [pulse, setPulse] = useState(0);

  // Center & radius for radar
  const size = 380;
  const center = size / 2;
  const radius = 135;
  const totalAxes = AXES.length;

  // Pulse animation loop
  useEffect(() => {
    let animId;
    let t = 0;
    const loop = () => {
      t += 0.03;
      setPulse(Math.sin(t) * 2);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute (x, y) coordinates for an angle and radius ratio
  const getCoordinates = (index, valuePercent) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon points string
  const candidatePoints = AXES.map((axis, i) => {
    const pt = getCoordinates(i, axis.value);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  const benchmarkPoints = AXES.map((axis, i) => {
    const pt = getCoordinates(i, axis.benchmark);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  return (
    <div className="relative w-full max-w-[420px] rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-5 select-none overflow-hidden">
      {/* Canvas Header & Scale Status (Like ÆtherTransit Map Canvas) */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="font-mono text-[10px] font-bold text-slate-700 uppercase tracking-widest">
            COGNITIVE RADAR CANVAS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Scale 1:1
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Main SVG Radar Visualizer */}
      <div className="relative my-2 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-auto max-w-[340px] drop-shadow-sm"
        >
          <defs>
            <linearGradient id="candidateFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="candidateStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Radial Glow */}
          <circle cx={center} cy={center} r={radius} fill="url(#radarCenterGlow)" />

          {/* Concentric Grid Rings (20%, 40%, 60%, 80%, 100%) */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, idx) => (
            <polygon
              key={idx}
              points={Array.from({ length: totalAxes })
                .map((_, i) => {
                  const pt = getCoordinates(i, ratio * 100);
                  return `${pt.x},${pt.y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={idx === 4 ? "1.5" : "1"}
              strokeDasharray={idx < 4 ? "3 3" : undefined}
            />
          ))}

          {/* Axis Spokes */}
          {AXES.map((_, i) => {
            const edge = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={edge.x}
                y2={edge.y}
                stroke="#CBD5E1"
                strokeWidth="1"
              />
            );
          })}

          {/* Tier-1 / FAANG Benchmark Polygon (Dashed Gold Outline) */}
          {showBenchmark && (
            <polygon
              points={benchmarkPoints}
              fill="rgba(245, 158, 11, 0.08)"
              stroke="#F59E0B"
              strokeWidth="1.75"
              strokeDasharray="4 4"
            />
          )}

          {/* Candidate Dynamic Polygon */}
          <polygon
            points={candidatePoints}
            fill="url(#candidateFill)"
            stroke="url(#candidateStroke)"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />

          {/* Interactive Vertex Nodes */}
          {AXES.map((axis, i) => {
            const pt = getCoordinates(i, axis.value);
            const isHovered = activeAxis?.id === axis.id;

            return (
              <g
                key={axis.id}
                className="cursor-pointer"
                onMouseEnter={() => setActiveAxis(axis)}
                onMouseLeave={() => setActiveAxis(null)}
              >
                {/* Ambient pulse halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 10 + pulse : 7}
                  fill="#06B6D4"
                  fillOpacity="0.25"
                />
                {/* Solid vertex core */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 4}
                  fill={isHovered ? "#2563EB" : "#0284C7"}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Axis Inspection Card / Tooltip */}
      <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/90 min-h-[76px] flex flex-col justify-center">
        {activeAxis ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-xs text-slate-900">
                {activeAxis.label}
              </span>
              <span className="font-mono text-xs font-black text-blue-600">
                {activeAxis.value}% <span className="text-[10px] text-slate-400 font-normal">vs {activeAxis.benchmark}% Benchmark</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>{activeAxis.metric}</span>
              <span className="text-emerald-700 font-semibold">{activeAxis.bloom}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <div className="flex items-center gap-1.5">
              <Info size={14} className="text-blue-500" />
              <span>Hover over vertices to inspect candidate neural depth</span>
            </div>
            <span className="font-mono text-[10px] font-bold text-blue-600">6 Axes</span>
          </div>
        )}
      </div>

      {/* Benchmark Toggle Controls */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Candidate (Sohom Giri)</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-600">
            <span className="w-2.5 h-0.5 bg-amber-500 border-b border-dashed border-amber-600" />
            <span>Tier-1 Baseline</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBenchmark(!showBenchmark)}
          className="text-[10px] font-mono font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          {showBenchmark ? "Hide Baseline" : "Show Baseline"}
        </button>
      </div>
    </div>
  );
}
