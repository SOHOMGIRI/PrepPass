const fs = require('fs');

let content = fs.readFileSync('client/src/components/GlobalBackground.jsx', 'utf8');

// Stop loop on audio tag
content = content.replace('<audio ref={audioRef} loop', '<audio ref={audioRef}');

// Stop audio after 3 seconds
content = content.replace("audioRef.current.play().catch(e => console.log('Audio play failed:', e));", `audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsMuted(true);
          }
        }, 3500);`);

fs.writeFileSync('client/src/components/GlobalBackground.jsx', content, 'utf8');
