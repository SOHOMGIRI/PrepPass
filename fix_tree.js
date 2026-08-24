const fs = require('fs');
let content = fs.readFileSync('client/src/components/landing/HeroIllustration.jsx', 'utf8');

content = content.replace(/transformOrigin:\s*\+\s*""\s*\+\s*\$\s*\+\s*\{leaf\.cx\}px\s*\$\s*\+\s*\{leaf\.cy\}px\s*\+\s*""\s*\+\s*,/, "transformOrigin: leaf.cx + 'px ' + leaf.cy + 'px',");
content = content.replace(/animation:\s*\+\s*""\s*\+\s*sway\s*\$\s*\+\s*\{leaf\.swayDuration\}s\s*ease-in-out\s*infinite\s*alternate\s*\$\s*\+\s*\{leaf\.delay\}s\s*\+\s*""\s*\+\s*,/, "animation: 'sway ' + leaf.swayDuration + 's ease-in-out infinite alternate ' + leaf.delay + 's',");
content = content.replace(/animation:\s*\+\s*""\s*\+\s*pulseGlow\s*\$\s*\+\s*\{leaf\.pulseDuration\}s\s*ease-in-out\s*infinite\s*alternate\s*\$\s*\+\s*\{leaf\.delay\}s\s*\+\s*""\s*\+\s*,/, "animation: 'pulseGlow ' + leaf.pulseDuration + 's ease-in-out infinite alternate ' + leaf.delay + 's',");
content = content.replace(/filter:\s*\+\s*""\s*\+\s*drop-shadow\(0\s*0\s*\$\s*\+\s*\{leaf\.r\s*\*\s*2\}px\s*\$\s*\+\s*\{leaf\.glowColor\}\)\s*\+\s*""\s*\+/, "filter: 'drop-shadow(0 0 ' + (leaf.r * 2) + 'px ' + leaf.glowColor + ')'");

fs.writeFileSync('client/src/components/landing/HeroIllustration.jsx', content);
