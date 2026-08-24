const fs = require('fs');
let content = fs.readFileSync('client/src/components/GlobalBackground.jsx', 'utf8');

const audioImports = `
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
`;
content = content.replace('import ParticleCanvas', audioImports + 'import ParticleCanvas');

const audioState = `
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
`;
content = content.replace('export default function GlobalBackground() {', audioState);

const audioJSX = `
      {/* Sitewide Background Audio */}
      <audio ref={audioRef} loop src="https://upload.wikimedia.org/wikipedia/commons/2/29/A_Journey_Through_the_Universe.ogg" />
      
      <button 
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full bg-[#130E2E]/80 backdrop-blur-md border border-gold/30 text-gold hover:bg-gold/20 transition-all hover:scale-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] pointer-events-auto cursor-pointer"
        title="Toggle Background Music"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <ParticleCanvas />
`;
content = content.replace('<ParticleCanvas />', audioJSX);
fs.writeFileSync('client/src/components/GlobalBackground.jsx', content, 'utf8');
