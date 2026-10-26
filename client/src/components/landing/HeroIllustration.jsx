import React, { useState, useRef, useCallback } from "react";
import { ShieldCheck, Crosshair, Mic, Cpu, Sparkles, RotateCw, CheckCircle2, Award } from "lucide-react";
import PraepPassLogo from "../PraepPassLogo.jsx";
import CompetencyRadarCanvas from "./CompetencyRadarCanvas.jsx";

export default function HeroIllustration() {
  const [activeTab, setActiveTab] = useState("radar");
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ rx: rotateX, ry: rotateY });
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Warm Frosted Tab Switcher (No Dark Blue/Black) */}
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-amber-300/40 shadow-md mb-5 backdrop-blur-xl z-20"
        style={{
          background: "linear-gradient(135deg, rgba(255,250,240,0.92) 0%, rgba(252,242,225,0.88) 100%)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("radar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[11px] font-bold transition-all duration-200 ${
            activeTab === "radar"
              ? "bg-gradient-to-r from-amber-500/25 to-rose-400/20 text-amber-900 border border-amber-400/50 shadow-xs"
              : "text-amber-800/70 hover:text-amber-950 hover:bg-amber-100/50"
          }`}
        >
          <Crosshair size={13} className={activeTab === "radar" ? "text-amber-700" : "text-amber-600/60"} />
          <span>Hexagonal Radar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pass")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[11px] font-bold transition-all duration-200 ${
            activeTab === "pass"
              ? "bg-gradient-to-r from-amber-500/25 to-rose-400/20 text-amber-900 border border-amber-400/50 shadow-xs"
              : "text-amber-800/70 hover:text-amber-950 hover:bg-amber-100/50"
          }`}
        >
          <ShieldCheck size={13} className={activeTab === "pass" ? "text-amber-700" : "text-amber-600/60"} />
          <span>Candidate Pass</span>
        </button>
      </div>

      {/* Dynamic Viewport */}
      {activeTab === "radar" ? (
        <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-300">
          <CompetencyRadarCanvas />
        </div>
      ) : (
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-300"
          style={{ perspective: "1000px" }}
        >
          <div
            className="cursor-pointer relative w-[340px] sm:w-[410px] h-[550px] select-none transition-transform duration-100 ease-out"
            onClick={() => setIsFlipped((prev) => !prev)}
            style={{
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${isHovering ? 1.02 : 1})`,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="w-full h-full relative"
              style={{
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* FRONT — Warm Champagne Alabaster Pass (Zero Stark White) */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl border border-amber-300/40 shadow-[0_24px_60px_rgba(180,140,60,0.14)] overflow-hidden flex flex-col justify-between p-6 sm:p-7"
                style={{
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(145deg, rgba(255,251,244,0.96) 0%, rgba(253,246,233,0.92) 50%, rgba(248,238,218,0.96) 100%)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Decorative Corner Studs */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-500/70" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-rose-400/70" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-500/70" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-rose-400/70" />

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-mono text-[10px] font-bold tracking-widest text-amber-800/80 uppercase">
                        ACCREDITED CANDIDATE PASS
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300/60 shadow-2xs">
                      IRT θ +1.42
                    </span>
                  </div>

                  <div className="pt-3 pb-2 flex items-center justify-between">
                    <PraepPassLogo size="sm" />
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-900/90 text-white font-mono text-[10px] font-bold shadow-xs">
                      <Cpu size={12} className="text-amber-300" />
                      <span>ML 2.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-amber-200/40">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-amber-700/70 font-semibold">Candidate</div>
                      <div className="font-sans font-bold text-sm text-slate-900">SOHOM GIRI</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-amber-700/70 font-semibold">Target Role</div>
                      <div className="font-sans font-bold text-sm text-amber-900">Full Stack Lead</div>
                    </div>
                  </div>
                </div>

                <div className="my-auto py-2">
                  <div
                    className="p-4 rounded-2xl border border-amber-200/60 shadow-2xs"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,248,235,0.85) 0%, rgba(250,242,225,0.8) 100%)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-amber-900/80 font-bold flex items-center gap-1.5">
                        <Sparkles size={12} className="text-amber-600" />
                        Composite Readiness
                      </span>
                      <span className="font-mono text-base font-black text-slate-900">
                        94.8 <span className="text-xs text-amber-700/70 font-normal">/ 100</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-amber-200/60 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full"
                        style={{ width: "94.8%" }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-amber-200/50">
                      {[
                        { label: "Pacing", val: "142 WPM", color: "text-amber-900" },
                        { label: "Fluency", val: "97.4%", color: "text-emerald-700" },
                        { label: "Fillers", val: "0.4%", color: "text-rose-700" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="p-1.5 rounded-xl border border-amber-200/50"
                          style={{ background: "rgba(255,252,245,0.85)" }}
                        >
                          <div className="font-mono text-[9px] text-amber-700/70 uppercase">{m.label}</div>
                          <div className={`font-mono text-xs font-bold ${m.color}`}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl text-white font-mono text-[10px]"
                    style={{ background: "#2D241E" }}
                  >
                    <div className="flex items-center gap-2">
                      <Mic size={12} className="text-amber-400 animate-pulse" />
                      <span className="text-amber-100">Acoustic Prosody Feed</span>
                    </div>
                    <div className="flex items-center gap-0.5 h-3">
                      {[2, 3, 1.5, 2.5, 1, 3, 2].map((h, i) => (
                        <span
                          key={i}
                          className="w-[3px] bg-amber-400 rounded-full"
                          style={{ height: `${h * 4}px`, animation: `pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between font-mono text-[9px] text-amber-800/70 pb-2">
                    <span>ID: PRÆP-2026-9948X</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck size={12} />
                      VERIFIED PASS
                    </span>
                  </div>
                  <div className="h-6 w-full flex items-end justify-between px-1 opacity-60">
                    {[2,4,1,3,2,5,1,4,2,3,1,4,2,5,3,1,4,2,3,5,1,4,2,3,4,1,5,2,3].map((v, i) => (
                      <span
                        key={i}
                        className="bg-amber-900 rounded-xs"
                        style={{ width: `${(v % 3) + 1.5}px`, height: `${12 + v * 2}px` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-center text-[10px] font-mono text-amber-800/80 flex items-center justify-center gap-1.5 hover:text-amber-950 transition-colors">
                    <RotateCw size={11} className="text-amber-600" />
                    <span>Click pass to flip &amp; inspect audit criteria</span>
                  </div>
                </div>
              </div>

              {/* BACK — Warm Linen Verification Audit */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl border border-amber-300/40 shadow-[0_24px_60px_rgba(180,140,60,0.14)] p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(145deg, rgba(255,249,238,0.96) 0%, rgba(250,240,222,0.93) 100%)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-amber-600" />
                      <span className="font-mono text-[10px] tracking-wider text-slate-800 font-bold uppercase">
                        ACADEMIC VERIFICATION AUDIT
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/60">
                      CERTIFIED
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 font-sans text-xs">
                    {[
                      { title: "Bloom Cognitive Depth", detail: "Level 6: Distributed System Synthesis", check: "PACELC Theorem & CRDT Consensus Verified", color: "text-emerald-700" },
                      { title: "Item Response Ability (θ)", detail: "θ = +1.42 (Top 4.2% Peer Percentile)", check: "Bayesian Discrimination a = 1.34", color: "text-amber-800" },
                      { title: "Acoustic Prosody Telemetry", detail: "Fluency Score: 97.4 / 100", check: "Jitter < 0.8% · Pause Ratio 0.12s", color: "text-rose-700" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="p-3.5 rounded-2xl border border-amber-200/60 shadow-2xs"
                        style={{ background: "rgba(255,252,246,0.85)" }}
                      >
                        <div className="font-mono text-[10px] text-amber-700/70 uppercase tracking-wider font-semibold">{item.title}</div>
                        <div className="font-bold text-slate-900 mt-0.5">{item.detail}</div>
                        <div className={`font-mono text-[10px] ${item.color} mt-1 flex items-center gap-1`}>
                          <CheckCircle2 size={12} />
                          <span>{item.check}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200/50 text-center font-mono text-[10px] text-amber-800/80 flex items-center justify-center gap-1.5 hover:text-amber-950 transition-colors">
                  <RotateCw size={11} className="text-amber-600" />
                  <span>Click to return to candidate pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
