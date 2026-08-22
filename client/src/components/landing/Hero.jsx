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
  "inline-flex items-center justify-center rounded-lg font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-950/50 focus:ring-offset-2 transition-all active:scale-95 relative overflow-hidden";
const BTN_PRIMARY = `${BTN} text-white bg-amber-500 hover:bg-amber-600 px-8 py-3.5 shine-sweep shadow-lg hover:shadow-xl`;
const BTN_OUTLINE = `${BTN} text-indigo-950 border-2 border-dashed border-indigo-950/40 hover:bg-indigo-950/5 px-8 py-3.5`;

// Manual text split utility (GSAP SplitText alternative)
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
  const rippleDark = useRipple("rgba(30, 27, 75, 0.1)");

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // 1. Text Stagger Reveal
      gsap.to(".stagger-char", {
        opacity: 1,
        y: 0,
        duration: prefersReduced ? 0 : 0.6,
        stagger: prefersReduced ? 0 : 0.02,
        ease: "back.out(1.5)",
        delay: 0.1,
      });

      // 2. Subtitle Fade
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: "power2.out" }
      );

      // 3. CTA Buttons Fade
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.7, ease: "back.out(1.2)" }
      );

      // 4. Floating Elements Entrance (Scaling up)
      gsap.to(".absolute.flex.items-center.justify-center", {
        scale: 1, // original scale is inline-styled on the element
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
        delay: 0.6,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-32 pb-20 min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Base background layer */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(1200px 500px at 50% 30%, #ffffff 0%, #fbf8f0 100%)",
        }}
      />

      {/* Aurora gradient blobs (Updated palette) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-[5]">
        <div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)", // Indigoish
            animation: "aurora-drift-1 12s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)", // Amber
            animation: "aurora-drift-2 15s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-[90px]"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", // Emerald
            animation: "aurora-drift-3 10s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Spotlight glow following mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-40 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Optional Particle field */}
      <ParticleCanvas />

      {/* 2D Floating Illustrative Elements */}
      <FloatingElements />

      <div className="relative z-20 max-w-4xl mx-auto text-center px-6">
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-[#1E1B4B] mb-6 leading-[1.1] tracking-tight">
          <StaggeredText text="Your Placement, Rehearsed." />
        </h1>
        
        <p className="hero-subtitle text-slate-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-0 font-body">
          Mock interviews, readiness grades, and resume feedback — wrapped in an
          exam admit card you can rehearse, refine, and walk in with.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row gap-5 justify-center opacity-0">
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
                  {/* Decorative ticket notch left/right */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 border-2 border-indigo-950/10 rounded-full bg-ticket" />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 border-2 border-indigo-950/10 rounded-full bg-ticket" />
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

      {/* Scroll Down Cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-indigo-950/50">Scroll</span>
        <ChevronDown size={20} className="text-indigo-950 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}
