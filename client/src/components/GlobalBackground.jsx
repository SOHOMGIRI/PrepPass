import { useMouse } from "../context/MouseContext.jsx";

import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ParticleCanvas from "./landing/ParticleCanvas.jsx";


export default function GlobalBackground() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        setIsMuted(false);
      }
    };
    window.addEventListener('click', handleInteraction, { once: true });
    return () => window.removeEventListener('click', handleInteraction);
  }, [hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      if (isMuted && !hasInteracted) {
        audioRef.current.play().catch(e => console.log(e));
        setHasInteracted(true);
      }
      setIsMuted(!isMuted);
    }
  };

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

      
      {/* Sitewide Background Audio */}
      <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
      
      <button 
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full bg-[#130E2E]/80 backdrop-blur-md border border-gold/30 text-gold hover:bg-gold/20 transition-all hover:scale-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] pointer-events-auto cursor-pointer"
        title="Toggle Background Music"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <ParticleCanvas />

    </div>
  );
}


