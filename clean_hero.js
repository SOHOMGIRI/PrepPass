const fs = require('fs');
let content = fs.readFileSync('client/src/components/landing/Hero.jsx', 'utf8');

// Remove audio imports
content = content.replace('import { ChevronDown, Volume2, VolumeX } from "lucide-react";', 'import { ChevronDown } from "lucide-react";');

// Remove audio state
content = content.replace(/const audioRef = useRef\(null\);[\s\S]*?const toggleMute = \(\) => \{[\s\S]*?setIsMuted\(!isMuted\);\s*\}\s*\};\s*/, '');

// Remove audio JSX
content = content.replace(/<audio ref=\{audioRef\}[\s\S]*?<\/button>/, '');

fs.writeFileSync('client/src/components/landing/Hero.jsx', content, 'utf8');
