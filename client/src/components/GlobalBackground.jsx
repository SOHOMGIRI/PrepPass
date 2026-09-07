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
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsMuted(true);
          }
        }, 3500);
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
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
      
      <button 
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full bg-[#130E2E]/80 backdrop-blur-md border border-gold/30 text-gold hover:bg-gold/20 transition-all hover:scale-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] pointer-events-auto cursor-pointer"
        title="Toggle Background Music"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Global animated gradient orbs — visible across entire site */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes globalOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15vw, 10vh) scale(1.3); }
          50% { transform: translate(5vw, -8vh) scale(1.1); }
          75% { transform: translate(-10vw, 5vh) scale(0.9); }
        }
        @keyframes globalOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-12vw, -8vh) scale(1.2); }
          50% { transform: translate(-5vw, 12vh) scale(0.85); }
          75% { transform: translate(8vw, -5vh) scale(1.15); }
        }
        @keyframes globalOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(8vw, 12vh) scale(1.15); }
          50% { transform: translate(-12vw, -5vh) scale(0.9); }
          75% { transform: translate(5vw, -10vh) scale(1.1); }
        }
      `}} />

      {/* Gold orb — top left area */}
      <div style={{
        position: "fixed", top: "-10%", left: "-10%",
        width: "60vw", height: "60vw", maxWidth: "900px", maxHeight: "900px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 35%, transparent 65%)",
        filter: "blur(80px)",
        animation: "globalOrb1 25s ease-in-out infinite",
      }} />
      {/* Teal orb — bottom right area */}
      <div style={{
        position: "fixed", bottom: "-15%", right: "-10%",
        width: "50vw", height: "50vw", maxWidth: "800px", maxHeight: "800px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,212,191,0.18) 0%, rgba(45,212,191,0.06) 35%, transparent 65%)",
        filter: "blur(70px)",
        animation: "globalOrb2 30s ease-in-out infinite",
      }} />
      {/* Purple orb — center */}
      <div style={{
        position: "fixed", top: "30%", right: "20%",
        width: "40vw", height: "40vw", maxWidth: "650px", maxHeight: "650px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 35%, transparent 65%)",
        filter: "blur(60px)",
        animation: "globalOrb3 20s ease-in-out infinite",
      }} />

      <ParticleCanvas />

    </div>
  );
}
