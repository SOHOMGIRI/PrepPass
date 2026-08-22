import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroIllustration() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.to(".glow-leaf", {
        opacity: 0.4,
        scale: 0.9,
        duration: "random(1.5, 3)",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut",
      });
      gsap.fromTo(
        ".tree-branch",
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 3, ease: "power2.out", delay: 0.5 }
      );
      gsap.fromTo(
        ".character-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 1 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Hand-built SVG Tree of Knowledge */}
      <svg
        className="absolute inset-0 w-full h-full opacity-80"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="rgba(99, 102, 241, 0.4)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="tree-branch">
          <path d="M400 800 Q 380 600, 400 450 Q 300 350, 200 300" />
          <path d="M400 450 Q 500 350, 650 250" />
          <path d="M400 450 Q 450 250, 480 150" />
          <path d="M440 330 Q 350 200, 320 120" />
        </g>
        
        {/* Glowing Leaves */}
        <circle cx="200" cy="300" r="15" fill="#FABF24" className="glow-leaf drop-shadou-[0_0_15px_rgba(251,191,36,0.6)]" />
        <circle cx="650" cy="250" r="18" fill="#34D399" className="glow-leaf drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
        <circle cx="480" cy="150" r="14" fill="#E879F9" className="glow-leaf drop-shadow-[0_0_15px_rgba(232,121,249,0.6)]" />
        <circle cx="320" cy="120" r="16" fill="#22D3CE" className="glow-leaf drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
        <circle cx="550" cy="350" r="12" fill="#60A5FA" className="glow-leaf drop-shadou-[0_0_15px_rgba(96,165,250,0.6)]" />
        <circle cx="300" cy="450" r="14" fill="#818CF8" className="glow-leaf drop-shadow-[0_0_15px_rgba(129,140,248,0.6)]" />
      </svg>

      {/* unDraw Style Character - Reading */}
      <div className="absolute bottom-20 z-10 w-64 h-64 character-fade filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 400 Q 150 250, 250 250 Q 350 250, 350 400 Z" fill="#4F46E5" />
          <path d="M120 400 L 380 400 L 380 420 L 120 420 Z" fill="#312E81" />
          <circle cx="250" cy="180" r="50" fill="#FDE047" />
          <path d="M200 320 L 300 320 L 290 380 L 210 380 Z" fill="#F8FAFC" />
          <path d="M250 320 L 250 380" stroke="#CBD5E1" strokeWidth="4" />
          <circle cx="250" cy="400" r="100" fill="rgba(79, 70, 229, 0.4)" filter="blur(20px)" />
        </svg>
      </div>
    </div>
  );
}
