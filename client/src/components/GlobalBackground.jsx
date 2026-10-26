import React from "react";

/**
 * GlobalBackground — Textured Warm Parchment with Vivid Color Nodes
 * Distinct from ÆtherTransit's clean flat white — uses warm sandy parchment
 * with visible dot-grid texture, bold color accent blobs, and a subtle
 * diagonal grain pattern for premium editorial depth.
 */
export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" style={{ backgroundColor: "#F0EBE0" }}>
      {/* Visible Dot Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, #1E293B 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Diagonal Linen Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            rgba(15, 23, 42, 0.1) 8px,
            rgba(15, 23, 42, 0.1) 9px
          )`,
        }}
      />

      {/* Bold Vivid Color Accent Blobs */}
      {/* Top-right: Electric Blue */}
      <div
        className="absolute -top-[8%] right-[5%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-40"
        style={{ background: "radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, transparent 70%)" }}
      />
      {/* Left-center: Vivid Violet */}
      <div
        className="absolute top-[30%] -left-[8%] w-[35vw] h-[35vw] rounded-full blur-[130px] opacity-30"
        style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)" }}
      />
      {/* Bottom-right: Warm Amber */}
      <div
        className="absolute bottom-[5%] right-[15%] w-[30vw] h-[30vw] rounded-full blur-[110px] opacity-35"
        style={{ background: "radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)" }}
      />
      {/* Bottom-left: Cyan accent */}
      <div
        className="absolute bottom-[20%] -left-[5%] w-[25vw] h-[25vw] rounded-full blur-[100px] opacity-25"
        style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%)" }}
      />

      {/* Bottom warm edge vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#E8E0D2]/50 to-transparent" />
    </div>
  );
}
