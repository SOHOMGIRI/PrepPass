const fs = require('fs');

let content = fs.readFileSync('client/src/components/landing/ParticleCanvas.jsx', 'utf8');

// Remove IntersectionObserver logic
content = content.replace(/const observer = new IntersectionObserver[\s\S]*?observer\.disconnect\(\);\s*\},\s*\[\]\);/m, '');
content = content.replace(/const \[visible, setVisible\] = useState\(true\);/m, '');
content = content.replace(/if \(!visible \|\| reducedMotion\) \{/m, 'if (reducedMotion) {');
content = content.replace(/\[visible, reducedMotion\]/m, '[reducedMotion]');

fs.writeFileSync('client/src/components/landing/ParticleCanvas.jsx', content, 'utf8');
