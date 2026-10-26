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
    desc: "Engage with real-time dynamic questions driven by Item Response Theory (IRT) that branch and probe trade-offs based on your exact responses.",
    color: "from-blue-600 to-indigo-600",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    step: "PASS 02",
    icon: Gauge,
    title: "Acoustic Prosody HUD",
    desc: "Calculate live words-per-minute pacing, hesitation dead air, and filler frequency directly via Web Audio API FFT prosody telemetry.",
    color: "from-cyan-500 to-blue-600",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    step: "PASS 03",
    icon: FileCheck2,
    title: "Accredited Candidate Dossier",
    desc: "Synthesize interview transcripts, ATS resume keyword match vectors, and proctored MCQ percentiles into a verified candidate dossier.",
    color: "from-indigo-600 to-violet-600",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
];

export default function HowItWorks() {
  const stepsRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !stepsRef.current) return;
    const cards = stepsRef.current.children;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: stepsRef.current, start: "top 85%", once: true },
      }
    );

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[10px] uppercase tracking-widest font-bold mb-4 shadow-2xs">
            EVALUATION PIPELINE
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Three Rigorous Passes to Mastery.
          </h2>
          <p className="mt-4 text-slate-600 text-base max-w-xl mx-auto">
            From acoustic vocal calibration to real-time algorithmic follow-ups — rehearse with executive precision.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-xl hover:border-blue-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`font-mono text-xs font-bold tracking-widest px-3 py-1 rounded-full border ${s.badge}`}>
                      {s.step}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="font-sans text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-blue-600 font-semibold">
                  <span>Explore Architecture</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
