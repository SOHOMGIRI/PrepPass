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
        { strokeDasharray: 1500, strokeDashoffset: 1500 },
        { strokeDashoffset: 0, duration: 4, ease: "power2.out", delay: 0.2 }
      );

      // Character fade in
      gsap.fromTo(
        ".character-fade",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 1 }
      );

      // Fade in canopy clusters
      gsap.fromTo(
        ".glow-leaf",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 2, stagger: 0.01, ease: "back.out(1.2)", delay: 1.5 }
      );

      // Floating embers
      gsap.fromTo(
        ".float-particle",
        { opacity: 0, y: 20 },
        {
          opacity: 0.8,
          y: -150,
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: false,
          stagger: 0.2,
          ease: "sine.inOut"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Define 6 branch tip points for the canopy clusters
  const canopyCenters = [
    { x: 150, y: 250 }, // Far left
    { x: 220, y: 180 }, // Mid left
    { x: 350, y: 100 }, // Top center left
    { x: 480, y: 200 }, // Top center right
    { x: 650, y: 300 }, // Far right
    { x: 750, y: 200 }, // Far upper right
  ];

  // Generate 180 total glow elements clustered around the branch tips
  const leaves = [];
  let id = 0;
  
  canopyCenters.forEach((center) => {
    const clusterSize = 30; // 30 leaves per cluster = 180 total
    for (let i = 0; i < clusterSize; i++) {
      // Spread them in a Gaussian-like distribution around the center point
      const radius = Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;
      const cx = center.x + Math.cos(angle) * radius;
      const cy = center.y + Math.sin(angle) * radius;
      
      const r = 3 + Math.random() * 6; // 3-9px base radius
      const isCool = Math.random() > 0.85; // 15% teal accent
      
      const coreColor = isCool ? "#CCFBF1" : "#FFF4D6";
      const glowColor = isCool ? "rgba(45, 212, 191, 0.6)" : "rgba(212, 175, 55, 0.6)"; // Teal or Gold
      
      const swayDuration = 3 + Math.random() * 4;
      const pulseDuration = 3 + Math.random() * 3;
      const delay = Math.random() * -5;

      leaves.push({ id: id++, cx, cy, r, coreColor, glowColor, swayDuration, pulseDuration, delay });
    }
  });

  // Generate 20 floating embers
  const embers = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    cx: 100 + Math.random() * 600,
    cy: 350 + Math.random() * 300,
    r: 1 + Math.random() * 2
  }));

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Hand-built SVG Tree of Knowledge - Scaled to 40-50% of container */}
      <svg
        className="absolute inset-0 w-full h-full opacity-100 overflow-visible"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "scale(1.2)" }}
      >
        <defs>
          <linearGradient id="branchGradient" x1="500" y1="900" x2="450" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B0A14" />
            <stop offset="100%" stopColor="#8B6F1F" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Tree Trunk & Branches (Thicker) */}
        <g stroke="url(#branchGradient)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" className="tree-branch drop-shadow-xl">
          {/* Main Trunk */}
          <path d="M450 900 Q 420 600, 350 450 Q 250 350, 150 250" />
          {/* Right main branch */}
          <path d="M420 600 Q 550 450, 650 300" strokeWidth="14" />
          {/* Center branch */}
          <path d="M380 500 Q 450 350, 480 200" strokeWidth="12" />
          {/* Left sub branch */}
          <path d="M300 400 Q 200 300, 220 180" strokeWidth="10" />
          {/* Right sub branch */}
          <path d="M500 400 Q 600 250, 750 200" strokeWidth="10" />
          {/* Top center left branch */}
          <path d="M400 350 Q 380 200, 350 100" strokeWidth="8" />
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

        {/* Glowing Canopy Clusters with CSS animations */}
        {leaves.map((leaf) => (
          <g
            key={leaf.id}
            className="glow-leaf"
            style={{
              transformOrigin: leaf.cx + 'px ' + leaf.cy + 'px',
              animation: 'sway ' + leaf.swayDuration + 's ease-in-out infinite alternate ' + leaf.delay + 's',
            }}
          >
            {/* Outer Glow */}
            <circle
              cx={leaf.cx}
              cy={leaf.cy}
              r={leaf.r * 2.5}
              fill={leaf.glowColor}
              style={{ filter: "blur(8px)" }}
            />
            {/* Bright Core */}
            <circle
              cx={leaf.cx}
              cy={leaf.cy}
              r={leaf.r}
              fill={leaf.coreColor}
              style={{
                animation: 'pulseGlow ' + leaf.pulseDuration + 's ease-in-out infinite alternate ' + leaf.delay + 's',
                filter: 'drop-shadow(0 0 ' + (leaf.r * 2) + 'px ' + leaf.glowColor + ')' 
              }}
            />
          </g>
        ))}
      </svg>

      {/* unDraw Style Character - Reading */}
      <div className="absolute bottom-[5%] right-[10%] z-10 w-80 h-80 character-fade filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] scale-110">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk / Base */}
          <path d="M150 400 Q 150 250, 250 250 Q 350 250, 350 400 Z" fill="#8B6F1F" />
          <path d="M120 400 L 380 400 L 380 420 L 120 420 Z" fill="#0B0A14" />
          {/* Head */}
          <circle cx="250" cy="180" r="50" fill="#D4AF37" />
          {/* Book */}
          <path d="M200 320 L 300 320 L 290 380 L 210 380 Z" fill="#F5F0E6" />
          <path d="M250 320 L 250 380" stroke="#8B6F1F" strokeWidth="4" />
          {/* Accent shadow/glow */}
          <circle cx="250" cy="400" r="100" fill="rgba(212, 175, 55, 0.2)" filter="blur(30px)" />
        </svg>
      </div>
    </div>
  );
}
