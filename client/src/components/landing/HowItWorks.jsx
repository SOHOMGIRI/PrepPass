import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    stamp: "INTERVIEW",
    title: "AI Mock Interviews",
    desc: "Role-matched questions that adapt in real time.",
  },
  {
    stamp: "SCORE",
    title: "Instant Readiness Scoring",
    desc: "A single admit-card-ready grade after every run.",
  },
  {
    stamp: "RESUME",
    title: "Resume-to-JD Matching",
    desc: "ATS-friendly feedback on how your line reads the role.",
  },
];

export default function HowItWorks() {
  const stepsRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !stepsRef.current) return;
    const cards = stepsRef.current.children;
    
    gsap.fromTo(cards,
      { opacity: 0, x: -30 },
      { 
        opacity: 1, x: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: stepsRef.current, start: 'top 85%', once: true }
      }
    );
    
    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  return (
    <section id="how-it-works" className="py-16 bg-surface">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-text-primary text-center mb-3">
          How PrepPass works
        </h2>
        <p className="text-text-secondary/55 text-center mb-12 max-w-xl mx-auto">
          Three passes — practice, score, refine — then rehearse with confidence.
        </p>
        <div ref={stepsRef} className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="ticket-card h-full p-6"
            >
              <div className="ticket-stamp inline-block px-2 py-1 rounded text-text-primary font-mono text-[10px] mb-3">
                {s.stamp}
              </div>
              <h3 className="font-heading text-text-primary mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
