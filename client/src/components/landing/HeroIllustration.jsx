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
        { strokeDasharray: 2500, strokeDashoffset: 2500 },
        { strokeDashoffset: 0, duration: 4, ease: "power2.out", delay: 0.2 }
      );

      // Character fade in
      gsap.fromTo(
        ".character-fade",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 1 }
      );

      // Fade in canopy clusters (optimized stagger)
      gsap.fromTo(
        ".glow-leaf",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 1.5, stagger: 0.002, ease: "back.out(1.2)", delay: 1.5 }
      );

      // Floating embers - STORM WIND EFFECT
      gsap.fromTo(
        ".float-particle",
        { opacity: 0, y: 100, x: -100 },
        {
          opacity: 0.9,
          y: -400,
          x: 500, // Blowing hard to the right
          duration: "random(1.5, 4)", // Fast storm wind
          repeat: -1,
          yoyo: false,
          stagger: 0.1,
          ease: "power1.inOut"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const canopyCenters = [
    { x: -50, y: 200 },
    { x: 50, y: 300 },
    { x: 150, y: 150 },
    { x: 280, y: 80 },
    { x: 420, y: 180 },
    { x: 600, y: 280 },
    { x: 750, y: 180 },
    { x: 850, y: 350 },
  ];

  const leaves = [];
  let id = 0;
  
  canopyCenters.forEach((center) => {
    const clusterSize = 32;
    for (let i = 0; i < clusterSize; i++) {
      const radius = Math.random() * 100;
      const angle = Math.random() * Math.PI * 2;
      const cx = center.x + Math.cos(angle) * radius;
      const cy = center.y + Math.sin(angle) * radius;
      
      const r = 4 + Math.random() * 8;
      const colorRandom = Math.random();
      
      let gradientId, coreColor;
      if (colorRandom > 0.85) {
        gradientId = "url(#glowTeal)";
        coreColor = "#CCFBF1";
      } else if (colorRandom > 0.70) {
        gradientId = "url(#glowPink)";
        coreColor = "#FAE8FF";
      } else {
        gradientId = "url(#glowGold)";
        coreColor = "#FFF4D6";
      }
      
      const swayDuration = 2 + Math.random() * 2; // Faster for storm effect
      const pulseDuration = 2 + Math.random() * 2;
      const delay = Math.random() * -5;

      leaves.push({ id: id++, cx, cy, r, coreColor, gradientId, swayDuration, pulseDuration, delay });
    }
  });

  const embers = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    cx: -200 + Math.random() * 1000,
    cy: 250 + Math.random() * 600,
    r: 1 + Math.random() * 4,
    color: Math.random() > 0.5 ? "url(#glowGold)" : "url(#glowTeal)"
  }));

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
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

          {/* High performance radial gradients */}
          <radialGradient id="glowGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.8)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
          <radialGradient id="glowTeal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.8)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
          <radialGradient id="glowPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(217, 70, 239, 0.8)" />
            <stop offset="100%" stopColor="rgba(217, 70, 239, 0)" />
          </radialGradient>
          <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFF4D6" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Dynamic Storm Trunk - Bending in the wind */}
        <g style={{ transformOrigin: "450px 900px", animation: "treeSway 6s ease-in-out infinite alternate" }}>
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

          {/* Tree Trunk & Branches */}
          <g stroke="url(#branchGradient)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" className="tree-branch">
            <path d="M450 900 Q 400 600, 280 450 Q 150 350, -50 200" />
            <path d="M420 600 Q 550 450, 600 280" strokeWidth="16" />
            <path d="M360 520 Q 420 350, 420 180" strokeWidth="14" />
            <path d="M250 420 Q 150 300, 150 150" strokeWidth="12" />
            <path d="M500 450 Q 650 250, 850 350" strokeWidth="12" />
            <path d="M600 350 Q 700 250, 750 180" strokeWidth="10" />
            <path d="M120 300 Q 50 250, 50 300" strokeWidth="8" />
            <path d="M350 250 Q 320 150, 280 80" strokeWidth="8" />
          </g>
        </g>
        
        {/* Embers */}
        {embers.map((ember) => (
          <circle
            key={"ember-" + ember.id}
            cx={ember.cx}
            cy={ember.cy}
            r={ember.r * 2.5}
            fill={ember.color}
            className="float-particle"
          />
        ))}

        {/* Glowing Canopy Clusters - Attached to the swaying tree */}
        <g style={{ transformOrigin: "450px 900px", animation: "treeSway 6s ease-in-out infinite alternate" }}>
          {leaves.map((leaf) => (
            <g
              key={leaf.id}
              className="glow-leaf"
              style={{
                transformOrigin: leaf.cx + "px " + leaf.cy + "px",
                animation: "stormSway " + leaf.swayDuration + "s ease-in-out infinite alternate " + leaf.delay + "s",
              }}
            >
              <circle cx={leaf.cx} cy={leaf.cy} r={leaf.r * 4.5} fill={leaf.gradientId} />
              <circle
                cx={leaf.cx}
                cy={leaf.cy}
                r={leaf.r}
                fill={leaf.coreColor}
                style={{
                  animation: "pulseGlow " + leaf.pulseDuration + "s ease-in-out infinite alternate " + leaf.delay + "s"
                }}
              />
            </g>
          ))}
        </g>

        {/* Requested Quote: WISDOM WITH KNOWLEDGE AND TREE OF WISDOM */}
        <text x="350" y="800" fontFamily="Space Grotesk, sans-serif" fontSize="24" fontWeight="bold" fill="url(#textGrad)" letterSpacing="4" style={{ animation: "pulseGlow 4s infinite alternate" }}>
          WISDOM WITH KNOWLEDGE AND TREE OF WISDOM
        </text>
      </svg>

      {/* Highly Realistic 3D Student Character */}
      <div className="absolute bottom-[2%] right-[5%] z-10 w-[450px] h-[450px] character-fade scale-125">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="headGlow" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFF4D6" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="90%" stopColor="#8B6F1F" />
              <stop offset="100%" stopColor="#3A2800" />
            </radialGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="40%" stopColor="#8B6F1F" />
              <stop offset="100%" stopColor="#0B0A14" />
            </linearGradient>
            <linearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FFF4D6" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            <radialGradient id="shadowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
            </radialGradient>
          </defs>
          
          {/* Fast Shadow */}
          <ellipse cx="250" cy="420" rx="160" ry="30" fill="rgba(0,0,0,0.8)" />
          <circle cx="250" cy="400" r="160" fill="url(#shadowGlow)" />
          
          {/* Desk / Base - 3D Cylinder Shape */}
          <path d="M100 420 Q 100 240, 250 240 Q 400 240, 400 420 Z" fill="url(#bodyGrad)" />
          <path d="M120 280 L 100 420 L 400 420 L 380 280 Z" fill="rgba(0,0,0,0.3)" />
          
          {/* Arms/Shoulders */}
          <path d="M160 290 Q 130 350, 160 400" stroke="#8B6F1F" strokeWidth="25" strokeLinecap="round" />
          <path d="M340 290 Q 370 350, 340 400" stroke="#8B6F1F" strokeWidth="25" strokeLinecap="round" />
          
          {/* Glowing Head - High 3D Depth */}
          <circle cx="250" cy="175" r="60" fill="url(#headGlow)" />
          
          {/* Graduation Hat - 3D */}
          {/* Tassel */}
          <path d="M250 100 Q 330 120, 330 160" stroke="#FFF4D6" strokeWidth="5" fill="none" />
          <circle cx="330" cy="165" r="7" fill="#F0D878" />
          {/* Cap Base */}
          <path d="M190 125 Q 250 135, 310 125 L 290 160 Q 250 170, 210 160 Z" fill="#0B0A14" />
          {/* Cap Top (Diamond) with 3D edge */}
          <path d="M250 85 L 355 125 L 250 165 L 145 125 Z" fill="#130E2E" stroke="#D4AF37" strokeWidth="4" strokeLinejoin="round" />
          <path d="M250 90 L 340 125 L 250 160 L 160 125 Z" fill="#1A162B" />
          
          {/* 3D Open Book */}
          <path d="M150 340 L 350 340 L 320 410 L 180 410 Z" fill="url(#bookGrad)" />
          {/* Pages Edge */}
          <path d="M150 340 L 160 330 L 360 330 L 350 340 Z" fill="#D4AF37" />
          {/* Book Spine */}
          <path d="M250 330 L 250 410" stroke="#8B6F1F" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
