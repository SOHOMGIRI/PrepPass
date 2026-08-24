const fs = require('fs');

let content = fs.readFileSync('client/src/components/landing/ParticleCanvas.jsx', 'utf8');

// Safely remove the IntersectionObserver block
content = content.replace(/\/\/ IntersectionObserver to pause when off-screen\.[\s\S]*?observer\.disconnect\(\);\s*\},\s*\[\]\);/g, '');

// Safely remove visible state entirely
content = content.replace(/const \[visible, setVisible\] = useState\(true\);[\s\S]*?useEffect\(\(\) => setVisible\(true\), \[\]\);/g, '');

// Safely update the dependency array
content = content.replace(/\[visible, reducedMotion\]/g, '[reducedMotion]');

// Safely update the draw loop check
content = content.replace(/if \(!visible \|\| reducedMotion\) \{/g, 'if (reducedMotion) {');

fs.writeFileSync('client/src/components/landing/ParticleCanvas.jsx', content, 'utf8');
