import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, Cpu, Zap } from "lucide-react";
import HeroIllustration from "./HeroIllustration.jsx";
import Magnetic from "../Magnetic.jsx";

export default function Hero({ accessToken }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-badge", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
      gsap.fromTo(".hero-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: "power3.out" });
      gsap.fromTo(".hero-subtitle", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.35, ease: "power2.out" });
      gsap.fromTo(".hero-advisory", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: "power2.out" });
      gsap.fromTo(".hero-cta", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.6, ease: "back.out(1.2)" });
      gsap.fromTo(".hero-metrics", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.75, ease: "power2.out" });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative pt-36 pb-24 min-h-screen flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 lg:px-12 overflow-hidden"
    >
      {/* Left Column */}
      <div className="flex-1 max-w-2xl text-center lg:text-left z-10">
        {/* Status Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 text-white mb-8 shadow-lg backdrop-blur-md border border-slate-700/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
            Cognitive AI • Real-Time Adaptive Engine
          </span>
        </div>

        {/* Main Headline — Large, Bold, Distinct */}
        <h1 className="hero-title text-[3.2rem] sm:text-[4rem] lg:text-[4.8rem] font-black text-slate-900 tracking-[-0.04em] leading-[0.95] mb-8">
          Candidate
          <br />
          Intelligence,{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Redefined.
            </span>
            {/* Underline accent */}
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-blue-600/20 via-violet-600/15 to-cyan-500/20 rounded-full -z-0" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-slate-600 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
          Adaptive IRT difficulty branching. Real-time acoustic prosody telemetry.
          Neural topology mapping. ATS vector analysis. All in one accredited pass.
        </p>

        {/* Live Advisory Card */}
        <div className="hero-advisory p-4 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm mb-8 max-w-lg text-left backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-violet-600" />
              <span className="font-mono text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Live Assessment Board
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
              CALIBRATED
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Active Track: <strong className="text-slate-800">Staff Distributed Systems</strong> · IRT Latency: <strong className="text-violet-600">12ms</strong> · Bloom Depth: <strong className="text-slate-800">Level 6 (Synthesis)</strong>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14">
          {accessToken ? (
            <Magnetic>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-violet-600 shadow-xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Open Dossier</span>
                <ArrowRight size={16} className="text-cyan-400" />
              </Link>
            </Magnetic>
          ) : (
            <>
              <Magnetic>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-violet-600 shadow-xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Get Your Pass</span>
                  <ArrowRight size={16} className="text-cyan-400" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider bg-white/80 text-slate-800 border-2 border-slate-200 hover:border-violet-400 hover:text-violet-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.03]"
                >
                  <Zap size={16} />
                  <span>How It Works</span>
                </Link>
              </Magnetic>
            </>
          )}
        </div>

        {/* Metrics */}
        <div className="hero-metrics flex flex-wrap items-center justify-center lg:justify-start gap-8">
          {[
            { value: "24.8K+", label: "Sessions", color: "text-slate-900" },
            { value: "96.4%", label: "Placement Rate", color: "text-violet-600" },
            { value: "<15ms", label: "Prosody Latency", color: "text-cyan-600" },
          ].map((m) => (
            <div key={m.label} className="text-center lg:text-left">
              <div className={`font-mono text-2xl font-black ${m.color} tracking-tight`}>{m.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 w-full max-w-xl mt-14 lg:mt-0 flex justify-center lg:justify-end z-10">
        <HeroIllustration />
      </div>
    </section>
  );
}
