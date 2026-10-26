import React from "react";

/**
 * GlobalBackground - Rich Warm Architectural Canvas
 * Provides warm champagne alabaster depth with subtle grid guidelines,
 * warm amber sunbeam glows, and celestial sapphire ambient highlights,
 * giving cards and navigation clear, crisp visual separation.
 */
export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#F6F3EB]">
      {/* Architectural Blueprint Grid Guidelines */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            radial-gradient(#1E293B 1.2px, transparent 1.2px),
            linear-gradient(to right, rgba(15, 23, 42, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px, 96px 96px, 96px 96px",
          backgroundPosition: "0 0, 0 0, 0 0"
        }}
      />

      {/* Warm Golden / Aurum Sunbeam Glow at Top-Right */}
      <div 
        className="absolute -top-[12%] -right-[8%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-70 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.12) 45%, transparent 75%)"
        }}
      />
      
      {/* Electric Sapphire & Celestial Blue Ambient Glow on Left */}
      <div 
        className="absolute top-[25%] -left-[12%] w-[55vw] h-[55vw] rounded-full blur-[160px] opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(6, 182, 212, 0.14) 45%, transparent 75%)"
        }}
      />

      {/* Gentle Warm Horizon at Bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#EDE7DC]/70 to-transparent pointer-events-none"
      />
    </div>
  );
}
