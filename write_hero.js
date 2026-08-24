const fs = require('fs');
const content = import { useEffect, useRef } from "react";
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
        { strokeDasharray: 2500, strokeDashoffset: 2500 },
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
        { opacity: 1, scale: 1, duration: 2, stagger: 0.005, ease: "back.out(1.2)", delay: 1.5 }
      );

      // Floating embers
      gsap.fromTo(
        ".float-particle",
        { opacity: 0, y: 20 },
        {
          opacity: 0.8,
          y: -200,
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: false,
          stagger: 0.15,
          ease: "sine.inOut"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Define 8 branch tip points for the canopy clusters, spread more to the left
  const canopyCenters = [
    { x: -50, y: 200 }, // Far far left
    { x: 50, y: 300 }, // Lower left
    { x: 150, y: 150 }, // Mid upper left
    { x: 280, y: 80 },  // Top center left
    { x: 420, y: 180 }, // Top center right
    { x: 600, y: 280 }, // Far right
    { x: 750, y: 180 }, // Far upper right
    { x: 850, y: 350 }, // Extreme right
  ];

  // Generate 250 total glow elements clustered around the branch tips for MAX density and vibrancy
  const leaves = [];
  let id = 0;
  
  canopyCenters.forEach((center) => {
    const clusterSize = 32; // 32 * 8 = 256 leaves
    for (let i = 0; i < clusterSize; i++) {
      // Gaussian-like distribution
      const radius = Math.random() * 100;
      const angle = Math.random() * Math.PI * 2;
      const cx = center.x + Math.cos(angle) * radius;
      const cy = center.y + Math.sin(angle) * radius;
      
      const r = 4 + Math.random() * 8; // 4-12px base radius (bigger)
      const colorRandom = Math.random();
      
      let coreColor, glowColor;
      if (colorRandom > 0.85) {
        // Teal
        coreColor = "#CCFBF1";
        glowColor = "rgba(45, 212, 191, 0.7)"; 
      } else if (colorRandom > 0.70) {
        // Vibrant Pink/Purple
        coreColor = "#FAE8FF";
        glowColor = "rgba(217, 70, 239, 0.7)"; 
      } else {
        // Gold / Yellow
        coreColor = "#FFF4D6";
        glowColor = "rgba(212, 175, 55, 0.7)";
      }
      
      const swayDuration = 3 + Math.random() * 4;
      const pulseDuration = 3 + Math.random() * 3;
      const delay = Math.random() * -5;

      leaves.push({ id: id++, cx, cy, r, coreColor, glowColor, swayDuration, pulseDuration, delay });
    }
  });

  // Generate 30 floating embers
  const embers = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    cx: -50 + Math.random() * 900,
    cy: 250 + Math.random() * 400,
    r: 1 + Math.random() * 3,
    color: Math.random() > 0.5 ? "#D4AF37" : "#2DD4BF"
  }));

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Hand-built SVG Tree of Knowledge - Scaled up and shifted left */}
      <svg
        className="absolute inset-0 w-full h-full opacity-100 overflow-visible"
        viewBox="-100 0 1100 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "scale(1.3) translateX(-5%)" }}
      >
        <defs>
          <linearGradient id="branchGradient" x1="500" y1="900" x2="400" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B6F1F" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFF4D6" stopOpacity="1" />
          </linearGradient>
          <filter id="trunkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 3D Trunk Shadow */}
        <g stroke="#000000" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" className="tree-branch opacity-50" style={{ transform: "translateX(5px) translateY(5px)" }}>
          <path d="M450 900 Q 400 600, 280 450 Q 150 350, -50 200" />
          <path d="M420 600 Q 550 450, 600 280" strokeWidth="18" />
          <path d="M360 520 Q 420 350, 420 180" strokeWidth="16" />
          <path d="M250 420 Q 150 300, 150 150" strokeWidth="14" />
          <path d="M500 450 Q 650 250, 850 350" strokeWidth="14" />
          <path d="M600 350 Q 700 250, 750 180" strokeWidth="12" />
          <path d="M120 300 Q 50 250, 50 300" strokeWidth="10" />
          <path d="M350 250 Q 320 150, 280 80" strokeWidth="10" />
        </g>

        {/* Tree Trunk & Branches - Thick and Glowing */}
        <g stroke="url(#branchGradient)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" className="tree-branch" filter="url(#trunkGlow)">
          {/* Main Trunk shifted left */}
          <path d="M450 900 Q 400 600, 280 450 Q 150 350, -50 200" />
          {/* Right main branch */}
          <path d="M420 600 Q 550 450, 600 280" strokeWidth="16" />
          {/* Center branch */}
          <path d="M360 520 Q 420 350, 420 180" strokeWidth="14" />
          {/* Left sub branch */}
          <path d="M250 420 Q 150 300, 150 150" strokeWidth="12" />
          {/* Far Right sub branch */}
          <path d="M500 450 Q 650 250, 850 350" strokeWidth="12" />
          {/* Right sub sub branch */}
          <path d="M600 350 Q 700 250, 750 180" strokeWidth="10" />
          {/* Leftest sub branch */}
          <path d="M120 300 Q 50 250, 50 300" strokeWidth="8" />
          {/* Top center left */}
          <path d="M350 250 Q 320 150, 280 80" strokeWidth="8" />
        </g>
        
        {/* Embers */}
        {embers.map((ember) => (
          <circle
            key={'ember-' + ember.id}
            cx={ember.cx}
            cy={ember.cy}
            r={ember.r}
            fill={ember.color}
            className="float-particle"
            style={{ filter: "blur(2px)", boxShadow: '0 0 10px ' + ember.color }}
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
              r={leaf.r * 3}
              fill={leaf.glowColor}
              style={{ filter: "blur(10px)", mixBlendMode: "screen" }}
            />
            {/* Bright Core */}
            <circle
              cx={leaf.cx}
              cy={leaf.cy}
              r={leaf.r}
              fill={leaf.coreColor}
              style={{
                animation: 'pulseGlow ' + leaf.pulseDuration + 's ease-in-out infinite alternate ' + leaf.delay + 's',
                filter: 'drop-shadow(0 0 ' + (leaf.r * 2.5) + 'px ' + leaf.glowColor + ')' 
              }}
            />
          </g>
        ))}
      </svg>

      {/* 3D Student Character with Graduation Hat */}
      <div className="absolute bottom-[2%] right-[5%] z-10 w-96 h-96 character-fade filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] scale-125">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="headGlow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFF4D6" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8B6F1F" />
            </radialGradient>
            <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8B6F1F" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B6F1F" />
              <stop offset="100%" stopColor="#0B0A14" />
            </linearGradient>
          </defs>
          
          {/* Desk / Base (3D with gradient) */}
          <path d="M120 420 Q 120 250, 250 250 Q 380 250, 380 420 Z" fill="url(#bodyGrad)" />
          
          {/* Glowing Head */}
          <circle cx="250" cy="180" r="55" fill="url(#headGlow)" filter="drop-shadow(0 0 15px rgba(212,175,55,0.6))" />
          
          {/* Graduation Hat */}
          {/* Tassel */}
          <path d="M250 115 L 310 135 L 310 160" stroke="#F0D878" strokeWidth="4" fill="none" />
          <circle cx="310" cy="165" r="5" fill="#F0D878" />
          {/* Cap Base */}
          <path d="M190 125 L 310 125 L 290 155 L 210 155 Z" fill="#0B0A14" />
          {/* Cap Top (Diamond) */}
          <path d="M250 90 L 340 125 L 250 160 L 160 125 Z" fill="#1A162B" stroke="#D4AF37" strokeWidth="3" />
          
          {/* Book with 3D pages */}
          <path d="M180 320 L 320 320 L 300 390 L 200 390 Z" fill="#FFF4D6" />
          <path d="M190 310 L 310 310 L 320 320 L 180 320 Z" fill="#D4AF37" />
          <path d="M250 310 L 250 390" stroke="#8B6F1F" strokeWidth="5" />
          
          {/* Accent shadow/glow */}
          <circle cx="250" cy="400" r="120" fill="rgba(212, 175, 55, 0.25)" filter="blur(35px)" />
        </svg>
      </div>
    </div>
  );
}

fs.writeFileSync('client/src/components/landing/HeroIllustration.jsx', content, 'utf8');
