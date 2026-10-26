import React, { useRef, useCallback, useState } from "react";
import { ShieldCheck, Award, CheckCircle2, Mic, Terminal, ChevronRight, RotateCw } from "lucide-react";
import PraepPassLogo from "../PraepPassLogo.jsx";

export default function HeroIllustration() {
  const tiltRef = useRef(null);
  const glareRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const tiltNode = tiltRef.current;
    const glareNode = glareRef.current;
    if (!tiltNode) return;

    const rect = tiltNode.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    tiltNode.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glareNode) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glareNode.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(197,160,89,0.18) 0%, transparent 60%)`;
      glareNode.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const tiltNode = tiltRef.current;
    const glareNode = glareRef.current;
    if (tiltNode) {
      tiltNode.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      tiltNode.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }
    if (glareNode) glareNode.style.opacity = "0";
  }, []);

  const handleMouseEnter = useCallback(() => {
    const tiltNode = tiltRef.current;
    if (tiltNode) tiltNode.style.transition = "transform 0.1s ease-out";
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Subtle Aura Halo */}
      <div
        className="absolute w-[360px] h-[520px] rounded-full pointer-events-none opacity-50 blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(197,160,89,0.2) 0%, rgba(10,17,40,0.04) 60%, transparent 80%)",
        }}
      />

      {/* Main Card Container */}
      <div
        className="pointer-events-auto cursor-pointer relative w-[340px] sm:w-[410px] h-[540px] select-none"
        onClick={() => setIsFlipped((prev) => !prev)}
      >
        <div
          ref={tiltRef}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="w-full h-full relative"
            style={{
              transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* ═══════════ FRONT FACE (Imperial Dossier Pass) ═══════════ */}
            <div
              className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-[#C5A059]/40 shadow-[0_20px_50px_rgba(10,17,40,0.08),0_0_0_1px_rgba(10,17,40,0.05)] overflow-hidden flex flex-col justify-between p-6 sm:p-7"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              {/* Glare effect */}
              <div ref={glareRef} className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 z-10" />

              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C5A059]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]" />

              {/* Pass Header */}
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#0A1128]/8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 text-[10px] font-mono uppercase tracking-wider font-bold text-navy-900 mb-1.5">
                      <ShieldCheck size={12} className="text-[#C5A059]" />
                      <span>Accredited Assessment Pass</span>
                    </div>
                    <h3 className="font-heading text-xl font-extrabold text-navy-900 tracking-tight">
                      Pr<span className="text-[#C5A059] font-serif">æ</span>pPass
                    </h3>
                  </div>

                  {/* Stamp Badge */}
                  <div className="w-12 h-12 rounded-xl bg-[#0A1128] border border-[#C5A059] flex items-center justify-center text-[#FDFBF7] shadow-sm">
                    <span className="font-mono text-xs font-bold text-[#C5A059]">PÆ</span>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Candidate Ref</span>
                    <span className="font-heading font-bold text-sm text-navy-900">SOHOM GIRI</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Target Role</span>
                    <span className="font-heading font-bold text-sm text-navy-900">Full Stack Lead</span>
                  </div>
                </div>

                {/* Score Dial & Metrics */}
                <div className="mt-5 p-4 rounded-xl bg-[#FDFBF7] border border-[#0A1128]/6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-600">Composite Readiness</span>
                    <span className="font-mono text-base font-bold text-[#9E7B35]">94 / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#0A1128] rounded-full" style={{ width: "94%" }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#0A1128]/5 text-center">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">Pacing</span>
                      <span className="text-xs font-bold font-mono text-navy-900">142 WPM</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">Clarity</span>
                      <span className="text-xs font-bold font-mono text-emerald-700">96.8%</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">Fillers</span>
                      <span className="text-xs font-bold font-mono text-navy-900">0.8%</span>
                    </div>
                  </div>
                </div>

                {/* Verified Skills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["System Architecture", "React 19", "Node.js Concurrency", "Distributed Cache"].map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-white border border-[#0A1128]/10 text-slate-700 shadow-2xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perforation Divider & Footer Barcode */}
              <div className="pt-4 border-t-2 border-dashed border-[#0A1128]/15">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                  <span>REF: PRÆ-2026-9948X</span>
                  <span className="text-[#059669] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> VERIFIED PASS
                  </span>
                </div>
                {/* SVG Mock Barcode */}
                <div className="h-8 w-full flex items-center justify-between px-1 opacity-70">
                  {[2, 4, 1, 3, 5, 2, 6, 1, 4, 2, 5, 1, 3, 6, 2, 4, 1, 3, 5, 2, 4, 1, 6, 3, 2, 4].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-navy-900 h-full rounded-xs"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <div className="text-center mt-2">
                  <span className="text-[9px] font-mono text-slate-400 flex items-center justify-center gap-1 hover:text-[#0A1128]">
                    <RotateCw size={10} /> Click to inspect panel audit details
                  </span>
                </div>
              </div>
            </div>

            {/* ═══════════ BACK FACE (Panel Rubric Breakdown) ═══════════ */}
            <div
              className="absolute inset-0 w-full h-full rounded-2xl bg-[#0A1128] border border-[#C5A059] shadow-[0_20px_50px_rgba(10,17,40,0.15)] overflow-hidden flex flex-col justify-between p-6 sm:p-7 text-[#FDFBF7]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#C5A059] font-bold">
                    Board Evaluation Rubric
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">SESSION AUDIT #883</span>
                </div>

                <div className="mt-4 space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Algorithmic Tradeoffs</span>
                      <span className="text-[#C5A059] font-bold">96%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C5A059] rounded-full" style={{ width: "96%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">STAR Behavioral Cohesion</span>
                      <span className="text-[#C5A059] font-bold">91%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C5A059] rounded-full" style={{ width: "91%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">Speech Prosody & Rhythm</span>
                      <span className="text-[#C5A059] font-bold">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C5A059] rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">ATS Resume Semantic Alignment</span>
                      <span className="text-[#C5A059] font-bold">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C5A059] rounded-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-lg bg-white/5 border border-white/10 text-left">
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider block font-bold">
                    Executive Examiner Feedback
                  </span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    "Candidate displayed exceptional systems clarity under latency constraints. Zero filler pauses during distributed state explanation."
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>SEAL: IMPERIAL PRÆP</span>
                <span className="flex items-center gap-1 text-[#C5A059]">
                  <RotateCw size={10} /> Flip to Admission Pass
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
