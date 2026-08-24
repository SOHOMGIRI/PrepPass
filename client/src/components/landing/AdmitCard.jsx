import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpotlightCard from "./SpotlightCard.jsx";
gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    stamp: "INTERVIEWS",
    title: "AI Mock Interviews",
    desc: "Adaptive technical & HR questions, instant scoring, and optional voice-answer mode with camera preview. Get real-time feedback on your pacing, confidence, and keyword usage.",
    icon: "🗣️",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    stamp: "ATS AUDIT",
    title: "Resume ATS Match",
    desc: "Instant compliance audit and job description match feedback.",
    icon: "📄",
    className: "md:col-span-1",
  },
  {
    stamp: "BUILDER",
    title: "AI Resume Builder",
    desc: "Multi-step builder with AI bullet-point enhancement.",
    icon: "🛠",
    className: "md:col-span-1",
  },
  {
    stamp: "TEST MODE",
    title: "Proctored Test Mode",
    desc: "Timed 10-minute MCQ assessments with proctoring violation tracking and trust scoring.",
    icon: "⏱️",
    className: "md:col-span-2",
  },
  {
    stamp: "APTITUDE",
    title: "Aptitude Practice",
    desc: "Untimed, focused drills for Quantitative & Logical reasoning.",
    icon: "🧠",
    className: "md:col-span-1",
  },
  {
    stamp: "ANALYTICS",
    title: "Readiness Analytics",
    desc: "Multi-series performance trend charts & peer rankings.",
    icon: "📊",
    className: "md:col-span-2",
  },
  {
    stamp: "COMPANY PREP",
    title: "Company Tracks",
    desc: "Targeted recruitment patterns for TCS, Amazon, Google & more.",
    icon: "🏢",
    className: "md:col-span-1",
  },
  {
    stamp: "GD PRACTICE",
    title: "Group Discussion",
    desc: "Rehearse GD rounds with AI counter-arguments.",
    icon: "👥",
    className: "md:col-span-1",
  },
  {
    stamp: "REVISION DECK",
    title: "Revision Deck",
    desc: "Interactive flashcards generated from missed test MCQs.",
    icon: "🃏",
    className: "md:col-span-1",
  },
];

export default function AdmitCard() {
  const gridRef = useRef(null);
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !gridRef.current) return;
    const cards = gridRef.current.children;
    gsap.fromTo(cards, 
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true }
      }
    );
    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <section id="features" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white mb-4 border border-white/10 bg-stamp-navy/5 backdrop-blur-sm">
            ALL-IN-ONE PLACEMENT TOOLKIT
          </div>
          <h2 className="font-heading text-4xl text-white sm:text-5xl font-bold tracking-tight">
            Everything you need to crack placements.
          </h2>
          <p className="mt-4 text-base text-indigo-100/80 max-w-2xl mx-auto font-body">
            From ATS resume auditing to proctored MCQs and voice mock interviews — complete prep in one passport.
          </p>
        </div>

        <div 
          ref={gridRef}
          className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense"
        >
          {FEATURES.map((f) => (
            <SpotlightCard
              key={f.title}
              className={`p-8 flex flex-col justify-between group ${f.className || ""}`}
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">{f.icon}</span>
                  <div className="ticket-stamp px-2 py-1 rounded text-white font-mono text-[9px] uppercase border border-white/10 bg-surface/10 text-white border-white/20">
                    {f.stamp}
                  </div>
                </div>
                <h3 className="font-heading text-xl text-white mb-3 font-semibold">
                  {f.title}
                </h3>
                <p className="text-sm text-indigo-100/80 leading-relaxed font-body">{f.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
        
        <div className="mt-16 overflow-hidden border-y border-white/10 py-4 relative">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0A061E] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0A061E] to-transparent z-10" />
          <div className="marquee whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-white/30">
            <span>ATS READY • PROCTORED • AI-POWERED • PEER RANKINGS • RESUME BUILDER • VOICE MODE • COMPANY TRACKS • REVISION DECK • </span>
            <span>ATS READY • PROCTORED • AI-POWERED • PEER RANKINGS • RESUME BUILDER • VOICE MODE • COMPANY TRACKS • REVISION DECK • </span>
          </div>
        </div>
      </div>
    </section>
  );
}

