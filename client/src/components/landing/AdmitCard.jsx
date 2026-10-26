import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SpotlightCard from "./SpotlightCard.jsx";
import {
  Mic,
  FileCheck,
  FileText,
  Clock,
  Brain,
  BarChart3,
  Building2,
  Users,
  Layers,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    stamp: "CORE ENGINE",
    title: "AI Mock Interviews & Prosody HUD",
    desc: "Adaptive technical & behavioral rounds with real-time acoustic speech telemetry (WPM cadence, dead-air pauses, and filler-word detection).",
    icon: Mic,
    className: "md:col-span-2 md:row-span-2",
    highlight: true,
  },
  {
    stamp: "ATS AUDIT",
    title: "Resume ATS Match",
    desc: "Cosine similarity scoring against target job descriptions with keyword gap detection.",
    icon: FileCheck,
    className: "md:col-span-1",
  },
  {
    stamp: "OPTIMIZER",
    title: "AI Resume Architect",
    desc: "One-click bullet optimization converting weak descriptions into Google's X-Y-Z formula.",
    icon: FileText,
    className: "md:col-span-1",
  },
  {
    stamp: "PROCTORED",
    title: "Full-Screen Test Mode",
    desc: "Timed MCQ assessments with focus violation tracking, tab-switch detection, and integrity scoring.",
    icon: Clock,
    className: "md:col-span-2",
  },
  {
    stamp: "DRILLS",
    title: "Aptitude Practice",
    desc: "Targeted quantitative and algorithmic problem sets with step-by-step logic proofs.",
    icon: Brain,
    className: "md:col-span-1",
  },
  {
    stamp: "TELEMETRY",
    title: "Readiness Analytics",
    desc: "Cohort percentile rankings, historical growth curves, and competence radar charts.",
    icon: BarChart3,
    className: "md:col-span-2",
  },
  {
    stamp: "ENTERPRISE",
    title: "Company Tracks",
    desc: "Curated interview patterns modeled after Google, Amazon, Microsoft, and TCS recruitment patterns.",
    icon: Building2,
    className: "md:col-span-1",
  },
  {
    stamp: "COLLABORATIVE",
    title: "GD Arena & Debate",
    desc: "Practice group discussions with live AI counter-arguments and synthesis scoring.",
    icon: Users,
    className: "md:col-span-1",
  },
  {
    stamp: "SPACED REPETITION",
    title: "Revision Deck",
    desc: "Adaptive flashcards generated automatically from your missed test questions and weak areas.",
    icon: Layers,
    className: "md:col-span-1",
  },
];

export default function AdmitCard() {
  const gridRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !gridRef.current) return;
    const cards = gridRef.current.children;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
      }
    );

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <section id="features" className="py-24 bg-transparent relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/25 text-[#9E7B35] font-mono text-[10px] uppercase tracking-widest font-bold mb-4">
            CANDIDATE INTELLIGENCE SUITE
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1128] tracking-tight">
            Complete Preparation, Certified Rigor.
          </h2>
          <p className="mt-4 text-slate-600 text-base max-w-2xl mx-auto">
            From acoustic speech prosody to ATS compliance and proctored technical evaluations — an industrial assessment suite for serious candidates.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense"
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <SpotlightCard
                key={f.title}
                className={`p-7 sm:p-8 flex flex-col justify-between group ${f.className || ""}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0A1128]/5 border border-[#0A1128]/10 flex items-center justify-center text-[#0A1128] group-hover:bg-[#0A1128] group-hover:text-[#C5A059] transition-colors duration-200">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-0.5 rounded border border-[#C5A059]/20">
                      {f.stamp}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#0A1128] mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>

                {f.highlight && (
                  <div className="mt-6 pt-5 border-t border-[#0A1128]/8 flex items-center gap-2 text-xs font-mono text-[#059669] font-bold">
                    <Sparkles size={14} /> Live Web Audio Engine Active
                  </div>
                )}
              </SpotlightCard>
            );
          })}
        </div>

        {/* Industrial Competency Marquee Ticker */}
        <div className="mt-20 overflow-hidden border-y border-[#0A1128]/10 py-5 relative bg-[#F7F4EB]/50 rounded-xl">
          <div className="marquee whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
            <span>
              ACOUSTIC FLUENCY TELEMETRY • WEBAUDIO PROSODY • ATS VECTOR ALIGNMENT • PROCTORED INTEGRITY • PEER PERCENTILE MAPPING • MULTI-PERSONA INTERVIEW BOARD • REVISION FLASHCARDS • &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span>
              ACOUSTIC FLUENCY TELEMETRY • WEBAUDIO PROSODY • ATS VECTOR ALIGNMENT • PROCTORED INTEGRITY • PEER PERCENTILE MAPPING • MULTI-PERSONA INTERVIEW BOARD • REVISION FLASHCARDS • &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
