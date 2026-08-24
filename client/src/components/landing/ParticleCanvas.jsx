import { useEffect, useRef, useState } from "react";
import { useMouse } from "../../context/MouseContext.jsx";

const PARTICLE_COUNT = 150;
const LINE_DIST = 120;
const SPEED = 0.3;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Lightweight HTML5 Canvas particle field with connecting lines.
 * Gold + navy dots drift slowly; mouse proximity gently repels them.
 * Pauses when off-screen (IntersectionObserver) and respects
 * prefers-reduced-motion.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animRef = useRef(null);
  const mouse = useMouse();
  const mouseRef = useRef(mouse);
  
  

  // Keep mouseRef in sync without re-running the animation effect.
  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  

  

  // Init + animation loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const h = () => canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

    // Seed particles.
    const colors = [
      "rgba(255, 255, 255, 0.8)",
      "rgba(255, 255, 255, 0.5)",
      "rgba(226, 232, 240, 0.4)", // silver-ish
      "rgba(255, 255, 255, 0.2)",
    ];
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, w()),
      y: rand(0, h()),
      vx: rand(2.0, 4.0), // Slanting diagonally right
      vy: rand(1.5, 3.0), // falling down (snow)
      r: rand(0.8, 2.5),
      color: colors[Math.floor(rand(0, colors.length))],
      sway: rand(0, Math.PI * 2), // random starting phase
      swaySpeed: rand(0.01, 0.05)
    }));

    const draw = () => {
      

      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      const pts = particles.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      // Get canvas position in viewport for mouse coord adjustment.
      const rect = canvas.getBoundingClientRect();

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Mouse repulsion.
        const localMx = mx - rect.left;
        const localMy = my - rect.top;
        const dmx = p.x - localMx;
        const dmy = p.y - localMy;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (distMouse < 100 && distMouse > 0) {
          const force = (100 - distMouse) / 100;
          p.vx += (dmx / distMouse) * force * 0.4;
          p.vy += (dmy / distMouse) * force * 0.4;
        }

        // Snow sway
        p.sway += p.swaySpeed;
        const currentVx = p.vx + Math.sin(p.sway) * 0.8;

        p.x += currentVx;
        p.y += p.vy;

        // Wrap around edges (falling from top)
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y > ch + 10) {
          p.y = -10;
          p.x = rand(0, cw);
        }

        // Draw dot.
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}


