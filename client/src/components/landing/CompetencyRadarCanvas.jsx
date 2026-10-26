import React, { useState, useEffect, useRef, useCallback } from "react";
import { Crosshair, Zap, TrendingUp } from "lucide-react";

/**
 * CompetencyRadarCanvas — Dark Glassmorphic Neural Topology Radar
 * A premium "mission control" style dark-glass radar with animated gradient
 * strokes, pulsing scan-line, glowing data vertices, and real-time hover telemetry.
 */
const AXES = [
  { id: "dist", label: "Distributed Systems", short: "DIST SYS", value: 92, benchmark: 85, color: "#3B82F6" },
  { id: "conc", label: "Concurrency & Async", short: "ASYNC", value: 88, benchmark: 80, color: "#8B5CF6" },
  { id: "dsa", label: "Algorithmic Rigor", short: "DSA", value: 95, benchmark: 90, color: "#06B6D4" },
  { id: "prosody", label: "Speech Fluency", short: "PROSODY", value: 96, benchmark: 75, color: "#10B981" },
  { id: "ats", label: "ATS Semantic Match", short: "ATS", value: 94, benchmark: 82, color: "#F59E0B" },
  { id: "behavioral", label: "Leadership & STAR", short: "BEHAV", value: 89, benchmark: 78, color: "#EC4899" },
];

