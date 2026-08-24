const fs = require('fs');

let content = fs.readFileSync('client/src/components/landing/ParticleCanvas.jsx', 'utf8');

// Remove reducedMotion check
content = content.replace(/const \[reducedMotion, setReducedMotion\] = useState\(false\);/g, '');
content = content.replace(/\/\/ Check prefers-reduced-motion\.[\s\S]*?mq\.removeEventListener\?\.\("change", onChange\);\s*\},\s*\[\]\);/g, '');
content = content.replace(/if \(reducedMotion\) \{[\s\S]*?return;\s*\}/g, '');
content = content.replace(/,\s*\[reducedMotion\]/g, ', []');
content = content.replace(/\/\/ If reduced motion, render static scattered dots via CSS instead\.[\s\S]*?return \([\s\S]*?<\/div>\s*\);\s*\}/g, '');

fs.writeFileSync('client/src/components/landing/ParticleCanvas.jsx', content, 'utf8');
