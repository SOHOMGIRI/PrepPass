import { useEffect, useRef, useState } from "react";
import { useMouse } from "../../context/MouseContext.jsx";

const PARTICLE_COUNT = 80;
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
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Keep mouseRef in sync without re-running the animation effect.
  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  // Check prefers-reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // IntersectionObserver to pause when off-screen.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

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

    const draw = () => {
      if (!visible || reducedMotion) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

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

        // Draw dot.
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

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
            ctx.strokeStyle = `rgba(212, 167, 44, ${0.12 * (1 - dist / LINE_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visible, reducedMotion]);

  // If reduced motion, render static scattered dots via CSS instead.
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-gold/30"
            style={{
              width: rand(2, 5),
              height: rand(2, 5),
              left: `${rand(5, 95)}%`,
              top: `${rand(5, 95)}%`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
