import React, { useRef, useCallback, useState } from "react";
import { ShieldCheck, Award, CheckCircle2, Mic, Terminal, RotateCw, Activity, Cpu, Sparkles } from "lucide-react";
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
      glareNode.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(6,182,212,0.2) 0%, rgba(37,99,235,0.08) 40%, transparent 70%)`;
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
      {/* Luminous Ambient Glow */}
      <div
        className="absolute w-[380px] h-[540px] rounded-full pointer-events-none opacity-60 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(37,99,235,0.2) 40%, transparent 75%)",
        }}
      />

      {/* Main Card Container */}
      <div
        className="pointer-events-auto cursor-pointer relative w-[340px] sm:w-[420px] h-[560px] select-none"
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
            {/* ═══════════ FRONT FACE (Luminous High-Tech Pass) ═══════════ */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.1),0_0_0_1px_rgba(37,99,235,0.1)] overflow-hidden flex flex-col justify-between p-6 sm:p-7"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              {/* Glare effect */}
              <div ref={glareRef} className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 z-10" />

              {/* Decorative Corner Ornaments */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-blue-600/70" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-blue-600/70" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70" />

              {/* Pass Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      ACCREDITED CANDIDATE PASS
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    IRT THETA: +1.42
                  </span>
                </div>

                {/* Brand Logo in Pass */}
                <div className="pt-3 pb-2 flex items-center justify-between">
                  <PraepPassLogo size="sm" />
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-bold shadow-xs">
                    <Cpu size={12} className="text-cyan-400" />
                    <span>ML ENGINE 2.0</span>
                  </div>
                </div>

                {/* Candidate Reference Metadata */}
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Candidate Reference
                    </div>
                    <div className="font-sans font-bold text-sm text-slate-900">
                      SOHOM GIRI
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Target Role
                    </div>
                    <div className="font-sans font-bold text-sm text-blue-600">
                      Full Stack Lead
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section: Composite Readiness Gauge & Telemetry */}
              <div className="my-auto py-2">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-500" />
                      Composite Readiness
                    </span>
                    <span className="font-mono text-base font-black text-slate-900">
                      94.8 <span className="text-xs text-slate-400 font-normal">/ 100</span>
                    </span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 rounded-full"
                      style={{ width: "94.8%" }}
                    />
                  </div>

                  {/* Real-Time Acoustic Speech Telemetry HUD Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/60">
                    <div className="bg-white/80 p-1.5 rounded-lg border border-slate-100">
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Pacing</div>
                      <div className="font-mono text-xs font-bold text-slate-800">142 WPM</div>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded-lg border border-slate-100">
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Fluency</div>
                      <div className="font-mono text-xs font-bold text-emerald-600">97.4%</div>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded-lg border border-slate-100">
                      <div className="font-mono text-[9px] text-slate-400 uppercase">Fillers</div>
                      <div className="font-mono text-xs font-bold text-cyan-600">0.4%</div>
                    </div>
                  </div>
                </div>

                {/* Real-time Dynamic Waveform HUD */}
                <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-white font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <Mic size={12} className="text-cyan-400 animate-pulse" />
                    <span className="text-slate-300">Acoustic Prosody Feed</span>
                  </div>
                  {/* Mini Audio Visualizer Bars */}
                  <div className="flex items-center gap-1 h-3">
                    <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2"></span>
                    <span className="w-1 bg-cyan-300 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3"></span>
                    <span className="w-1 bg-blue-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-1.5"></span>
                    <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5"></span>
                  </div>
                </div>
              </div>

              {/* Pass Footer: Barcode & Security Hologram */}
              <div className="pt-2">
                <div className="flex items-center justify-between font-mono text-[9px] text-slate-400 pb-2">
                  <span>ID: PRÆP-2026-9948X</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck size={12} />
                    VERIFIED PASS
                  </span>
                </div>

                {/* Stylized Modern Barcode */}
                <div className="h-7 w-full flex items-end justify-between px-1 opacity-70">
                  {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 4, 2, 5, 3, 1, 4, 2, 3, 5, 1, 4, 2, 3, 4, 1, 5, 2, 3].map(
                    (val, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800 rounded-xs"
                        style={{
                          width: `${(val % 3) + 1.5}px`,
                          height: `${14 + val * 2.2}px`,
                        }}
                      />
                    )
                  )}
                </div>

                {/* Flip Card Hint */}
                <div className="mt-2 text-center flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-blue-600 transition-colors">
                  <RotateCw size={11} />
                  <span>Click to inspect neural audit criteria</span>
                </div>
              </div>
            </div>

            {/* ═══════════ BACK FACE (Assessment Rubric & Bloom Matrix) ═══════════ */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900 text-white border border-slate-700 shadow-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-cyan-400" />
                    <span className="font-mono text-[10px] tracking-wider text-cyan-400 font-bold">
                      NEURAL EVALUATION AUDIT
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">IRB-STANDARD</span>
                </div>

                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase">Bloom Cognitive Depth</div>
                    <div className="font-bold text-white mt-0.5">Level 6: Distributed System Synthesis</div>
                    <div className="text-[10px] text-emerald-400 mt-1">✓ PACELC Theorem &amp; CRDT Consensus</div>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase">Item Response Latent Ability (θ)</div>
                    <div className="font-bold text-white mt-0.5">θ = +1.42 (Top 4.2% Peer Percentile)</div>
                    <div className="text-[10px] text-blue-400 mt-1">✓ Bayesian Discrimination a = 1.34</div>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase">Acoustic Prosody Telemetry</div>
                    <div className="font-bold text-white mt-0.5">Fluency Index: 97.4 / 100</div>
                    <div className="text-[10px] text-cyan-400 mt-1">✓ Jitter: &lt; 0.8% • Pause Ratio: 0.12s</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-center font-mono text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                <RotateCw size={11} className="text-cyan-400" />
                <span>Click to return to Candidate Admission Pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
