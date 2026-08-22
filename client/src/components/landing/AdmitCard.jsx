import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    stamp: "INTERVIEWS",
    title: "AI Mock Interviews",
    desc: "Adaptive technical & HR questions, instant scoring, and optional voice-answer mode with camera preview.",
    icon: "🎙️",
  },
  {
    stamp: "ATS AUDIT",
    title: "Resume ATS & Job-Match",
    desc: "Instant compliance audit, missing section warnings, and job description match feedback.",
    icon: "📄",
  },
  {
    stamp: "BUILDER",
    title: "AI Resume Builder",
    desc: "Multi-step builder with AI bullet-point enhancement and recruiter-ready PDF export.",
    icon: "✨",
  },
  {
    stamp: "TEST MODE",
    title: "Proctored Test Mode",
    desc: "Timed 10-minute MCQ assessments with proctoring violation tracking and trust scoring.",
    icon: "⏱️",
  },
  {
    stamp: "APTITUDE",
    title: "Aptitude Practice",
    desc: "Untimed, focused drills for Quantitative Aptitude, Logical Reasoning, and Verbal Ability.",
    icon: "🧩",
  },
  {
    stamp: "COMPANY PREP",
    title: "Company-Specific Tracks",
    desc: "Targeted recruitment patterns and syllabus tracks for TCS, Amazon, Google, Infosys & more.",
    icon: "🏢",
  },
  {
    stamp: "GD PRACTICE",
    title: "Group Discussion Practice",
    desc: "Rehearse GD rounds with AI counter-arguments, rebuttal feedback, and persuasiveness scoring.",
    icon: "💬",
  },
  {
    stamp: "REVISION DECK",
    title: "Weak-Area Revision Deck",
    desc: "Interactive 3D flashcards automatically generated from missed test MCQs and low interview scores.",
    icon: "🃏",
  },
  {
    stamp: "ANALYTICS",
    title: "Readiness & Peer Analytics",
    desc: "Multi-series performance trend charts and anonymized peer percentile rankings per subject.",
    icon: "📊",
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
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true }
      }
    );
    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <section id="features" className="py-16 bg-cream">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy mb-3">
            ALL-IN-ONE PLACEMENT TOOLKIT
          </div>
          <h2 className="font-heading text-3xl text-stamp-navy sm:text-4xl">
            Everything you need to crack placements.
          </h2>
          <p className="mt-2 text-sm text-ink/60 max-w-xl mx-auto">
            From ATS resume auditing to proctored MCQs and voice mock interviews — complete prep in one passport.
          </p>
        </div>

        <div 
          ref={gridRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          style={{ transformStyle: 'preserve-3d', perspective: '600px' }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                e.currentTarget.style.transform = `rotateY(${x / 10}deg) rotateX(${-y / 10}deg)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)";
              }}
              data-cursor="pointer"
              className="ticket-card p-6 flex flex-col justify-between transition hover:border-stamp-navy/40"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div className="ticket-stamp px-2 py-0.5 rounded text-stamp-navy font-mono text-[9px] uppercase">
                    {f.stamp}
                  </div>
                </div>
                <h3 className="font-heading text-lg text-stamp-navy mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-ink/70 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 overflow-hidden">
          <div className="marquee whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-stamp-navy/20">
            <span>ATS READY · PROCTORED · AI-POWERED · PEER RANKINGS · RESUME BUILDER · VOICE MODE · COMPANY TRACKS · REVISION DECK · </span>
            <span>ATS READY · PROCTORED · AI-POWERED · PEER RANKINGS · RESUME BUILDER · VOICE MODE · COMPANY TRACKS · REVISION DECK · </span>
          </div>
        </div>
      </div>
    </section>
  );
}
