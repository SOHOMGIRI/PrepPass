import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, Cpu, Zap, Sparkles } from "lucide-react";
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
        <div
          className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 shadow-md backdrop-blur-md border border-amber-300/40 text-amber-950 font-mono text-[11px] uppercase tracking-widest font-bold"
          style={{
            background: "linear-gradient(135deg, rgba(255,248,235,0.95) 0%, rgba(250,238,218,0.9) 100%)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>Cognitive AI • Real-Time Adaptive Engine</span>
        </div>

        {/* Main Headline — Large, Bold, Distinct */}
        <h1 className="hero-title text-[3.2rem] sm:text-[4rem] lg:text-[4.8rem] font-black text-slate-900 tracking-[-0.04em] leading-[0.95] mb-8">
          Candidate
          <br />
          Intelligence,{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-amber-600 via-rose-500 to-violet-600 bg-clip-text text-transparent">
              Redefined.
            </span>
            {/* Underline accent */}
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-violet-500/25 rounded-full -z-0" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-slate-700/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
          Adaptive IRT difficulty branching. Real-time acoustic prosody telemetry.
          Neural topology mapping. ATS vector analysis. All in one accredited pass.
        </p>

        {/* Live Advisory Card with Hover Tilt & Warm Frosted Glass */}
        <div
          className="hero-advisory p-4 sm:p-5 rounded-3xl border border-amber-300/40 shadow-[0_8px_30px_rgba(180,140,60,0.06)] mb-8 max-w-lg text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(180,140,60,0.12)] hover:border-amber-400/60"
          style={{
            background: "linear-gradient(145deg, rgba(255,250,240,0.92) 0%, rgba(252,243,225,0.88) 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-amber-700" />
              <span className="font-mono text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                Live Assessment Board
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60 shadow-2xs">
              CALIBRATED
            </span>
          </div>
          <p className="text-xs text-amber-950/80 leading-relaxed font-sans">
            Active Track: <strong className="text-slate-900 font-bold">Staff Distributed Systems</strong> · IRT Latency: <strong className="text-amber-700 font-bold">12ms</strong> · Bloom Depth: <strong className="text-slate-900 font-bold">Level 6 (Synthesis)</strong>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14">
          {accessToken ? (
            <Magnetic>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #2D241E 0%, #1A1410 100%)",
                }}
              >
                <span>Open Dossier</span>
                <ArrowRight size={16} className="text-amber-400" />
              </Link>
            </Magnetic>
          ) : (
            <>
              <Magnetic>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #2D241E 0%, #1A1410 100%)",
                  }}
                >
                  <span>Get Your Pass</span>
                  <ArrowRight size={16} className="text-amber-400" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-amber-950 border border-amber-300/60 hover:border-amber-400 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,250,240,0.85) 0%, rgba(250,240,220,0.8) 100%)",
                  }}
                >
                  <Zap size={16} className="text-amber-600" />
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
            { value: "96.4%", label: "Placement Rate", color: "text-amber-700" },
            { value: "<15ms", label: "Prosody Latency", color: "text-emerald-700" },
          ].map((m) => (
            <div key={m.label} className="text-center lg:text-left">
              <div className={`font-mono text-2xl font-black ${m.color} tracking-tight`}>{m.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-900/60 mt-0.5 font-semibold">{m.label}</div>
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
