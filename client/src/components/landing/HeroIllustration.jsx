import React from "react";

export default function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotateX(2deg) rotateY(-3deg); }
          50% { transform: translateY(-18px) rotateX(-2deg) rotateY(3deg); }
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
          0% { top: 10%; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 85%; opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.15), 0 0 60px rgba(212, 175, 55, 0.08); }
          50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.25), 0 0 80px rgba(212, 175, 55, 0.12); }
        }
        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes cornerGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .admit-card {
          animation: cardFloat 6s ease-in-out infinite, glowPulse 4s ease-in-out infinite;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        .shimmer-bar {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        .scan-line {
          animation: scanLine 4s ease-in-out infinite;
        }
      `}} />

      {/* Floating Admit Card */}
      <div className="admit-card relative w-[320px] h-[420px] sm:w-[380px] sm:h-[490px] rounded-2xl overflow-hidden"
           style={{
             background: "linear-gradient(145deg, rgba(15,12,30,0.95) 0%, rgba(20,16,40,0.98) 100%)",
             border: "1.5px solid rgba(212, 175, 55, 0.35)",
             backdropFilter: "blur(20px)",
           }}>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/50 rounded-tl-2xl" style={{ animation: "cornerGlow 3s ease-in-out infinite" }} />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/50 rounded-tr-2xl" style={{ animation: "cornerGlow 3s ease-in-out infinite 0.5s" }} />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold/50 rounded-bl-2xl" style={{ animation: "cornerGlow 3s ease-in-out infinite 1s" }} />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/50 rounded-br-2xl" style={{ animation: "cornerGlow 3s ease-in-out infinite 1.5s" }} />

        {/* Scan line effect */}
        <div className="scan-line absolute left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" style={{ position: "absolute" }} />

        {/* Header bar */}
        <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4 border-b border-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-gold text-sm sm:text-base tracking-[0.25em] font-bold">PREPPASS</h3>
              <p className="text-[9px] sm:text-[10px] text-white/30 tracking-[0.15em] mt-0.5">PLACEMENT ADMIT CARD</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gold/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/70 sm:w-5 sm:h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          {/* Shimmer bar */}
          <div className="shimmer-bar mt-3 h-[1px] w-full" />
        </div>

        {/* Card body */}
        <div className="px-5 sm:px-6 pt-4 sm:pt-5 space-y-3 sm:space-y-4">

          {/* Candidate row */}
          <div>
            <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase mb-1">Candidate</p>
            <p className="text-white/90 font-heading text-sm sm:text-base tracking-wide">YOUR NAME HERE</p>
          </div>

          {/* Two-column row */}
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

          {/* Two-column row */}
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

          {/* Readiness Score bar */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] sm:text-[10px] text-white/25 tracking-[0.2em] uppercase">Readiness Score</p>
              <p className="text-gold text-xs sm:text-sm font-bold font-heading">87%</p>
            </div>
            <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: "87%",
                background: "linear-gradient(90deg, #8B6F1F, #D4AF37, #F0D878)",
              }} />
            </div>
          </div>

          {/* Skills matched */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            {["React", "Node.js", "MongoDB", "REST API", "JWT"].map((skill, i) => (
              <span key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-medium tracking-wider"
                    style={{
                      background: "rgba(212, 175, 55, 0.08)",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      color: "rgba(212, 175, 55, 0.8)",
                    }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 py-3 sm:py-4 border-t border-gold/15"
             style={{ background: "rgba(212, 175, 55, 0.03)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
                   style={{
                     background: "rgba(34, 197, 94, 0.15)",
                     animation: "checkBounce 2s ease-in-out infinite",
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
            <p className="text-[8px] sm:text-[9px] text-white/20 tracking-widest font-mono">PREP-2025-ADMIT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
