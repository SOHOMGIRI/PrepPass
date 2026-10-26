import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpotlightCard from "./SpotlightCard.jsx";
import { Mic, FileCheck, FileText, Clock, Brain, BarChart3, Building2, Users, Layers, Sparkles, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { stamp: "ML ENGINE", title: "AI Adaptive Interviews & Prosody HUD", desc: "IRT dynamic difficulty + real-time acoustic speech telemetry (decibels, WPM, fillers).", icon: Mic, className: "md:col-span-2 md:row-span-2", highlight: true, gradient: "from-rose-400 to-violet-500" },
  { stamp: "ATS AUDIT", title: "Resume ATS Match", desc: "Cosine similarity scoring with keyword gap detection.", icon: FileCheck, gradient: "from-blue-400 to-cyan-500" },
  { stamp: "OPTIMIZER", title: "AI Resume Architect", desc: "One-click Google X-Y-Z bullet optimization.", icon: FileText, gradient: "from-amber-400 to-orange-500" },
  { stamp: "PROCTORED", title: "Full-Screen Test Mode", desc: "Timed MCQ with focus violation tracking and integrity scoring.", icon: Clock, className: "md:col-span-2", gradient: "from-emerald-400 to-teal-500" },
  { stamp: "DRILLS", title: "Aptitude Practice", desc: "Quantitative and algorithmic problem sets.", icon: Brain, gradient: "from-violet-400 to-indigo-500" },
  { stamp: "TELEMETRY", title: "Readiness Analytics", desc: "Percentile rankings and historical growth curves.", icon: BarChart3, className: "md:col-span-2", gradient: "from-pink-400 to-rose-500" },
  { stamp: "ENTERPRISE", title: "Company Tracks", desc: "FAANG and enterprise interview patterns.", icon: Building2, gradient: "from-sky-400 to-blue-500" },
  { stamp: "DEBATE", title: "GD Arena", desc: "AI counter-arguments and synthesis scoring.", icon: Users, gradient: "from-orange-400 to-amber-500" },
  { stamp: "REVISION", title: "Revision Deck", desc: "Auto-generated flashcards from weak areas.", icon: Layers, gradient: "from-teal-400 to-emerald-500" },
];

export default function AdmitCard() {
  const gridRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !gridRef.current) return;

    gsap.fromTo(gridRef.current.children, { opacity: 0, y: 35 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out",
      scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <section id="features" className="py-24 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold mb-4 shadow-xs border border-rose-200/50"
            style={{ background: "rgba(232,121,160,0.1)", color: "#BE185D" }}>
            <Zap size={12} />
            INTELLIGENCE SUITE
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Complete. Certified. Rigorous.
          </h2>
          <p className="mt-4 text-slate-600 text-base max-w-2xl mx-auto">
            From acoustic prosody to ATS compliance — an industrial assessment suite.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <SpotlightCard key={f.title} className={`p-7 sm:p-8 flex flex-col justify-between group ${f.className || ""}`}>
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-3 transition-all duration-300`}>
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border border-amber-200/50"
                      style={{ background: "rgba(245,158,11,0.08)", color: "#92400E" }}>
                      {f.stamp}
                    </span>
                  </div>
                  <h3 className="font-sans text-xl font-bold text-slate-900 mb-2.5 group-hover:text-violet-700 transition-colors duration-200">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
                {f.highlight && (
                  <div className="mt-6 pt-5 border-t border-amber-200/30 flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold">
                    <Sparkles size={14} className="text-amber-500" /> Live Web Audio Engine Active
                  </div>
                )}
              </SpotlightCard>
            );
          })}
        </div>

        {/* Marquee */}
        <div className="mt-20 overflow-hidden border border-amber-200/40 py-4 relative rounded-2xl shadow-xs"
          style={{ background: "linear-gradient(90deg, rgba(255,250,240,0.7), rgba(252,244,225,0.6))" }}>
          <div className="marquee whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-amber-700/50 font-semibold">
            <span>ACOUSTIC TELEMETRY • WEBAUDIO PROSODY • ATS VECTORS • PROCTORED INTEGRITY • PERCENTILE MAPPING • IRT DIFFICULTY • REVISION DECKS • &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>ACOUSTIC TELEMETRY • WEBAUDIO PROSODY • ATS VECTORS • PROCTORED INTEGRITY • PERCENTILE MAPPING • IRT DIFFICULTY • REVISION DECKS • &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>
    </section>
  );
}
