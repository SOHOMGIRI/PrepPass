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

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 35%, transparent 65%)`;
      glare.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (card) {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      setTimeout(() => { if (card) card.style.transition = "transform 0.1s ease-out"; }, 600);
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
          50% { transform: perspective(800px) translateY(-22px) rotateX(-1deg) rotateY(2deg); }
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
          0% { top: 5%; opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { top: 92%; opacity: 0; }
        }
        @keyframes borderShift {
          0%, 100% {
            border-color: rgba(212, 175, 55, 0.6);
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.25), 0 0 80px rgba(212, 175, 55, 0.1), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          }
          33% {
            border-color: rgba(45, 212, 191, 0.5);
            box-shadow: 0 0 30px rgba(45, 212, 191, 0.2), 0 0 80px rgba(45, 212, 191, 0.08), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          }
          66% {
            border-color: rgba(168, 85, 247, 0.5);
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.2), 0 0 80px rgba(168, 85, 247, 0.08), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          }
        }
        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes holoShine {
          0% { left: -80%; }
          100% { left: 180%; }
        }
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 87%; }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.15); }
          50% { box-shadow: 0 0 15px rgba(212,175,55,0.6), 0 0 35px rgba(212,175,55,0.25); }
        }
        @keyframes tagFadeIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes outerGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .admit-card-wrap {
          animation: cardFloat 7s ease-in-out infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .admit-card-wrap:hover {
          animation: none;
        }
        .admit-card-inner {
          animation: borderShift 8s ease-in-out infinite;
        }
        .shimmer-bar {
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s linear infinite;
        }
        .scan-line {
          animation: scanLine 5s ease-in-out infinite;
        }
        .progress-fill {
          animation: progressFill 2s ease-out 0.5s both, progressGlow 3s ease-in-out infinite;
        }
        .skill-tag {
          opacity: 0;
          animation: tagFadeIn 0.5s ease-out both;
        }
      `}} />

      {/* Outer glow ring behind card */}
      <div className="absolute w-[340px] h-[450px] sm:w-[420px] sm:h-[540px] rounded-3xl pointer-events-none"
           style={{
             background: "radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)",
             filter: "blur(30px)",
             animation: "outerGlow 4s ease-in-out infinite",
           }} />

      {/* The Card */}
      <div
        ref={cardRef}
        className="admit-card-wrap pointer-events-auto relative w-[320px] h-[430px] sm:w-[390px] sm:h-[510px] cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{ transition: "transform 0.1s ease-out" }}
      >
        {/* Main card surface */}
        <div className="admit-card-inner relative w-full h-full rounded-2xl overflow-hidden"
             style={{
               background: "linear-gradient(160deg, #1a1040 0%, #0f0a24 35%, #0c0820 60%, #110d2a 100%)",
               border: "2px solid rgba(212, 175, 55, 0.5)",
               backdropFilter: "blur(20px)",
             }}>

          {/* Visible gradient color wash */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
               style={{
                 background: "radial-gradient(ellipse at 15% 10%, rgba(212,175,55,0.12) 0%, transparent 45%), radial-gradient(ellipse at 85% 90%, rgba(45,212,191,0.1) 0%, transparent 45%), radial-gradient(ellipse at 90% 15%, rgba(168,85,247,0.08) 0%, transparent 40%)",
               }} />

          {/* Top edge highlight */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
               style={{
                 background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), rgba(45,212,191,0.3), rgba(168,85,247,0.3), transparent)",
               }} />

          {/* Holographic shine sweep */}
          <div className="absolute top-0 h-full w-[60%] pointer-events-none"
               style={{
                 background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 45%, rgba(212,175,55,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 70%)",
                 animation: "holoShine 5s ease-in-out infinite",
               }} />

          {/* Glare (cursor-following) */}
          <div ref={glareRef}
               className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
               style={{ opacity: 0 }} />

          {/* Corner accents — different colors */}
          <div className="absolute top-0 left-0 w-16 h-16" style={{ borderTop: "2px solid rgba(212,175,55,0.7)", borderLeft: "2px solid rgba(212,175,55,0.7)", borderRadius: "16px 0 0 0", animation: "cornerPulse 3s ease-in-out infinite" }} />
          <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: "2px solid rgba(45,212,191,0.6)", borderRight: "2px solid rgba(45,212,191,0.6)", borderRadius: "0 16px 0 0", animation: "cornerPulse 3s ease-in-out infinite 0.75s" }} />
          <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: "2px solid rgba(168,85,247,0.6)", borderLeft: "2px solid rgba(168,85,247,0.6)", borderRadius: "0 0 0 16px", animation: "cornerPulse 3s ease-in-out infinite 1.5s" }} />
          <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: "2px solid rgba(212,175,55,0.7)", borderRight: "2px solid rgba(212,175,55,0.7)", borderRadius: "0 0 16px 0", animation: "cornerPulse 3s ease-in-out infinite 2.25s" }} />

          {/* Scan line */}
          <div className="scan-line absolute left-5 right-5 h-[1px] z-20"
               style={{
                 position: "absolute",
                 background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(45,212,191,0.4), transparent)",
               }} />

          {/* ─── HEADER ─── */}
          <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4"
               style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-sm sm:text-base tracking-[0.25em] font-bold"
                    style={{
                      background: "linear-gradient(135deg, #F0D878, #D4AF37, #FFD700)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 0 8px rgba(212,175,55,0.3))",
                    }}>
                  PREPPASS
                </h3>
                <p className="text-[9px] sm:text-[10px] text-white/35 tracking-[0.15em] mt-0.5 font-mono">PLACEMENT ADMIT CARD</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                   style={{
                     background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(45,212,191,0.1))",
                     border: "1px solid rgba(212,175,55,0.3)",
                     boxShadow: "0 0 15px rgba(212,175,55,0.1)",
                   }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div className="shimmer-bar mt-3 h-[1px] w-full" />
          </div>

          {/* ─── BODY ─── */}
          <div className="relative px-5 sm:px-6 pt-4 sm:pt-5 space-y-3 sm:space-y-4">

            {/* Candidate */}
            <div>
              <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>Candidate</p>
              <p className="text-white font-heading text-sm sm:text-base tracking-wide font-semibold">YOUR NAME HERE</p>
            </div>

            {/* Row 1 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>Exam</p>
                <p className="text-white/85 text-xs sm:text-sm font-medium">Mock Interview</p>
              </div>
              <div className="flex-1">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>Role</p>
                <p className="text-white/85 text-xs sm:text-sm font-medium">Full Stack Dev</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>Session</p>
                <p className="text-white/85 text-xs sm:text-sm font-medium">AI-Adaptive</p>
              </div>
              <div className="flex-1">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>Questions</p>
                <p className="text-white/85 text-xs sm:text-sm font-medium">4 Rounds</p>
              </div>
            </div>

            {/* Readiness Score */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(212,175,55,0.5)" }}>Readiness Score</p>
                <p className="text-sm sm:text-base font-bold font-heading"
                   style={{
                     background: "linear-gradient(90deg, #D4AF37, #F0D878)",
                     WebkitBackgroundClip: "text",
                     WebkitTextFillColor: "transparent",
                   }}>87%</p>
              </div>
              <div className="w-full h-2 sm:h-2.5 rounded-full overflow-hidden"
                   style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="progress-fill h-full rounded-full"
                     style={{
                       background: "linear-gradient(90deg, #8B6F1F, #D4AF37, #F0D878, #2DD4BF)",
                     }} />
              </div>
            </div>

            {/* Skills — each with its own glow */}
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
                  className="skill-tag px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold tracking-wider"
                  style={{
                    background: `rgba(${skill.color}, 0.12)`,
                    border: `1px solid rgba(${skill.color}, 0.35)`,
                    color: `rgba(${skill.color}, 1)`,
                    boxShadow: `0 0 10px rgba(${skill.color}, 0.08)`,
                    animationDelay: `${1.2 + i * 0.15}s`,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* ─── FOOTER ─── */}
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 py-3 sm:py-4"
               style={{
                 borderTop: "1px solid rgba(212,175,55,0.12)",
                 background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.04))",
               }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center"
                     style={{
                       background: "rgba(34, 197, 94, 0.15)",
                       boxShadow: "0 0 15px rgba(34, 197, 94, 0.2), 0 0 30px rgba(34, 197, 94, 0.08)",
                       animation: "checkBounce 2.5s ease-in-out infinite",
                     }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-heading tracking-[0.15em] font-bold"
                      style={{
                        background: "linear-gradient(90deg, #22c55e, #4ade80)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "statusPulse 2s ease-in-out infinite",
                      }}>
                  READY
                </span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-white/20 tracking-widest font-mono">PREP-2025-ADMIT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
