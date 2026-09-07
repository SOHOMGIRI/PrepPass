import React, { useRef, useCallback, useState } from "react";

export default function HeroIllustration() {
  const tiltRef = useRef(null);
  const glareRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // The tilt effect is applied to the wrapper (tiltRef)
  const handleMouseMove = useCallback((e) => {
    const tiltNode = tiltRef.current;
    const glareNode = glareRef.current;
    if (!tiltNode) return;

    const rect = tiltNode.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Dampen the effect if flipped so it feels heavier/different, or just keep it
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    tiltNode.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

    if (glareNode) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glareNode.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`;
      glareNode.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const tiltNode = tiltRef.current;
    const glareNode = glareRef.current;
    if (tiltNode) {
      tiltNode.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      tiltNode.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      setTimeout(() => { if (tiltNode) tiltNode.style.transition = "transform 0.1s ease-out"; }, 600);
    }
    if (glareNode) glareNode.style.opacity = "0";
  }, []);

  const handleMouseEnter = useCallback(() => {
    const tiltNode = tiltRef.current;
    if (tiltNode) tiltNode.style.transition = "transform 0.1s ease-out";
  }, []);

  const handleClick = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; text-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
        }
        @keyframes scanLine {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 92%; opacity: 0; }
        }
        @keyframes borderShift {
          0%, 100% {
            border-color: rgba(255, 215, 0, 0.8);
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.4), 0 0 120px rgba(255, 215, 0, 0.15), 0 25px 60px rgba(0,0,0,0.8);
          }
          33% {
            border-color: rgba(45, 212, 191, 0.7);
            box-shadow: 0 0 40px rgba(45, 212, 191, 0.35), 0 0 120px rgba(45, 212, 191, 0.12), 0 25px 60px rgba(0,0,0,0.8);
          }
          66% {
            border-color: rgba(168, 85, 247, 0.7);
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.35), 0 0 120px rgba(168, 85, 247, 0.12), 0 25px 60px rgba(0,0,0,0.8);
          }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.5); box-shadow: 0 0 15px currentColor; }
        }
        @keyframes holoShine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 87%; }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.3); }
          50% { box-shadow: 0 0 25px rgba(255,215,0,0.9), 0 0 50px rgba(255,215,0,0.5); }
        }
        @keyframes tagFadeIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes clickHint {
          0%, 100% { opacity: 0; transform: translateY(5px); }
          50% { opacity: 0.8; transform: translateY(0); }
        }
        .float-container {
          animation: cardFloat 6s ease-in-out infinite;
        }
        .flip-container {
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
          position: relative;
        }
        .flip-container.is-flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          overflow: hidden;
          animation: borderShift 8s ease-in-out infinite;
        }
        .card-face-back {
          transform: rotateY(180deg);
        }
        .progress-bar-active {
          animation: progressFill 2s ease-out 0.5s both, progressGlow 3s ease-in-out infinite;
        }
      `}} />

      {/* Bright glowing aura behind the entire card setup */}
      <div className="absolute w-[360px] h-[480px] sm:w-[440px] sm:h-[560px] rounded-full pointer-events-none"
           style={{
             background: "radial-gradient(ellipse, rgba(255,215,0,0.25) 0%, rgba(168,85,247,0.12) 40%, transparent 70%)",
             filter: "blur(50px)",
             animation: "statusPulse 4s ease-in-out infinite",
           }} />

      {/* 1. Float Container */}
      <div className="float-container pointer-events-auto cursor-pointer relative w-[320px] h-[430px] sm:w-[390px] sm:h-[510px]" onClick={handleClick}>
        
        {/* 2. Tilt Container (JS transform) */}
        <div
          ref={tiltRef}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{ transition: "transform 0.1s ease-out", transformStyle: "preserve-3d" }}
        >
          
          {/* 3. Flip Container (CSS transform) */}
          <div className={`flip-container ${isFlipped ? "is-flipped" : ""}`}>
            
            {/* ═══════════ FRONT FACE ═══════════ */}
            <div className="card-face"
                 style={{
                   background: "linear-gradient(155deg, #180F3A 0%, #0F0922 40%, #120A2B 100%)",
                   border: "2.5px solid rgba(255, 215, 0, 0.8)",
                 }}>

              {/* Internal Color Washes */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                   style={{ background: "radial-gradient(ellipse at 10% 10%, rgba(255,215,0,0.2) 0%, transparent 50%), radial-gradient(ellipse at 90% 90%, rgba(45,212,191,0.15) 0%, transparent 50%)" }} />

              {/* Holographic Shine */}
              <div className="absolute top-0 h-full w-[80%] pointer-events-none"
                   style={{
                     background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 45%, rgba(255,215,0,0.1) 50%, rgba(255,255,255,0.06) 55%, transparent 80%)",
                     animation: "holoShine 4s ease-in-out infinite",
                   }} />

              {/* Glare Layer */}
              <div ref={glareRef} className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300" style={{ opacity: 0 }} />

              {/* Bright Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16" style={{ borderTop: "3px solid #FFD700", borderLeft: "3px solid #FFD700", borderRadius: "16px 0 0 0", animation: "cornerPulse 2s ease-in-out infinite", color: "#FFD700" }} />
              <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: "3px solid #2DD4BF", borderRight: "3px solid #2DD4BF", borderRadius: "0 16px 0 0", animation: "cornerPulse 2s ease-in-out infinite 0.5s", color: "#2DD4BF" }} />
              <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: "3px solid #A855F7", borderLeft: "3px solid #A855F7", borderRadius: "0 0 0 16px", animation: "cornerPulse 2s ease-in-out infinite 1s", color: "#A855F7" }} />
              <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: "3px solid #FFD700", borderRight: "3px solid #FFD700", borderRadius: "0 0 16px 0", animation: "cornerPulse 2s ease-in-out infinite 1.5s", color: "#FFD700" }} />

              {/* Scan line */}
              <div className="scan-line absolute left-4 right-4 h-[2px] z-20"
                   style={{ background: "linear-gradient(90deg, transparent, #FFD700, #2DD4BF, transparent)", boxShadow: "0 0 10px #FFD700" }} />

              {/* FRONT: HEADER */}
              <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4" style={{ borderBottom: "1px solid rgba(255,215,0,0.25)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-sm sm:text-base tracking-[0.25em] font-bold"
                        style={{
                          background: "linear-gradient(135deg, #FFF, #FFD700, #FFA500)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          filter: "drop-shadow(0 0 12px rgba(255,215,0,0.6))",
                        }}>PREPPASS</h3>
                    <p className="text-[9px] sm:text-[10px] text-white/50 tracking-[0.15em] mt-0.5 font-mono">PLACEMENT ADMIT CARD</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                       style={{
                         background: "rgba(255,215,0,0.15)",
                         border: "1px solid rgba(255,215,0,0.4)",
                         boxShadow: "0 0 20px rgba(255,215,0,0.2) inset",
                       }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* FRONT: BODY */}
              <div className="relative px-5 sm:px-6 pt-4 sm:pt-5 space-y-4 sm:space-y-5">
                <div>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#FFD700" }}>Candidate</p>
                  <p className="text-white font-heading text-base sm:text-lg tracking-wide font-bold">YOUR NAME HERE</p>
                </div>

                <div className="flex gap-4 sm:gap-6">
                  <div className="flex-1">
                    <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#FFD700" }}>Exam</p>
                    <p className="text-white text-xs sm:text-sm font-semibold">Mock Interview</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "#FFD700" }}>Role</p>
                    <p className="text-white text-xs sm:text-sm font-semibold">Full Stack Dev</p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: "#FFD700" }}>Readiness Score</p>
                    <p className="text-base sm:text-lg font-bold font-heading"
                       style={{ color: "#FFD700", textShadow: "0 0 10px rgba(255,215,0,0.6)" }}>87%</p>
                  </div>
                  <div className="w-full h-2.5 sm:h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="progress-bar-active h-full rounded-full" style={{ background: "linear-gradient(90deg, #B8860B, #FFD700, #FFF)" }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    { name: "React", color: "45, 212, 191" },
                    { name: "Node.js", color: "34, 197, 94" },
                    { name: "MongoDB", color: "168, 85, 247" },
                    { name: "REST API", color: "255, 215, 0" },
                  ].map((skill, i) => (
                    <span key={i} className="skill-tag px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider"
                          style={{
                            background: `rgba(${skill.color}, 0.15)`,
                            border: `1px solid rgba(${skill.color}, 0.6)`,
                            color: `rgba(${skill.color}, 1)`,
                            boxShadow: `0 0 15px rgba(${skill.color}, 0.2) inset`,
                            animationDelay: `${1.2 + i * 0.15}s`,
                          }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* FRONT: FOOTER */}
              <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 py-4"
                   style={{ borderTop: "1px solid rgba(255,215,0,0.2)", background: "rgba(255,215,0,0.05)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                         style={{ background: "rgba(34, 197, 94, 0.2)", boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)", border: "1px solid rgba(34,197,94,0.6)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-sm font-heading tracking-[0.15em] font-bold text-green-400" style={{ textShadow: "0 0 10px rgba(74,222,128,0.5)" }}>READY</span>
                  </div>
                  <p className="text-[9px] text-white/50 tracking-widest font-mono" style={{ animation: "clickHint 2s ease-in-out infinite" }}>TAP TO FLIP ↻</p>
                </div>
              </div>
            </div>

            {/* ═══════════ BACK FACE ═══════════ */}
            <div className="card-face card-face-back"
                 style={{
                   background: "linear-gradient(160deg, #1e1350 0%, #120d2e 35%, #0e0a22 60%, #150f30 100%)",
                   border: "2.5px solid rgba(255, 215, 0, 0.8)",
                 }}>
              
              {/* Internal Color Washes */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                   style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.1) 0%, transparent 40%)" }} />

              <div className="relative h-full flex flex-col items-center justify-center px-8 sm:px-10 text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                     style={{
                       background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(45,212,191,0.15))",
                       border: "2px solid rgba(255,215,0,0.6)",
                       boxShadow: "0 0 40px rgba(255,215,0,0.3)",
                     }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>

                <h3 className="font-heading text-2xl tracking-[0.3em] font-bold mb-4"
                    style={{ color: "#FFD700", textShadow: "0 0 15px rgba(255,215,0,0.5)" }}>PREPPASS</h3>

                <div className="w-32 h-[2px] mb-6" style={{ background: "linear-gradient(90deg, transparent, #FFD700, transparent)" }} />

                <p className="text-white/80 text-sm font-body leading-relaxed mb-8 max-w-[260px]">
                  The complete AI-powered placement prep platform. Practice mock interviews, get instant readiness scores, and walk in confident.
                </p>

                <div className="space-y-3 w-full max-w-[260px]">
                  {[
                    { icon: "🎤", label: "Voice Mock Interviews", color: "45, 212, 191" },
                    { icon: "📄", label: "ATS Resume Scoring", color: "255, 215, 0" },
                    { icon: "🧠", label: "AI Adaptive Questions", color: "168, 85, 247" },
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-xl"
                         style={{ background: `rgba(${feat.color}, 0.1)`, border: `1px solid rgba(${feat.color}, 0.3)` }}>
                      <span className="text-lg">{feat.icon}</span>
                      <span className="text-xs font-bold tracking-wider" style={{ color: `rgba(${feat.color}, 1)` }}>{feat.label}</span>
                    </div>
                  ))}
                </div>

                <p className="absolute bottom-5 text-[9px] text-white/50 tracking-widest font-mono" style={{ animation: "clickHint 2s ease-in-out infinite" }}>
                  TAP TO FLIP BACK ↻
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
