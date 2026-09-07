import React, { useRef, useCallback, useState } from "react";

export default function HeroIllustration() {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (isFlipped) return;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, transparent 60%)`;
      glare.style.opacity = "1";
    }
  }, [isFlipped]);

  const handleMouseLeave = useCallback(() => {
    if (isFlipped) return;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (card) {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      setTimeout(() => { if (card) card.style.transition = "transform 0.1s ease-out"; }, 600);
    }
    if (glare) glare.style.opacity = "0";
  }, [isFlipped]);

  const handleMouseEnter = useCallback(() => {
    if (isFlipped) return;
    const card = cardRef.current;
    if (card) card.style.transition = "transform 0.1s ease-out";
  }, [isFlipped]);

  const handleClick = useCallback(() => {
    setIsFlipped(prev => !prev);
    const card = cardRef.current;
    const glare = glareRef.current;
    if (card) {
      card.style.transition = "none";
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glare) glare.style.opacity = "0";
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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
            border-color: rgba(212, 175, 55, 0.7);
            box-shadow: 0 0 35px rgba(212, 175, 55, 0.3), 0 0 100px rgba(212, 175, 55, 0.1), 0 25px 60px rgba(0,0,0,0.6);
          }
          33% {
            border-color: rgba(45, 212, 191, 0.6);
            box-shadow: 0 0 35px rgba(45, 212, 191, 0.25), 0 0 100px rgba(45, 212, 191, 0.08), 0 25px 60px rgba(0,0,0,0.6);
          }
          66% {
            border-color: rgba(168, 85, 247, 0.6);
            box-shadow: 0 0 35px rgba(168, 85, 247, 0.25), 0 0 100px rgba(168, 85, 247, 0.08), 0 25px 60px rgba(0,0,0,0.6);
          }
        }
        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.5; }
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
          0%, 100% { box-shadow: 0 0 10px rgba(212,175,55,0.4), 0 0 25px rgba(212,175,55,0.15); }
          50% { box-shadow: 0 0 18px rgba(212,175,55,0.7), 0 0 40px rgba(212,175,55,0.3); }
        }
        @keyframes tagFadeIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes outerRingPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.03); }
        }
        @keyframes backPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        @keyframes clickHint {
          0%, 100% { opacity: 0; transform: translateY(5px); }
          50% { opacity: 0.6; transform: translateY(0); }
        }
        .card-float {
          animation: cardFloat 7s ease-in-out infinite;
        }
        .card-flipper {
          transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .card-flipper.flipped {
          transform: rotateY(180deg) !important;
        }
        .card-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute;
          inset: 0;
          border-radius: 16px;
          overflow: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
        .card-inner {
          animation: borderShift 8s ease-in-out infinite;
        }
        .shimmer-bar {
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent);
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

      {/* Outer glow ring */}
      <div className="absolute w-[350px] h-[460px] sm:w-[430px] sm:h-[550px] rounded-3xl pointer-events-none"
           style={{
             background: "radial-gradient(ellipse, rgba(212,175,55,0.18) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)",
             filter: "blur(40px)",
             animation: "outerRingPulse 4s ease-in-out infinite",
           }} />

      {/* Card container with float */}
      <div className="card-float pointer-events-auto cursor-pointer" onClick={handleClick}>
        {/* 3D Flipper */}
        <div
          ref={cardRef}
          className={`card-flipper relative w-[320px] h-[430px] sm:w-[390px] sm:h-[510px]${isFlipped ? " flipped" : ""}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{ transition: "transform 0.1s ease-out", perspective: "800px" }}
        >
          {/* ═══════════ FRONT FACE ═══════════ */}
          <div className="card-face card-inner"
               style={{
                 background: "linear-gradient(160deg, #1e1350 0%, #120d2e 35%, #0e0a22 60%, #150f30 100%)",
                 border: "2px solid rgba(212, 175, 55, 0.6)",
               }}>

            {/* Color washes */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
                 style={{
                   background: "radial-gradient(ellipse at 10% 5%, rgba(212,175,55,0.15) 0%, transparent 45%), radial-gradient(ellipse at 90% 95%, rgba(45,212,191,0.12) 0%, transparent 45%), radial-gradient(ellipse at 90% 10%, rgba(168,85,247,0.1) 0%, transparent 40%)",
                 }} />

            {/* Top edge highlight */}
            <div className="absolute top-0 left-[8%] right-[8%] h-[1px] pointer-events-none"
                 style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(45,212,191,0.4), rgba(168,85,247,0.4), transparent)" }} />

            {/* Holo shine */}
            <div className="absolute top-0 h-full w-[60%] pointer-events-none"
                 style={{
                   background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.05) 45%, rgba(212,175,55,0.06) 50%, rgba(255,255,255,0.04) 55%, transparent 70%)",
                   animation: "holoShine 5s ease-in-out infinite",
                 }} />

            {/* Glare */}
            <div ref={glareRef}
                 className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
                 style={{ opacity: 0 }} />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16" style={{ borderTop: "2.5px solid rgba(212,175,55,0.8)", borderLeft: "2.5px solid rgba(212,175,55,0.8)", borderRadius: "16px 0 0 0", animation: "cornerPulse 3s ease-in-out infinite" }} />
            <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: "2.5px solid rgba(45,212,191,0.7)", borderRight: "2.5px solid rgba(45,212,191,0.7)", borderRadius: "0 16px 0 0", animation: "cornerPulse 3s ease-in-out infinite 0.75s" }} />
            <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: "2.5px solid rgba(168,85,247,0.7)", borderLeft: "2.5px solid rgba(168,85,247,0.7)", borderRadius: "0 0 0 16px", animation: "cornerPulse 3s ease-in-out infinite 1.5s" }} />
            <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: "2.5px solid rgba(212,175,55,0.8)", borderRight: "2.5px solid rgba(212,175,55,0.8)", borderRadius: "0 0 16px 0", animation: "cornerPulse 3s ease-in-out infinite 2.25s" }} />

            {/* Scan line */}
            <div className="scan-line absolute left-5 right-5 h-[1px] z-20"
                 style={{ position: "absolute", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), rgba(45,212,191,0.5), transparent)" }} />

            {/* HEADER */}
            <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4"
                 style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-sm sm:text-base tracking-[0.25em] font-bold"
                      style={{
                        background: "linear-gradient(135deg, #F0D878, #D4AF37, #FFD700)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0 0 10px rgba(212,175,55,0.4))",
                      }}>PREPPASS</h3>
                  <p className="text-[9px] sm:text-[10px] text-white/40 tracking-[0.15em] mt-0.5 font-mono">PLACEMENT ADMIT CARD</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                     style={{
                       background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(45,212,191,0.1))",
                       border: "1px solid rgba(212,175,55,0.35)",
                       boxShadow: "0 0 20px rgba(212,175,55,0.12)",
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

            {/* BODY */}
            <div className="relative px-5 sm:px-6 pt-4 sm:pt-5 space-y-3 sm:space-y-4">
              <div>
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Candidate</p>
                <p className="text-white font-heading text-sm sm:text-base tracking-wide font-semibold">YOUR NAME HERE</p>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="flex-1">
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Exam</p>
                  <p className="text-white/85 text-xs sm:text-sm font-medium">Mock Interview</p>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Role</p>
                  <p className="text-white/85 text-xs sm:text-sm font-medium">Full Stack Dev</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="flex-1">
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Session</p>
                  <p className="text-white/85 text-xs sm:text-sm font-medium">AI-Adaptive</p>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Questions</p>
                  <p className="text-white/85 text-xs sm:text-sm font-medium">4 Rounds</p>
                </div>
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(212,175,55,0.6)" }}>Readiness Score</p>
                  <p className="text-sm sm:text-base font-bold font-heading"
                     style={{ background: "linear-gradient(90deg, #D4AF37, #F0D878)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>87%</p>
                </div>
                <div className="w-full h-2 sm:h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="progress-fill h-full rounded-full" style={{ background: "linear-gradient(90deg, #8B6F1F, #D4AF37, #F0D878, #2DD4BF)" }} />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {[
                  { name: "React", color: "45, 212, 191" },
                  { name: "Node.js", color: "34, 197, 94" },
                  { name: "MongoDB", color: "168, 85, 247" },
                  { name: "REST API", color: "212, 175, 55" },
                  { name: "JWT", color: "59, 130, 246" },
                ].map((skill, i) => (
                  <span key={i} className="skill-tag px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold tracking-wider"
                        style={{
                          background: `rgba(${skill.color}, 0.12)`,
                          border: `1px solid rgba(${skill.color}, 0.4)`,
                          color: `rgba(${skill.color}, 1)`,
                          boxShadow: `0 0 12px rgba(${skill.color}, 0.1)`,
                          animationDelay: `${1.2 + i * 0.15}s`,
                        }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 py-3 sm:py-4"
                 style={{ borderTop: "1px solid rgba(212,175,55,0.15)", background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.05))" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center"
                       style={{ background: "rgba(34, 197, 94, 0.15)", boxShadow: "0 0 18px rgba(34, 197, 94, 0.25)", animation: "checkBounce 2.5s ease-in-out infinite" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-heading tracking-[0.15em] font-bold"
                        style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "statusPulse 2s ease-in-out infinite" }}>
                    READY
                  </span>
                </div>
                <p className="text-[8px] sm:text-[9px] text-white/25 tracking-widest font-mono" style={{ animation: "clickHint 3s ease-in-out infinite" }}>TAP TO FLIP ↻</p>
              </div>
            </div>
          </div>

          {/* ═══════════ BACK FACE ═══════════ */}
          <div className="card-face card-back card-inner"
               style={{
                 background: "linear-gradient(160deg, #1e1350 0%, #120d2e 35%, #0e0a22 60%, #150f30 100%)",
                 border: "2px solid rgba(212, 175, 55, 0.6)",
               }}>

            {/* Color washes */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
                 style={{
                   background: "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(45,212,191,0.1) 0%, transparent 45%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.08) 0%, transparent 40%)",
                 }} />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16" style={{ borderTop: "2.5px solid rgba(212,175,55,0.8)", borderLeft: "2.5px solid rgba(212,175,55,0.8)", borderRadius: "16px 0 0 0", animation: "cornerPulse 3s ease-in-out infinite" }} />
            <div className="absolute top-0 right-0 w-16 h-16" style={{ borderTop: "2.5px solid rgba(45,212,191,0.7)", borderRight: "2.5px solid rgba(45,212,191,0.7)", borderRadius: "0 16px 0 0", animation: "cornerPulse 3s ease-in-out infinite 0.75s" }} />
            <div className="absolute bottom-0 left-0 w-16 h-16" style={{ borderBottom: "2.5px solid rgba(168,85,247,0.7)", borderLeft: "2.5px solid rgba(168,85,247,0.7)", borderRadius: "0 0 0 16px", animation: "cornerPulse 3s ease-in-out infinite 1.5s" }} />
            <div className="absolute bottom-0 right-0 w-16 h-16" style={{ borderBottom: "2.5px solid rgba(212,175,55,0.8)", borderRight: "2.5px solid rgba(212,175,55,0.8)", borderRadius: "0 0 16px 0", animation: "cornerPulse 3s ease-in-out infinite 2.25s" }} />

            {/* Back content */}
            <div className="relative h-full flex flex-col items-center justify-center px-8 sm:px-10 text-center">

              {/* Large logo icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-6"
                   style={{
                     background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(45,212,191,0.12))",
                     border: "1.5px solid rgba(212,175,55,0.4)",
                     boxShadow: "0 0 30px rgba(212,175,55,0.15)",
                   }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold sm:w-10 sm:h-10">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>

              {/* Brand name */}
              <h3 className="font-heading text-xl sm:text-2xl tracking-[0.3em] font-bold mb-3"
                  style={{
                    background: "linear-gradient(135deg, #F0D878, #D4AF37, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 12px rgba(212,175,55,0.4))",
                  }}>PREPPASS</h3>

              {/* Divider */}
              <div className="shimmer-bar w-24 sm:w-32 h-[1px] mb-5" />

              {/* Tagline */}
              <p className="text-white/50 text-xs sm:text-sm font-body leading-relaxed mb-6 max-w-[260px]">
                AI-powered placement prep platform. Practice mock interviews, build your readiness score, and walk in confident.
              </p>

              {/* Feature pills */}
              <div className="space-y-2.5 w-full max-w-[260px]">
                {[
                  { icon: "🎤", label: "Voice Mock Interviews", color: "45, 212, 191" },
                  { icon: "📄", label: "ATS Resume Scoring", color: "212, 175, 55" },
                  { icon: "🧠", label: "AI Adaptive Questions", color: "168, 85, 247" },
                  { icon: "📊", label: "Readiness Analytics", color: "59, 130, 246" },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                       style={{
                         background: `rgba(${feat.color}, 0.06)`,
                         border: `1px solid rgba(${feat.color}, 0.2)`,
                       }}>
                    <span className="text-sm">{feat.icon}</span>
                    <span className="text-[10px] sm:text-xs font-medium tracking-wider" style={{ color: `rgba(${feat.color}, 0.9)` }}>{feat.label}</span>
                  </div>
                ))}
              </div>

              {/* Flip back hint */}
              <p className="absolute bottom-4 text-[8px] sm:text-[9px] text-white/25 tracking-widest font-mono" style={{ animation: "clickHint 3s ease-in-out infinite" }}>
                TAP TO FLIP BACK ↻
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
