const fs = require('fs');
let content = fs.readFileSync('client/src/components/landing/ParticleCanvas.jsx', 'utf8');

content = content.replace(/const rect = canvas\.parentElement\.getBoundingClientRect\(\);/g, 'const rect = { width: window.innerWidth, height: window.innerHeight };');

fs.writeFileSync('client/src/components/landing/ParticleCanvas.jsx', content, 'utf8');
