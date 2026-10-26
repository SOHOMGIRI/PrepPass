import React, { useState } from "react";
import { ShieldCheck, Compass, Mic, Cpu, Sparkles, RotateCw, CheckCircle2, Award } from "lucide-react";
import PraepPassLogo from "../PraepPassLogo.jsx";
import CompetencyRadarCanvas from "./CompetencyRadarCanvas.jsx";

export default function HeroIllustration() {
  const [activeTab, setActiveTab] = useState("radar");
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-700/50 shadow-lg mb-5 backdrop-blur-md z-20">
        <button
          type="button"
          onClick={() => setActiveTab("radar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[11px] font-bold transition-all ${
            activeTab === "radar"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Crosshair size={13} />
          <span>Neural Radar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pass")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[11px] font-bold transition-all ${
            activeTab === "pass"
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck size={13} />
          <span>Candidate Pass</span>
        </button>
      </div>

      {/* Active View */}
      {activeTab === "radar" ? (
        <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-300">
          <CompetencyRadarCanvas />
        </div>
      ) : (
        <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-300">
          <div
            className="cursor-pointer relative w-[340px] sm:w-[410px] h-[540px] select-none"
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            <div
              className="w-full h-full relative"
              style={{
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* FRONT */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col justify-between p-6 sm:p-7"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-violet-500/60" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-500/60" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-violet-500/60" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-500/60" />

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase">Accredited Pass</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-violet-50 text-violet-700 border border-violet-200">θ +1.42</span>
                  </div>

                  <div className="pt-3 pb-2 flex items-center justify-between">
                    <PraepPassLogo size="sm" />
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-bold shadow-xs">
                      <Cpu size={12} className="text-cyan-400" />
                      <span>ML 2.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Candidate</div>
                      <div className="font-sans font-bold text-sm text-slate-900">SOHOM GIRI</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Target Role</div>
                      <div className="font-sans font-bold text-sm text-violet-600">Full Stack Lead</div>
                    </div>
                  </div>
                </div>

                <div className="my-auto py-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-violet-50/30 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                        <Sparkles size={12} className="text-amber-500" />
                        Composite Readiness
                      </span>
                      <span className="font-mono text-base font-black text-slate-900">94.8 <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400 rounded-full" style={{ width: "94.8%" }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/60">
                      {[
                        { label: "Pacing", val: "142 WPM", color: "text-slate-800" },
                        { label: "Fluency", val: "97.4%", color: "text-emerald-600" },
                        { label: "Fillers", val: "0.4%", color: "text-violet-600" },
                      ].map((m) => (
                        <div key={m.label} className="bg-white/80 p-1.5 rounded-lg border border-slate-100">
                          <div className="font-mono text-[9px] text-slate-400 uppercase">{m.label}</div>
                          <div className={`font-mono text-xs font-bold ${m.color}`}>{m.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-white font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <Mic size={12} className="text-cyan-400 animate-pulse" />
                      <span className="text-slate-300">Acoustic Feed</span>
                    </div>
                    <div className="flex items-center gap-0.5 h-3">
                      {[2, 3, 1.5, 2.5, 1, 3, 2].map((h, i) => (
                        <span
                          key={i}
                          className="w-[3px] bg-cyan-400 rounded-full"
                          style={{ height: `${h * 4}px`, animation: `pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-400 pb-2">
                    <span>PRÆP-2026-9948X</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><ShieldCheck size={12} />VERIFIED</span>
                  </div>
                  <div className="h-6 w-full flex items-end justify-between px-1 opacity-60">
                    {[2,4,1,3,2,5,1,4,2,3,1,4,2,5,3,1,4,2,3,5,1,4,2,3,4,1,5,2,3].map((v, i) => (
                      <span key={i} className="bg-slate-700 rounded-xs" style={{ width: `${(v%3)+1.5}px`, height: `${12+v*2}px` }} />
                    ))}
                  </div>
                  <div className="mt-2 text-center text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5"><RotateCw size={11} /><span>Click to flip</span></div>
                </div>
              </div>

              {/* BACK — Light Luxury Audit */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl bg-[#FAF8F4] border border-amber-200/60 shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200/40">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-amber-600" />
                      <span className="font-mono text-[10px] tracking-wider text-slate-800 font-bold uppercase">Verification Audit</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">CERTIFIED</span>
                  </div>

                  <div className="mt-4 space-y-3 font-sans text-xs">
                    {[
                      { title: "Bloom Cognitive Depth", detail: "Level 6: Distributed System Synthesis", check: "PACELC Theorem & CRDT Consensus", color: "text-emerald-700", icon: "emerald" },
                      { title: "Item Response Ability (θ)", detail: "θ = +1.42 (Top 4.2% Peer Percentile)", check: "Bayesian Discrimination a = 1.34", color: "text-blue-700", icon: "blue" },
                      { title: "Acoustic Prosody Telemetry", detail: "Fluency Score: 97.4 / 100", check: "Jitter < 0.8% · Pause Ratio 0.12s", color: "text-violet-700", icon: "violet" },
                    ].map((item) => (
                      <div key={item.title} className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs">
                        <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{item.title}</div>
                        <div className="font-bold text-slate-900 mt-0.5">{item.detail}</div>
                        <div className={`font-mono text-[10px] ${item.color} mt-1 flex items-center gap-1`}>
                          <CheckCircle2 size={12} />
                          <span>{item.check}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200/40 text-center font-mono text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                  <RotateCw size={11} className="text-amber-600" />
                  <span>Click to return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Crosshair(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  );
}
