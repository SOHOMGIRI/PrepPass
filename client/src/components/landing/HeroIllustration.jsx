import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroIllustration() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Tree branches reveal
      gsap.fromTo(
        ".tree-branch",
        { strokeDasharray: 1200, strokeDashoffset: 1200 },
        { strokeDashoffset: 0, duration: 4, ease: "power2.out", delay: 0.2 }
      );

      // Character fade in
      gsap.fromTo(
        ".character-fade",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 1 }
      );

      // We're using CSS keyframes for the sway and pulse as requested,
      // but we will fade in the leaves using GSAP
      gsap.fromTo(
        ".glow-leaf",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 2, stagger: 0.05, ease: "back.out(1.5)", delay: 1.5 }
      );

      // Floating particles
      gsap.fromTo(
        ".float-particle",
        { opacity: 0, y: 20 },
        {
          opacity: 0.8,
          y: -100,
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: false,
          stagger: 0.3,
          ease: "sine.inOut"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Generate 50 leaves distributed around the tree canopy
  const leaves = Array.from({ length: 50 }).map((_, i) => {
    // Tree canopy bounds roughly between x: 200-700, y: 50-350
    const cx = 200 + Math.random() * 500;
    const cy = 50 + Math.random() * 300 + (Math.random() > 0.5 ? Math.sin((cx - 200) / 500 * Math.PI) * 100 : 0);
    const r = 4 + Math.random() * 10; // 4-14px
    const isCool = Math.random() > 0.8; // 20% cooler accents
    const color = isCool ? "rgba(45, 212, 191, 0.8)" : "rgba(212, 175, 55, 0.8)"; // Teal or Gold
    const glowColor = isCool ? "rgba(45, 212, 191, 0.4)" : "rgba(212, 175, 55, 0.4)";
    const swayDuration = 3 + Math.random() * 3;
    const pulseDuration = 4 + Math.random() * 4;
    const delay = Math.random() * -5;

    return { id: i, cx, cy, r, color, glowColor, swayDuration, pulseDuration, delay };
  });

  // Generate 15 floating embers
  const embers = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    cx: 200 + Math.random() * 500,
    cy: 350 + Math.random() * 200,
    r: 1 + Math.random() * 3
  }));

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Hand-built SVG Tree of Knowledge */}
      <svg
        className="absolute inset-0 w-full h-full opacity-90 overflow-visible"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="branchGradient" x1="400" y1="800" x2="450" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B0A14" />
            <stop offset="100%" stopColor="#8b6f1f" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Tree Trunk & Branches */}
        <g stroke="url(#branchGradient)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="tree-branch drop-shadow-md">
          {/* Main Trunk to left */}
          <path d="M450 800 Q 420 600, 350 450 Q 250 350, 150 250" />
          {/* Right main branch */}
          <path d="M420 600 Q 550 450, 650 300" strokeWidth="10" />
          {/* Center branch */}
          <path d="M380 500Q 450 350, 480 200" strokeWidth="8" />
          {/* Left sub branch */}
          <path d="M300 400 Q 200 300, 220 180" strokeWidth="6" />
          {/* Right sub branch */}
          <path d="M500 400 Q 600 250, 750 200" strokeWidth="6" />
        </g>
        
        {/* Embers */}
        {embers.map((ember) => (
          <circle
            key={"ember-" + ember.id}
            cx={ember.cx}
            cy={ember.cy}
            r={ember.r}
            fill="#D4AF37"
            className="float-particle"
            style={{ filter: "blur(1px)" }}
          />
        ))}

        {/* Glowing Leaves with CSS animations */}
        {leaves.map((leaf) => (
          <g
            key={leaf.id}
            className="glow-leaf"
            style={{
              transformOrigin: `${leaf.cx}px ${leaf.cy}px`,
              animation: `sway ${leaf.swayDuration}s ease-in-out infinite alternate ${leaf.delay}s`,
            }}
          >
            <circle
              cx={leaf.cx}
              cy={leaf.cy}
              r={leaf.r}
              fill={leaf.color}
              style={{
                animation: `pulseGlow ${leaf.pulseDuration}s ease-in-out infinite alternate ${leaf.delay}s`,
                filter: `drop-shadow(0 0 ${leaf.r * 1.5}px ${leaf.glowColor})`,
              }}
            />
          </g>
        ))}
      </svg>

       {/* unDraw Style Character - Reading */}
      <div className="absolute bottom-10 right-10 z-10 w-72 h-72 character-fade filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk / Base */}
          <path d="M150 400 Q 150 250, 250 250 Q 350 250, 350 400 Z" fill="#8b6f1f" />
          <path d="M120 400 L 380 400 L 380 420 L 120 420 Z" fill="#0B0A14" />
          {/* Head */}
          <circle cx="250" cy="180" r="50" fill="#D4AF37" />
          {/* Book */}
          <path d="M200 320 L 300 320 L 290 380 L 210 380 Z" fill="#F5F0E6" />
          <path d="M250 320 L 250 380" stroke="#8b6f1f" strokeWidth="4" />
          {/* Accent shadow/glow */}
          <circle cx="250" cy="400" r="100" fill="rgba(212, 175, 55, 0.15)" filter="blur(25px)" />
        </svg>
      </div>

      {/* Inline styles for the CSS animations */}
      
    </div>
  );
}



