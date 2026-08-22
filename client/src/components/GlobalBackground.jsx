import { useMouse } from "../context/MouseContext.jsx";
import ParticleCanvas from "./landing/ParticleCanvas.jsx";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A061E]">
      {/* Rich Aurora Gradient Blobs */}
      <div
        className="absolute+-top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-[120px] mix-blend-screen"
        style= {{
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.6) 0%, transparent 70%)", // Rich Indigo
          animation: "aurora-drift-1 12s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full opacity-25 blur-[150px] mix-blend-screen"
        style= {{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)", // Vibrant Pink
          animation: "aurora-drift-2 15s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-20 blur-[130px] mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)", // Deep Cyan
          animation: "aurora-drift-3 10s ease-in-out infinite alternate",
        }}
      />

      {/* Spotlight glow following mouse */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-300"
        style={{
          background: "radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.07) 0%, transparent 100%)",
        }}
      />

      <ParticleCanvas />
    </div>
  );
}
