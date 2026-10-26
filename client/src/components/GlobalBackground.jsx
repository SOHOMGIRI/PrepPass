import React from "react";

/**
 * GlobalBackground - Luminous & Vibrant Modern Canvas
 * Replaces the pale linen with a bright, energetic ivory surface illuminated
 * with subtle sapphire, cyan, and warm aurum ambient aurora glows.
 */
export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FAF8F5]">
      {/* Delicate Modern Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(#2563EB 1px, transparent 1px),
            linear-gradient(to right, rgba(15, 23, 42, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px, 108px 108px, 108px 108px",
          backgroundPosition: "0 0, 0 0, 0 0"
        }}
      />

      {/* Luminous Top-Right Aurum & Amber Sunbeam Glow */}
      <div 
        className="absolute -top-[10%] -right-[5%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-60 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 70%)"
        }}
      />
      
      {/* Electric Sapphire & Cyan Ambient Aurora on Left */}
      <div 
        className="absolute top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[150px] opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(37, 99, 235, 0.15) 45%, transparent 75%)"
        }}
      />

      {/* Soft Indigo Horizon Vignette */}
      <div 
        className="absolute -bottom-[15%] right-[20%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 75%)"
        }}
      />

      {/* Subtle bottom glass gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"
      />
    </div>
  );
}
