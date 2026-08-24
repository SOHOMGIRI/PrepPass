import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import FloatingElements from "./FloatingElements.jsx";
import Magnetic from "../Magnetic.jsx";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils.js";
import useRipple from "../../hooks/useRipple.js";
import HeroIllustration from "./HeroIllustration.jsx";

const BTN =
  "inline-flex items-center justify-center rounded-xl font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 transition-all active:scale-95 relative overflow-hidden";
const BTN_PRIMARY = `${BTN} text-[#0B0A14] bg-gold hover:opacity-90 px-8 py-4 shine-sweep shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.4)]`;
const BTN_OUTLINE = `${BTN} text-gold border-2 border-gold hover:bg-gold/10 px-8 py-4 backdrop-blur-md`;

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
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
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

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-32 pb-20 min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-visible"
    >
      <FloatingElements />

      <div className="relative z-20 flex-1 max-w-2l px-6 lg:pl-16 pt-10 text-center lg:text-left">
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-gold mb-6 leading-[1.1] tracking-tight drop-shadow-md">
          <StaggeredText text="Your Placement, Rehearsed." />
        </h1>
        
        <p className="hero-subtitle text-text-secondary/80 text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 font-body drop-shadow-sm">
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
              <Magnetic><Link to="/login" onPointerDown={rippleDark} className={BTN_OUTLINE} data-cursor="pointer">
                LOG IN
                </Link>
              </Magnetic>
            </>
         )}
        </div>
      </div>

      <div className="relative z-10 flex-1 h-[400px] sm:h-[500px] lg:h-[700px] w-full flex items-center justify-center pointer-events-none drop-shadow-2xl">
        <HeroIllustration />
      </div>

      {/* Scroll Down Cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-70">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">Scroll</span>
        <ChevronDown size={20} className="text-white/60 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}