export default function CompetencyRadarCanvas() {
  const canvasRef = useRef(null);
  const [activeAxis, setActiveAxis] = useState(null);
  const [scanAngle, setScanAngle] = useState(0);
  const animRef = useRef(null);
  const hoverRef = useRef(null);

  const size = 320;
  const center = size / 2;
  const radius = 120;
  const totalAxes = AXES.length;

  const getCoords = useCallback((index, pct) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (pct / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }, [totalAxes, center, radius]);

  // Animate radar sweep
  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.008;
      setScanAngle(t % (Math.PI * 2));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Canvas rendering for sweep line + ambient particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw sweep cone
    const sweepAngle = scanAngle - Math.PI / 2;
    const gradient = ctx.createConicGradient(sweepAngle, center, center);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.25)");
    gradient.addColorStop(0.08, "rgba(6, 182, 212, 0.12)");
    gradient.addColorStop(0.15, "rgba(6, 182, 212, 0)");
    gradient.addColorStop(1, "rgba(6, 182, 212, 0)");

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius + 10, sweepAngle, sweepAngle + 0.6);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Sweep line
    const lx = center + (radius + 8) * Math.cos(sweepAngle);
    const ly = center + (radius + 8) * Math.sin(sweepAngle);
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(lx, ly);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ambient floating particles
    for (let i = 0; i < 12; i++) {
      const px = center + Math.cos(scanAngle * 1.3 + i * 0.55) * (30 + i * 9);
      const py = center + Math.sin(scanAngle * 0.9 + i * 0.7) * (25 + i * 8);
      const alpha = 0.15 + Math.sin(scanAngle + i) * 0.1;
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
      ctx.fill();
    }
  }, [scanAngle, center, radius, size]);

  const candidatePoints = AXES.map((_, i) => {
    const pt = getCoords(i, AXES[i].value);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  const benchmarkPoints = AXES.map((_, i) => {
    const pt = getCoords(i, AXES[i].benchmark);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  return (
    <div className="relative w-full max-w-[420px]">
      {/* Dark Glass Container */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-950 border border-slate-700/50 shadow-[0_30px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-700/40">
          <div className="flex items-center gap-2">
            <Crosshair size={14} className="text-cyan-400" />
            <span className="font-mono text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              Neural Topology Radar
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-mono text-[10px] text-cyan-400 font-semibold">SCANNING</span>
          </div>
        </div>

        {/* Radar Viewport */}
        <div className="relative flex items-center justify-center p-4">
          {/* Canvas layer for sweep animation */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ width: size, height: size, margin: "auto" }}
          />

          {/* SVG layer for geometry */}
          <svg viewBox={`0 0 ${size} ${size}`} className="relative w-full max-w-[320px] h-auto z-10">
            <defs>
              <linearGradient id="radarCandidateFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="radarCandidateStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <filter id="glowNode">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Concentric Grid Rings */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((ratio, idx) => (
              <polygon
                key={idx}
                points={Array.from({ length: totalAxes })
                  .map((_, i) => {
                    const pt = getCoords(i, ratio * 100);
                    return `${pt.x},${pt.y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke={idx === 4 ? "rgba(100, 116, 139, 0.35)" : "rgba(100, 116, 139, 0.15)"}
                strokeWidth={idx === 4 ? "1.2" : "0.8"}
              />
            ))}

            {/* Axis Spokes */}
            {AXES.map((_, i) => {
              const edge = getCoords(i, 100);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={edge.x}
                  y2={edge.y}
                  stroke="rgba(100, 116, 139, 0.2)"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Benchmark Polygon */}
            <polygon
              points={benchmarkPoints}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeDasharray="3 4"
              opacity="0.5"
            />

            {/* Candidate Polygon */}
            <polygon
              points={candidatePoints}
              fill="url(#radarCandidateFill)"
              stroke="url(#radarCandidateStroke)"
              strokeWidth="2"
            />

            {/* Data Vertex Nodes */}
            {AXES.map((axis, i) => {
              const pt = getCoords(i, axis.value);
              const labelPt = getCoords(i, 112);
              const isHovered = activeAxis?.id === axis.id;

              return (
                <g
                  key={axis.id}
                  className="cursor-pointer"
                  onMouseEnter={() => { setActiveAxis(axis); hoverRef.current = axis.id; }}
                  onMouseLeave={() => { setActiveAxis(null); hoverRef.current = null; }}
                >
                  {/* Glow halo */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 12 : 8}
                    fill={axis.color}
                    fillOpacity={isHovered ? 0.3 : 0.15}
                    className="transition-all duration-200"
                  />
                  {/* Core dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4.5 : 3.5}
                    fill={axis.color}
                    stroke="#0F172A"
                    strokeWidth="2"
                    filter={isHovered ? "url(#glowNode)" : undefined}
                    className="transition-all duration-200"
                  />
                  {/* Axis Short Label */}
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono"
                    style={{
                      fontSize: "8px",
                      fill: isHovered ? axis.color : "rgba(148, 163, 184, 0.7)",
                      fontWeight: isHovered ? 700 : 500,
                      letterSpacing: "0.08em",
                      transition: "fill 0.2s",
                    }}
                  >
                    {axis.short}
                  </text>
                </g>
              );
            })}

            {/* Center Reticle */}
            <circle cx={center} cy={center} r="3" fill="#06B6D4" opacity="0.6" />
            <circle cx={center} cy={center} r="1.5" fill="#06B6D4" />
          </svg>
        </div>

        {/* Bottom Telemetry Panel */}
        <div className="px-5 py-3 border-t border-slate-700/40">
          {activeAxis ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeAxis.color }} />
                <span className="font-mono text-xs font-bold text-white">{activeAxis.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400">
                  Score: <span className="text-white font-bold">{activeAxis.value}%</span>
                </span>
                <span className="font-mono text-xs text-slate-500">
                  Baseline: <span className="text-amber-400 font-semibold">{activeAxis.benchmark}%</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  +{activeAxis.value - activeAxis.benchmark}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={12} className="text-cyan-500" />
                Hover vertices to inspect cognitive depth
              </span>
              <span className="text-slate-600">6 Axes • IRT θ +1.42</span>
            </div>
          )}
        </div>

        {/* Legend Strip */}
        <div className="px-5 py-2 border-t border-slate-800/60 flex items-center gap-4 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full" />
            Candidate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] border-b border-dashed border-amber-400" />
            FAANG Baseline
          </span>
        </div>
      </div>
    </div>
  );
}
