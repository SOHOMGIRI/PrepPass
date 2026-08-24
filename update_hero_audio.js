const fs = require('fs');

let content = fs.readFileSync('client/src/components/landing/Hero.jsx', 'utf8');

content = content.replace('import { ChevronDown } from "lucide-react";', 'import { ChevronDown, Volume2, VolumeX } from "lucide-react";');

const audioState = `
  const heroRef = useRef(null);
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

content = content.replace('const heroRef = useRef(null);', audioState);

const audioJSX = `
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2022/10/25/audio_51c6c0a0c6.mp3" />
      
      {/* Sound Toggle */}
      <button 
        onClick={toggleMute}
        className="absolute top-24 right-6 z-50 p-3 rounded-full bg-surface/20 backdrop-blur-md border border-gold/20 text-gold hover:bg-gold/10 transition-all hover:scale-110"
        title="Toggle Background Music"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <FloatingElements />
`;

content = content.replace('<FloatingElements />', audioJSX);

fs.writeFileSync('client/src/components/landing/Hero.jsx', content, 'utf8');
