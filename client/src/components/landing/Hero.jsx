import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import ParticleCanvas from "./ParticleCanvas.jsx";
import FloatingElements from "./FloatingElements.jsx";
import Magnetic from "../Magnetic.jsx";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils.js";
import useRipple from "../../hooks/useRipple.js";

const BTN =
  "inline-flex items-center justify-center rounded-xl font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 transition-all active:scale-95 relative overflow-hidden";
const BTN_PRIMARY = `${BTN} text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 shine-sweep shadow-[0_10px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_35px_rgba(79,70,229,0.4)]`;
const BTN_OUTLINE = `${BTN} text-indigo-100 border-2 border-indigo-400/30 hover:bg-indigo-900/40 px-8 py-4 backdrop-blur-md`;

// Manual text split utility
const StaggeredText = ({ text }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block stagger-text-container" aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <span key={charIndex} className="inline-block stagger-char opacity-0 translate-y-4">
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default function Hero({ accessToken }) {
  const heroRef = useRef(null);
  const ripple = useRipple("rgba(255, 255, 255, 0.3)");
  const rippleDark = useRipple("rgba(255, 255, 255, 0.1)");

  useEffect(() => {
    // Inject Spline Viewer script
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.46/build/spline-viewer.js";
    document.head.appendChild(script);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // Rotate ambient ring
      gsap.to(".ambient-ring", {
        rotation: 360,
        duration: 90,
        repeat: -1,
        ease: "linear",
      });

      // Text Stagger
      gsap.to(".stagger-char", {
        opacity: 1,
        y: 0,
        duration: prefersReduced ? 0 : 0.6,
        stagger: prefersReduced ? 0 : 0.02,
        ease: "back.out(1.5)",
        delay: 0.1,
      });

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.7, ease: "back.out(1.2)" }
      );
    }, heroRef);

    return () => {
      ctx.revert();
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-32 pb-20 min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-[#0A061E]"
    >
      {/* Rich Aurora Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-40 blur-[120px] mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, transparent 70%)", // Rich Indigo
            animation: "aurora-drift-1 12s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full opacity-30 blur-[150px] mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)", // Vibrant Pink
            animation: "aurora-drift-2 15s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-30 blur-[130px] mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, transparent 70%)", // Deep Cyan
            animation: "aurora-drift-3 10s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Rotating Ambient Ring */}
      <div 
        className="ambient-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none z-0 border-[1px] border-dashed border-white/10"
      />

      {/* Spotlight glow following mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-60 mix-blend-screen transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 100%)",
        }}
      />

      <ParticleCanvas />
      <FloatingElements />

      <div className="relative z-20 flex-1 max-w-2xl px-6 lg:pl-16 pt-10 text-center lg:text-left">
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white mb-6 leading-[1.1] tracking-tight drop-shadow-md">
          <StaggeredText text="Your Placement, Rehearsed." />
        </h1>
        
        <p className="hero-subtitle text-indigo-100/80 text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 font-body drop-shadow-sm">
          Mock interviews, readiness grades, and resume feedback — wrapped in an
          exam admit card you can rehearse, refine, and walk in with.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row gap-5 justify-center lg:justify-start opacity-0">
          {accessToken ? (
            <Magnetic>
              <Link to="/dashboard" onPointerDown={ripple} className={BTN_PRIMARY} data-cursor="pointer">
                Go to Dashboard
              </Link>
            </Magnetic>
          ) : (
            <>
              <Magnetic>
                <Link
                  to="/register"
                  onPointerDown={ripple}
                  className={cn(BTN_PRIMARY, "relative group")}
                  data-cursor="pointer"
                >
                  GET STARTED
                </Link>
              </Magnetic>
              <Link to="/login" onPointerDown={rippleDark} className={BTN_OUTLINE} data-cursor="pointer">
                LOG IN
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 3D Spline Centerpiece */}
      <div className="relative z-20 flex-1 h-[400px] sm:h-[500px] lg:h-[700px] w-full flex items-center justify-center pointer-events-none lg:pointer-events-auto opacity-90 mix-blend-screen drop-shadow-2xl">
        <spline-viewer url="https://prod.spline.design/J-Qx2k7oO5lXW2tE/scene.splinecode"></spline-viewer>
      </div>

      {/* Scroll Down Cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">Scroll</span>
        <ChevronDown size={20} className="text-white/60 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}
