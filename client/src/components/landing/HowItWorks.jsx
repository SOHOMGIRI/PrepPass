import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageSquareCode, Gauge, FileCheck2, ArrowRight } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: "PASS 01",
    icon: MessageSquareCode,
    title: "Multi-Persona Simulation",
    desc: "Engage with adaptive technical architects and behavioral leadership boards that probe trade-offs in real time.",
  },
  {
    step: "PASS 02",
    icon: Gauge,
    title: "Acoustic Fluency HUD",
    desc: "Calculate live words-per-minute pacing, hesitation dead air, and filler frequency directly via Web Audio prosody.",
  },
  {
    step: "PASS 03",
    icon: FileCheck2,
    title: "Accredited Candidate Dossier",
    desc: "Synthesize interview transcripts, ATS resume scores, and proctored MCQ percentiles into an exportable credential.",
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
    <section id="how-it-works" className="py-24 bg-transparent relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 text-navy-900 font-mono text-[10px] uppercase tracking-widest font-bold mb-4">
            EVALUATION PIPELINE
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1128] tracking-tight">
            Three Rigorous Passes to Mastery.
          </h2>
          <p className="mt-4 text-slate-600 text-base max-w-xl mx-auto">
            From acoustic vocal calibration to real-time algorithmic follow-ups — rehearse with executive precision.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="ticket-card p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold tracking-widest text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-1 rounded border border-[#C5A059]/20">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#0A1128]/5 flex items-center justify-center text-[#0A1128] group-hover:bg-[#0A1128] group-hover:text-[#C5A059] transition-colors duration-200">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#0A1128] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#0A1128]/8 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#0A1128] transition-colors">
                  <span>METHODOLOGY {i + 1}</span>
                  <ArrowRight size={14} className="text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
