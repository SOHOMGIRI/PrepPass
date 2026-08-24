const fs = require('fs');
let content = fs.readFileSync('client/src/components/landing/ParticleCanvas.jsx', 'utf8');

// The file was restored, so it has the IntersectionObserver.
// Let's just make it always visible by changing the observer threshold and logic.
// Actually, since it is fixed inset-0, it is ALWAYS visible.
// The issue must be something else! Let's check `visible` state!

content = content.replace('const [visible, setVisible] = useState(true);', 'const [visible, setVisible] = useState(true);\n  // Always true for snow\n  useEffect(() => setVisible(true), []);');
// And slanting right:
content = content.replace('vx: rand(-0.3, 0.3)', 'vx: rand(1.0, 2.5)');
content = content.replace('vy: rand(0.5, 2.0)', 'vy: rand(1.5, 3.0)');
content = content.replace('const currentVx = p.vx + Math.sin(p.sway) * 0.5;', 'const currentVx = p.vx + Math.sin(p.sway) * 0.8;');

fs.writeFileSync('client/src/components/landing/ParticleCanvas.jsx', content, 'utf8');
