import React from "react";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FDFBF7]">
      {/* Subtle Imperial Architectural Grid Watermark */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            radial-gradient(#0A1128 1px, transparent 1px),
            linear-gradient(to right, rgba(10, 17, 40, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(10, 17, 40, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px, 120px 120px, 120px 120px",
          backgroundPosition: "0 0, 0 0, 0 0"
        }}
      />

      {/* Gentle Aurum Ambient Shimmer Orbs */}
      <div 
        className="absolute -top-[15%] -right-[10%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(243, 227, 182, 0.6) 0%, rgba(197, 160, 89, 0.15) 50%, transparent 70%)"
        }}
      />
      
      <div 
        className="absolute top-[40%] -left-[15%] w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-25 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(14, 24, 56, 0.08) 0%, rgba(197, 160, 89, 0.1) 60%, transparent 80%)"
        }}
      />

      {/* Subtle bottom linen vignette */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#F7F4EB]/60 to-transparent pointer-events-none"
      />
    </div>
  );
}
