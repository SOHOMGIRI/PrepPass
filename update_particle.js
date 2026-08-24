const fs = require('fs');

let content = fs.readFileSync('client/src/components/landing/ParticleCanvas.jsx', 'utf8');

content = content.replace('const PARTICLE_COUNT = 80;', 'const PARTICLE_COUNT = 150;');

// Update initialization logic to make them fall like snow
const oldInit = `
    const colors = [
      "rgba(212, 167, 44, 0.5)",
      "rgba(212, 167, 44, 0.3)",
      "rgba(26, 34, 126, 0.25)",
      "rgba(26, 34, 126, 0.15)",
    ];
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, w()),
      y: rand(0, h()),
      vx: rand(-SPEED, SPEED),
      vy: rand(-SPEED, SPEED),
      r: rand(1.2, 2.8),
      color: colors[Math.floor(rand(0, colors.length))],
    }));
`;

const newInit = `
    const colors = [
      "rgba(255, 255, 255, 0.8)",
      "rgba(255, 255, 255, 0.5)",
      "rgba(226, 232, 240, 0.4)", // silver-ish
      "rgba(255, 255, 255, 0.2)",
    ];
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, w()),
      y: rand(0, h()),
      vx: rand(-0.3, 0.3), // slight horizontal drift
      vy: rand(0.5, 2.0), // falling down (snow)
      r: rand(0.8, 2.5),
      color: colors[Math.floor(rand(0, colors.length))],
      sway: rand(0, Math.PI * 2), // random starting phase
      swaySpeed: rand(0.01, 0.05)
    }));
`;
content = content.replace(oldInit.trim(), newInit.trim());

// Update draw loop for snow logic
const oldLoop = `
        // Dampen velocity.
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges.
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y < -10) p.y = ch + 10;
        if (p.y > ch + 10) p.y = -10;
`;

const newLoop = `
        // Snow sway
        p.sway += p.swaySpeed;
        const currentVx = p.vx + Math.sin(p.sway) * 0.5;

        p.x += currentVx;
        p.y += p.vy;

        // Wrap around edges (falling from top)
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y > ch + 10) {
          p.y = -10;
          p.x = rand(0, cw);
        }
`;
content = content.replace(oldLoop.trim(), newLoop.trim());

// Remove the connecting lines drawing
const linesLogic = `
        // Draw connecting lines to nearby particles.
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = \`rgba(212, 167, 44, \${0.12 * (1 - dist / LINE_DIST)})\`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
`;
content = content.replace(linesLogic.trim(), '');

fs.writeFileSync('client/src/components/landing/ParticleCanvas.jsx', content, 'utf8');
