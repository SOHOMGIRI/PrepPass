import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ChevronDown, ArrowRight, ShieldCheck, Sparkles, Award, CheckCircle2 } from "lucide-react";
import HeroIllustration from "./HeroIllustration.jsx";
import Magnetic from "../Magnetic.jsx";

export default function Hero({ accessToken }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.55, ease: "back.out(1.2)" }
      );
      gsap.fromTo(
        ".hero-metrics",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.75, ease: "power2.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative pt-36 pb-20 min-h-screen flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 lg:px-12 overflow-hidden"
    >
      {/* Left Column: Imperial Editorial Typography */}
      <div className="flex-1 max-w-2xl text-center lg:text-left z-10">
        {/* Accreditation Pill Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 text-navy-900 mb-6 shadow-2xs">
          <Award size={14} className="text-[#C5A059]" />
          <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
            ACADEMIC INTELLIGENCE STANDARD 2.0
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A1128] tracking-tight leading-[1.12] mb-6">
          The Imperial Standard of Candidate{" "}
          <span className="relative whitespace-nowrap text-[#C5A059] font-serif italic">
            Assessment.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-slate-600 text-lg sm:text-xl font-normal leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
          Simulate rigorous multi-persona interview boards, evaluate acoustic speech fluency in real-time, and audit ATS resume vectors — wrapped in an accredited candidate pass.
        </p>

        {/* Primary CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
          {accessToken ? (
            <Magnetic>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B] shadow-imperial transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Access Candidate Dossier</span>
                <ArrowRight size={16} className="text-[#C5A059]" />
              </Link>
            </Magnetic>
          ) : (
            <>
              <Magnetic>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B] shadow-imperial transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Initialize Assessment Pass</span>
                  <ArrowRight size={16} className="text-[#C5A059]" />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-heading text-xs font-bold uppercase tracking-wider border border-[#C5A059] text-navy-900 bg-white/70 hover:bg-[#C5A059]/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Inspect Methodology</span>
                </Link>
              </Magnetic>
            </>
          )}
        </div>

        {/* Social Proof & Industrial Metrics Strip */}
        <div className="hero-metrics pt-8 border-t border-[#0A1128]/8 grid grid-cols-3 gap-6 text-center lg:text-left">
          <div>
            <div className="font-heading text-2xl font-bold text-navy-900">18,400+</div>
            <div className="font-mono text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
              Sessions Rehearsed
            </div>
          </div>
          <div>
            <div className="font-heading text-2xl font-bold text-emerald-700">94.2%</div>
            <div className="font-mono text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
              Placement Conversion
            </div>
          </div>
          <div>
            <div className="font-heading text-2xl font-bold text-[#9E7B35]">&lt; 15ms</div>
            <div className="font-mono text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">
              Audio Telemetry
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: 3D Interactive Admission Pass */}
      <div className="flex-1 w-full flex items-center justify-center mt-12 lg:mt-0 z-10">
        <HeroIllustration />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60 pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-slate-500">
          EXPLORE CAPABILITIES
        </span>
        <ChevronDown size={16} className="text-[#0A1128] animate-bounce" />
      </div>
    </section>
  );
}
