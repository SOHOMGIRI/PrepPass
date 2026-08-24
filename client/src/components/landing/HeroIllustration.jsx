import React, { useEffect, useRef, useState } from "react";

export default function HeroIllustration() {
  const containerRef = useRef(null);
  const [leaves, setLeaves] = useState([]);
  const [embers, setEmbers] = useState([]);
  const [butterflies, setButterflies] = useState([]);

  useEffect(() => {
    // Generate beautiful thick canopy
    const generatedLeaves = [];
    
    // Expand clusters heavily to the left to shade the text
    const clusters = [
      { cx: 350, cy: 150, r: 180, count: 60 },
      { cx: 200, cy: 250, r: 150, count: 50 },
      { cx: 500, cy: 200, r: 140, count: 50 },
      { cx: 650, cy: 300, r: 120, count: 40 },
      { cx: 100, cy: 350, r: 120, count: 40 },
      { cx: 400, cy: 50,  r: 140, count: 40 },
      { cx: 800, cy: 350, r: 100, count: 30 },
      // NEW LEFT-EXTENDING CLUSTERS (Shading the text)
      { cx: -100, cy: 180, r: 160, count: 50 },
      { cx: -250, cy: 250, r: 140, count: 40 },
      { cx: -400, cy: 150, r: 150, count: 40 },
      { cx: -550, cy: 220, r: 120, count: 30 },
      { cx: 0,    cy: 100, r: 150, count: 40 },
      // Extreme left clusters
      { cx: -600, cy: 100, r: 150, count: 30 },
      { cx: -700, cy: 250, r: 100, count: 20 }
    ];

    const gradients = ["url(#glowGold)", "url(#glowTeal)", "url(#glowPink)", "url(#glowAmber)"];
    const cores = ["#FFF4D6", "#E0F2FE", "#FCE7F3", "#FEF3C7"];

    let idCounter = 0;
    clusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * cluster.r;
        const cx = cluster.cx + Math.cos(angle) * radius;
        const cy = cluster.cy + Math.sin(angle) * radius;
        
        const gIdx = Math.floor(Math.random() * gradients.length);
        
        generatedLeaves.push({
          id: idCounter++,
          cx,
          cy,
          r: Math.random() * 4 + 3, // slightly bigger
          gradientId: gradients[gIdx],
          coreColor: cores[gIdx],
          delay: Math.random() * 2,
          swayDuration: Math.random() * 2 + 3,
          pulseDuration: Math.random() * 2 + 2,
        });
      }
    });
    setLeaves(generatedLeaves);

    // Generate blowing embers
    const genEmbers = [];
    for (let i = 0; i < 40; i++) {
      genEmbers.push({
        id: i,
        cx: (Math.random() * 1800) - 800, // span entire extended width
        cy: Math.random() * 1000,
        r: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? "#D4AF37" : "#F0D878",
      });
    }
    setEmbers(genEmbers);

    // Generate glowing butterflies
    const genButterflies = [];
    for (let i = 0; i < 15; i++) {
      genButterflies.push({
        id: i,
        cx: (Math.random() * 1500) - 600,
        cy: Math.random() * 600,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 4,
        scale: Math.random() * 0.5 + 0.5,
        color: gradients[Math.floor(Math.random() * gradients.length)]
      });
    }
    setButterflies(genButterflies);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes treeSwayBase {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(4deg); }
        }
        @keyframes leafFlutter {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          100% { transform: translate(8px, -15px) scale(1.1); opacity: 1; }
        }
        @keyframes tasselSwing {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(15deg); }
        }
        @keyframes headBob {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(5px) rotate(2deg); }
        }
        @keyframes pulseCore {
          0% { opacity: 0.7; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes butterflyFlight {
          0% { transform: translate(0, 0) rotate(0deg) scale(var(--s)); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(150px, -100px) rotate(15deg) scale(var(--s)); }
          90% { opacity: 1; }
          100% { transform: translate(300px, -200px) rotate(-10deg) scale(var(--s)); opacity: 0; }
        }
        @keyframes wingFlap {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.1); }
        }
      `}} />

      <svg
        viewBox="-100 0 1100 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full opacity-100 overflow-visible transform scale-110 sm:scale-[1.3] -translate-x-4 sm:-translate-x-[5%]"
      >
        <defs>
          <linearGradient id="branchGradient" x1="500" y1="900" x2="350" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B6F1F" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F0D878" />
          </linearGradient>

          {/* Ultra-rich radial gradients for the canopy */}
          <radialGradient id="glowGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.9)" />
            <stop offset="60%" stopColor="rgba(212, 175, 55, 0.4)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
          <radialGradient id="glowTeal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.9)" />
            <stop offset="60%" stopColor="rgba(20, 184, 166, 0.4)" />
            <stop offset="100%" stopColor="rgba(15, 118, 110, 0)" />
          </radialGradient>
          <radialGradient id="glowPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.9)" />
            <stop offset="60%" stopColor="rgba(219, 39, 119, 0.4)" />
            <stop offset="100%" stopColor="rgba(190, 24, 93, 0)" />
          </radialGradient>
          <radialGradient id="glowAmber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 158, 11, 0.9)" />
            <stop offset="60%" stopColor="rgba(217, 119, 6, 0.4)" />
            <stop offset="100%" stopColor="rgba(180, 83, 9, 0)" />
          </radialGradient>

          <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F0D878" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Dynamic Bent Trunk */}
        <g style={{ transformOrigin: "500px 900px", animation: "treeSwayBase 7s ease-in-out infinite alternate" }}>
          
          {/* Shadow/Backdrop of Trunk for 3D depth */}
          <g stroke="rgba(0,0,0,0.6)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "translateX(8px) translateY(8px)" }}>
            {/* Main bent trunk */}
            <path d="M500 900 Q 650 500, 350 50" />
            {/* Thick Branches */}
            <path d="M530 650 Q 750 500, 850 350" strokeWidth="18" />
            <path d="M480 500 Q 200 400, 100 250" strokeWidth="16" />
            <path d="M420 350 Q 600 250, 650 150" strokeWidth="14" />
            <path d="M380 200 Q 250 150, 200 50" strokeWidth="12" />

            {/* Massive branches extending left to shade text */}
            <path d="M280 400 Q 0 300, -200 250" strokeWidth="14" />
            <path d="M-50 290 Q -250 200, -400 150" strokeWidth="12" />
            <path d="M-150 240 Q -400 150, -550 200" strokeWidth="10" />
            <path d="M120 260 Q -50 150, -100 100" strokeWidth="10" />
            <path d="M-200 250 Q -300 350, -450 300" strokeWidth="8" />
            <path d="M-400 150 Q -600 100, -750 120" strokeWidth="8" />
          </g>

          {/* Foreground Golden Trunk & Branches */}
          <g stroke="url(#branchGradient)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
            {/* Main bent trunk */}
            <path d="M500 900 Q 650 500, 350 50" />
            {/* Thick Branches */}
            <path d="M530 650 Q 750 500, 850 350" strokeWidth="16" />
            <path d="M480 500 Q 200 400, 100 250" strokeWidth="14" />
            <path d="M420 350 Q 600 250, 650 150" strokeWidth="12" />
            <path d="M380 200 Q 250 150, 200 50" strokeWidth="10" />
            
            {/* Secondary intricate branches */}
            <path d="M640 570 Q 700 450, 650 350" strokeWidth="8" />
            <path d="M340 450 Q 250 350, 300 250" strokeWidth="8" />
            <path d="M510 300 Q 550 200, 480 120" strokeWidth="6" />
            <path d="M750 425 Q 850 400, 950 300" strokeWidth="6" />
            <path d="M150 325 Q 50 250, 20 150" strokeWidth="6" />

            {/* Massive branches extending left to shade text */}
            <path d="M280 400 Q 0 300, -200 250" strokeWidth="12" />
            <path d="M-50 290 Q -250 200, -400 150" strokeWidth="10" />
            <path d="M-150 240 Q -400 150, -550 200" strokeWidth="8" />
            <path d="M120 260 Q -50 150, -100 100" strokeWidth="8" />
            <path d="M-200 250 Q -300 350, -450 300" strokeWidth="6" />
            <path d="M-400 150 Q -600 100, -750 120" strokeWidth="6" />
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
            style={{ animation: `pulseCore ${Math.random() * 2 + 1}s infinite alternate` }}
          />
        ))}

        {/* Glowing Butterflies */}
        {butterflies.map(b => (
          <g 
            key={"bf-" + b.id} 
            style={{ 
              "--s": b.scale, 
              animation: `butterflyFlight ${b.duration}s ease-in infinite ${b.delay}s`,
              transformOrigin: `${b.cx}px ${b.cy}px`,
              opacity: 0
            }}
          >
            <g style={{ animation: `wingFlap 0.2s infinite alternate`, transformOrigin: `${b.cx}px ${b.cy}px` }}>
              <path d={`M${b.cx} ${b.cy} Q${b.cx-15} ${b.cy-15}, ${b.cx-10} ${b.cy-20} Q${b.cx} ${b.cy-10}, ${b.cx} ${b.cy}`} fill={b.color} />
              <path d={`M${b.cx} ${b.cy} Q${b.cx+15} ${b.cy-15}, ${b.cx+10} ${b.cy-20} Q${b.cx} ${b.cy-10}, ${b.cx} ${b.cy}`} fill={b.color} />
            </g>
            {/* Glowing core */}
            <circle cx={b.cx} cy={b.cy} r={2} fill="#FFF" style={{ filter: "drop-shadow(0 0 5px white)" }} />
          </g>
        ))}

        {/* Hyper-Dense Glowing Canopy */}
        <g style={{ transformOrigin: "500px 900px", animation: "treeSwayBase 7s ease-in-out infinite alternate" }}>
          {leaves.map((leaf) => (
            <g
              key={leaf.id}
              style={{
                transformOrigin: leaf.cx + "px " + leaf.cy + "px",
                animation: `leafFlutter ${leaf.swayDuration}s ease-in-out infinite alternate ${leaf.delay}s`,
              }}
            >
              <circle cx={leaf.cx} cy={leaf.cy} r={leaf.r * 6} fill={leaf.gradientId} />
              <circle
                cx={leaf.cx}
                cy={leaf.cy}
                r={leaf.r * 1.5}
                fill={leaf.coreColor}
                style={{
                  animation: `pulseCore ${leaf.pulseDuration}s ease-in-out infinite alternate ${leaf.delay}s`
                }}
              />
            </g>
          ))}
        </g>

        {/* Requested Quote */}
        <text x="350" y="850" fontFamily="Space Grotesk, sans-serif" fontSize="28" fontWeight="900" fill="url(#textGrad)" letterSpacing="5" style={{ animation: "pulseCore 4s infinite alternate", filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.8))" }}>
          WISDOM WITH KNOWLEDGE AND TREE OF WISDOM
        </text>
      </svg>

      {/* Highly Realistic 3D Student Character */}
      <div className="absolute -bottom-10 right-0 sm:right-[5%] z-10 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] character-fade sm:scale-125">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="headGlow" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFF4D6" />
              <stop offset="30%" stopColor="#D4AF37" />
              <stop offset="80%" stopColor="#8B6F1F" />
              <stop offset="100%" stopColor="#2A1D00" />
            </radialGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#8B6F1F" />
              <stop offset="100%" stopColor="#0B0A14" />
            </linearGradient>
            <linearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FFF4D6" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            <radialGradient id="shadowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(212, 175, 55, 0.5)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
            </radialGradient>
            <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="50%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>
          </defs>
          
          {/* Fast Shadow */}
          <ellipse cx="250" cy="420" rx="170" ry="35" fill="rgba(0,0,0,0.8)" />
          <circle cx="250" cy="400" r="170" fill="url(#shadowGlow)" />
          
          {/* Desk / Base - 3D Cylinder Shape */}
          <path d="M100 420 Q 100 240, 250 240 Q 400 240, 400 420 Z" fill="url(#bodyGrad)" />
          {/* Shading for robes */}
          <path d="M120 280 L 100 420 L 400 420 L 380 280 Z" fill="rgba(0,0,0,0.4)" />
          <path d="M250 240 L 250 420" stroke="rgba(0,0,0,0.3)" strokeWidth="15" />
          
          {/* Arms/Shoulders */}
          <path d="M150 290 Q 110 350, 140 420" stroke="#8B6F1F" strokeWidth="30" strokeLinecap="round" />
          <path d="M350 290 Q 390 350, 360 420" stroke="#8B6F1F" strokeWidth="30" strokeLinecap="round" />
          
          {/* Head & Hat - Animated Bobbing */}
          <g style={{ transformOrigin: "250px 240px", animation: "headBob 3s ease-in-out infinite alternate" }}>
            {/* Glowing Head - High 3D Depth */}
            <circle cx="250" cy="175" r="65" fill="url(#headGlow)" />
            
            {/* High-Tech Glowing Visor/Glasses (Wisdom/Focus) */}
            <rect x="200" y="155" width="100" height="25" rx="10" fill="rgba(10,6,30,0.9)" stroke="url(#visorGrad)" strokeWidth="3" />
            <circle cx="225" cy="167.5" r="6" fill="#2DD4BF" style={{ animation: "pulseCore 2s infinite alternate" }} />
            <circle cx="275" cy="167.5" r="6" fill="#2DD4BF" style={{ animation: "pulseCore 2s infinite alternate 1s" }} />

            {/* Graduation Hat - 3D */}
            {/* Tassel Base */}
            <circle cx="250" cy="125" r="8" fill="#F0D878" />
            {/* Animated Tassel */}
            <g style={{ transformOrigin: "250px 125px", animation: "tasselSwing 2.5s ease-in-out infinite alternate" }}>
              <path d="M250 125 Q 260 150, 270 190" stroke="#FFF4D6" strokeWidth="4" fill="none" />
              <path d="M265 190 L 275 190 L 270 210 Z" fill="#F0D878" />
            </g>

            {/* Cap Base */}
            <path d="M190 125 Q 250 135, 310 125 L 290 165 Q 250 175, 210 165 Z" fill="#050314" />
            {/* Cap Top (Diamond) with 3D edge */}
            <path d="M250 80 L 360 125 L 250 170 L 140 125 Z" fill="#130E2E" stroke="#D4AF37" strokeWidth="5" strokeLinejoin="round" />
            <path d="M250 85 L 345 125 L 250 165 L 155 125 Z" fill="#1A162B" />
          </g>

          {/* 3D Open Book */}
          <path d="M120 340 L 380 340 L 340 420 L 160 420 Z" fill="url(#bookGrad)" />
          {/* Pages Edge */}
          <path d="M120 340 L 130 330 L 390 330 L 380 340 Z" fill="#F0D878" />
          
          {/* Right Page (Flipping) */}
          <path d="M250 330 L 390 330 L 380 340 L 250 420 Z" fill="#FFF4D6" style={{ transformOrigin: '250px 420px', animation: 'flipPage 4s ease-in-out infinite' }} />
          
          {/* Book Spine */}
          <path d="M250 330 L 250 420" stroke="#8B6F1F" strokeWidth="10" strokeLinecap="round" />
          
          {/* Hand Turning Page */}
          <g style={{ animation: 'turnHand 4s ease-in-out infinite', transformOrigin: '340px 420px' }}>
            <path d="M280 420 C 260 380, 310 360, 320 390 L 350 470 L 290 470 Z" fill="url(#headGlow)" />
            {/* Fingers shading */}
            <path d="M290 390 L 310 405" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
            <path d="M305 380 L 320 395" stroke="rgba(0,0,0,0.3)" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

