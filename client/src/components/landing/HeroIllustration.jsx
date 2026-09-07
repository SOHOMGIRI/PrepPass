import React, { useRef, useCallback } from "react";

export default function HeroIllustration() {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`;
      glare.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (card) {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
      setTimeout(() => { if (card) card.style.transition = "transform 0.1s ease-out"; }, 500);
    }
    if (glare) glare.style.opacity = "0";
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transition = "transform 0.1s ease-out";
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cardFloat {
          0%, 100% { transform: perspective(800px) translateY(0px) rotateX(1deg) rotateY(-2deg); }
          50% { transform: perspective(800px) translateY(-20px) rotateX(-1deg) rotateY(2deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes scanLine {
          0% { top: 8%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 88%; opacity: 0; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(212, 175, 55, 0.4); box-shadow: 0 0 25px rgba(212, 175, 55, 0.12), 0 0 80px rgba(212, 175, 55, 0.06), inset 0 0 30px rgba(212, 175, 55, 0.04); }
          33% { border-color: rgba(45, 212, 191, 0.35); box-shadow: 0 0 25px rgba(45, 212, 191, 0.12), 0 0 80px rgba(45, 212, 191, 0.06), inset 0 0 30px rgba(45, 212, 191, 0.04); }
          66% { border-color: rgba(168, 85, 247, 0.35); box-shadow: 0 0 25px rgba(168, 85, 247, 0.12), 0 0 80px rgba(168, 85, 247, 0.06), inset 0 0 30px rgba(168, 85, 247, 0.04); }
        }
        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes cornerGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        @keyframes holoShine {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 87%; }
        }
        @keyframes tagFadeIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(0.9); }
          66% { transform: translate(25px, -25px) scale(1.05); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 35px) scale(1.08); }
          66% { transform: translate(-30px, -15px) scale(0.92); }
        }
        .admit-card-idle {
          animation: cardFloat 7s ease-in-out infinite, borderGlow 6s ease-in-out infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .admit-card-idle:hover {
          animation: borderGlow 6s ease-in-out infinite;
        }
        .shimmer-bar {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
        .scan-line {
          animation: scanLine 5s ease-in-out infinite;
        }
        .holo-shine {
          position: absolute;
          top: 0;
          left: -50%;
          width: 50%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), rgba(212,175,55,0.06), transparent);
          transform: rotate(25deg);
          pointer-events: none;
          animation: holoShine 4s ease-in-out infinite;
        }
        .progress-fill {
          animation: progressFill 2s ease-out 0.5s both;
        }
        .skill-tag {
          opacity: 0;
          animation: tagFadeIn 0.4s ease-out both;
        }
      `}} />

      {/* Floating background orbs for visual depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gold orb */}
        <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full opacity-[0.07]"
             style={{
               background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
               top: "-10%", right: "-5%",
               filter: "blur(60px)",
               animation: "orbFloat1 12s ease-in-out infinite",
             }} />
        {/* Teal orb */}
        <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full opacity-[0.06]"
             style={{
               background: "radial-gradient(circle, #2DD4BF 0%, transparent 70%)",
               bottom: "5%", left: "10%",
               filter: "blur(50px)",
               animation: "orbFloat2 15s ease-in-out infinite",
             }} />
        {/* Purple orb */}
        <div className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-[0.05]"
             style={{
               background: "radial-gradient(circle, #A855F7 0%, transparent 70%)",
               top: "40%", right: "30%",
               filter: "blur(40px)",
               animation: "orbFloat3 10s ease-in-out infinite",
             }} />
      </div>

      {/* Floating Admit Card — full 3D interactive */}
      <div
        ref={cardRef}
        className="admit-card-idle pointer-events-auto relative w-[320px] h-[430px] sm:w-[390px] sm:h-[510px] rounded-2xl overflow-hidden cursor-default"
        style={{
          background: "linear-gradient(155deg, rgba(18,14,38,0.97) 0%, rgba(10,6,30,0.98) 40%, rgba(15,10,35,0.97) 100%)",
          border: "1.5px solid rgba(212, 175, 55, 0.4)",
          backdropFilter: "blur(20px)",
          transition: "transform 0.1s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {/* Holographic shine sweep */}
        <div className="holo-shine" />

        {/* Glare layer (follows cursor) */}
        <div
          ref={glareRef}
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: 0 }}
        />

        {/* Gradient overlay — subtle color bleed from corners */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
             style={{
               background: "radial-gradient(ellipse at 0% 0%, rgba(212,175,55,0.06) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(45,212,191,0.05) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(168,85,247,0.04) 0%, transparent 40%)",
             }} />

        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: "rgba(212,175,55,0.5)", animation: "cornerGlow 3s ease-in-out infinite" }} />
        <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: "rgba(45,212,191,0.4)", animation: "cornerGlow 3s ease-in-out infinite 0.75s" }} />
        <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 rounded-bl-2xl" style={{ borderColor: "rgba(168,85,247,0.4)", animation: "cornerGlow 3s ease-in-out infinite 1.5s" }} />
        <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: "rgba(212,175,55,0.5)", animation: "cornerGlow 3s ease-in-out infinite 2.25s" }} />

        {/* Scan line effect */}
        <div className="scan-line absolute left-5 right-5 h-[1px] z-20 bg-gradient-to-r from-transparent via-gold/30 to-transparent" style={{ position: "absolute" }} />

        {/* ─── Header ─── */}
        <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-sm sm:text-base tracking-[0.25em] font-bold"
                  style={{
                    background: "linear-gradient(135deg, #F0D878, #D4AF37, #B8860B)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                PREPPASS
              </h3>
              <p className="text-[9px] sm:text-[10px] text-white/30 tracking-[0.15em] mt-0.5">PLACEMENT ADMIT CARD</p>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                 style={{
                   background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(45,212,191,0.08))",
                   border: "1px solid rgba(212,175,55,0.25)",
                 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/80 sm:w-5 sm:h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <div className="shimmer-bar mt-3 h-[1px] w-full" />
        </div>

        {/* ─── Body ─── */}
        <div className="relative px-5 sm:px-6 pt-4 sm:pt-5 space-y-3 sm:space-y-4">

          {/* Candidate */}
          <div>
            <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase mb-1">Candidate</p>
            <p className="text-white/90 font-heading text-sm sm:text-base tracking-wide">YOUR NAME HERE</p>
          </div>

          {/* Row 1 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase mb-1">Exam</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Mock Interview</p>
            </div>
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase mb-1">Role</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Full Stack Dev</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase mb-1">Session</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium">AI-Adaptive</p>
            </div>
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase mb-1">Questions</p>
              <p className="text-white/80 text-xs sm:text-sm font-medium">4 Rounds</p>
            </div>
          </div>

          {/* Readiness Score */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase">Readiness Score</p>
              <p className="text-xs sm:text-sm font-bold font-heading"
                 style={{
                   background: "linear-gradient(90deg, #D4AF37, #F0D878)",
                   WebkitBackgroundClip: "text",
                   WebkitTextFillColor: "transparent",
                 }}>87%</p>
            </div>
            <div className="w-full h-1.5 sm:h-2 rounded-full overflow-hidden"
                 style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="progress-fill h-full rounded-full"
                   style={{
                     background: "linear-gradient(90deg, #8B6F1F, #D4AF37, #F0D878, #2DD4BF)",
                     boxShadow: "0 0 10px rgba(212,175,55,0.4)",
                   }} />
            </div>
          </div>

          {/* Skills — staggered animation */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            {[
              { name: "React", color: "45, 212, 191" },
              { name: "Node.js", color: "34, 197, 94" },
              { name: "MongoDB", color: "168, 85, 247" },
              { name: "REST API", color: "212, 175, 55" },
              { name: "JWT", color: "59, 130, 246" },
            ].map((skill, i) => (
              <span
                key={i}
                className="skill-tag px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-medium tracking-wider"
                style={{
                  background: `rgba(${skill.color}, 0.08)`,
                  border: `1px solid rgba(${skill.color}, 0.25)`,
                  color: `rgba(${skill.color}, 0.9)`,
                  animationDelay: `${1.2 + i * 0.12}s`,
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 py-3 sm:py-4 border-t border-white/[0.05]"
             style={{ background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.03))" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
                   style={{
                     background: "rgba(34, 197, 94, 0.12)",
                     boxShadow: "0 0 12px rgba(34, 197, 94, 0.15)",
                     animation: "checkBounce 2.5s ease-in-out infinite",
                   }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" className="sm:w-3 sm:h-3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-heading tracking-[0.15em] font-bold"
                    style={{
                      background: "linear-gradient(90deg, #22c55e, #4ade80)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: "statusPulse 2s ease-in-out infinite",
                    }}>
                READY
              </span>
            </div>
            <p className="text-[8px] sm:text-[9px] text-white/15 tracking-widest font-mono">PREP-2025-ADMIT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
