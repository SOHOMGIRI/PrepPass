import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Cpu } from "lucide-react";
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
        ".hero-advisory",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.6, ease: "back.out(1.2)" }
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
      {/* Left Column: Luminous Modern SaaS Typography */}
      <div className="flex-1 max-w-2xl text-center lg:text-left z-10">
        {/* Live System Badge (Like ÆtherTransit's Fleet Telemetry) */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-900 mb-6 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="font-mono text-xs uppercase tracking-wider font-bold">
            COGNITIVE ASSESSMENT INTELLIGENCE • Real-Time Adaptive Engine
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
          Next-Gen Candidate Intelligence.{" "}
          <span className="block mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Live Adaptive Interview AI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-slate-600 text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
          Engineered for high-stakes technical & behavioral evaluations. Real-time acoustic prosody telemetry, dynamic Bloom&apos;s taxonomy difficulty branching, and instant ATS vector matching.
        </p>

        {/* Live Real-Time Advisory Card (Like ÆtherTransit) */}
        <div className="hero-advisory p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm mb-8 max-w-lg text-left backdrop-blur-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-blue-600" />
              <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider">
                Real-Time Board Advisory
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/50">
              OPTIMAL CALIBRATION
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-normal font-sans">
            Target Track: <strong className="text-slate-800">Staff Distributed Systems</strong> • Real-time IRT Latency: <strong className="text-blue-600">12ms</strong> • Cognitive Depth: <strong className="text-slate-800">Bloom Level 6 (Synthesis)</strong>
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
          {accessToken ? (
            <Magnetic>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Access Candidate Dossier</span>
                <ArrowRight size={16} className="text-cyan-400" />
              </Link>
            </Magnetic>
          ) : (
            <>
              <Magnetic>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Initialize Assessment Pass</span>
                  <ArrowRight size={16} className="text-cyan-400" />
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-white text-slate-800 border border-slate-300/80 hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Inspect ML Engine</span>
                </Link>
              </Magnetic>
            </>
          )}
        </div>

        {/* Enterprise Metrics Bar */}
        <div className="hero-metrics grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
          <div>
            <div className="font-mono text-2xl font-black text-slate-900">24,800+</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
              Sessions Evaluated
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-black text-blue-600">96.4%</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
              Placement Conversion
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-black text-emerald-600">&lt; 15ms</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
              Prosody Telemetry
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive 3D Candidate Pass & Telemetry Stage */}
      <div className="flex-1 w-full max-w-xl mt-12 lg:mt-0 flex justify-center lg:justify-end z-10">
        <HeroIllustration />
      </div>
    </section>
  );
}
