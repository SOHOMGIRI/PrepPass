import { useMouse } from "../context/MouseContext.jsx";
import ParticleCanvas from "./landing/ParticleCanvas.jsx";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#0A061E]">
      {/* Rich Aurora Gradient Blobs */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30 mix-blend-screen"
        style= {{
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.6) 0%, transparent 70%)",
          animation: "aurora-drift-1 12s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full opacity-25 mix-blend-screen"
        style= {{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)",
          animation: "aurora-drift-2 15s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-20 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)",
          animation: "aurora-drift-3 10s ease-in-out infinite alternate",
        }}
      />

      <ParticleCanvas />
    </div>
  );
}

