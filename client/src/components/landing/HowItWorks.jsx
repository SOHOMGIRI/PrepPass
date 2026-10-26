import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageSquareCode, Gauge, FileCheck2, ArrowRight } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: "PASS 01",
    icon: MessageSquareCode,
    title: "Adaptive ML Simulation",
    desc: "Real-time IRT dynamic questions that branch and probe based on your exact responses and cognitive depth.",
    gradient: "from-rose-400 to-violet-500",
    tint: "rgba(232,121,160,0.08)",
  },
  {
    step: "PASS 02",
    icon: Gauge,
    title: "Acoustic Prosody HUD",
    desc: "Live WPM pacing, dead-air detection, and filler-word frequency via Web Audio API FFT prosody telemetry.",
    gradient: "from-violet-400 to-indigo-500",
    tint: "rgba(167,139,250,0.08)",
  },
  {
    step: "PASS 03",
    icon: FileCheck2,
    title: "Accredited Candidate Dossier",
    desc: "Synthesize transcripts, ATS keyword vectors, and proctored percentiles into a verified credential pass.",
    gradient: "from-amber-400 to-orange-500",
    tint: "rgba(245,158,11,0.08)",
  },
];

export default function HowItWorks() {
  const stepsRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !stepsRef.current) return;
    const cards = stepsRef.current.children;

    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out",
      scrollTrigger: { trigger: stepsRef.current, start: "top 85%", once: true },
    });

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold mb-4 shadow-xs border border-violet-200/50"
            style={{ background: "rgba(167,139,250,0.1)", color: "#7C3AED" }}>
            EVALUATION PIPELINE
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Three Rigorous Passes.
          </h2>
          <p className="mt-4 text-slate-600 text-base max-w-xl mx-auto">
            From acoustic vocal calibration to real-time algorithmic follow-ups.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-7">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="group p-8 rounded-3xl backdrop-blur-md border border-amber-200/40 shadow-[0_8px_30px_rgba(180,140,60,0.06)] hover:shadow-[0_20px_50px_rgba(167,139,250,0.12)] hover:-translate-y-2 hover:border-violet-300/50 transition-all duration-300 flex flex-col justify-between cursor-default"
                style={{ background: `linear-gradient(145deg, rgba(255,250,240,0.88), rgba(252,244,225,0.85))` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-[11px] font-bold tracking-widest px-3 py-1 rounded-full border border-amber-200/50"
                      style={{ background: s.tint, color: "#92400E" }}>
                      {s.step}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="font-sans text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-700 transition-colors duration-200">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-amber-200/30 flex items-center justify-between font-mono text-xs text-violet-600 font-semibold">
                  <span>Explore</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
