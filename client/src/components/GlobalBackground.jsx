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

      <ParticleCanvas />

    </div>
  );
}


