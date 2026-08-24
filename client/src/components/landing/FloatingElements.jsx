import { useEffect, useRef } from "react";
import { useMouse } from "../../context/MouseContext.jsx";
import { 
  FileText, Briefcase, GraduationCap, Award,
  CheckCircle2, Target, BarChart3, Clock,
  MessageSquare, BrainCircuit, PenTool
} from "lucide-react";

const ICONS = [
  { Icon: FileText, x: 15, y: 20, scale: 1.2, speed: 0.05, color: "text-white", glow: "shadow-gold" },
  { Icon: Briefcase, x: 80, y: 15, scale: 0.9, speed: 0.08, color: "text-white", glow: "shadow-gold" },
  { Icon: GraduationCap, x: 10, y: 75, scale: 1.4, speed: 0.04, color: "text-white", glow: "shadow-gold" },
  { Icon: Award, x: 85, y: 80, scale: 1, speed: 0.06, color: "text-white", glow: "shadow-gold" },
  { Icon: CheckCircle2, x: 50, y: 10, scale: 0.8, speed: 0.09, color: "text-white", glow: "shadow-gold" },
  { Icon: Target, x: 75, y: 50, scale: 1.1, speed: 0.07, color: "text-white", glow: "shadow-gold" },
  { Icon: BarChart3, x: 25, y: 45, scale: 1.3, speed: 0.05, color: "text-white", glow: "shadow-gold" },
  { Icon: Clock, x: 40, y: 85, scale: 0.9, speed: 0.08, color: "text-white", glow: "shadow-gold" },
  { Icon: MessageSquare, x: 90, y: 35, scale: 1, speed: 0.06, color: "text-white", glow: "shadow-gold" },
  { Icon: BrainCircuit, x: 20, y: 90, scale: 1.2, speed: 0.04, color: "text-white", glow: "shadow-gold" },
  { Icon: PenTool, x: 60, y: 65, scale: 0.8, speed: 0.1, color: "text-white", glow: "shadow-gold" },
];

export default function FloatingElements() {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const mouse = useMouse();
  
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    
    let easedX = mouse.x;
    let easedY = mouse.y;
    let rafId;

    const render = () => {
      easedX += (mouse.x - easedX) * 0.1;
      easedY += (mouse.y - easedY) * 0.1;

      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const nx = (easedX / ww - 0.5) * 2;
      const ny = (easedY / wh - 0.5) * 2;

      elementsRef.current.forEach((el, i) => {
        if (!el) return;
        const conf = ICONS[i];
        if (!conf) return;

        const time = Date.now() * 0.001;
        const floatY = prefersReduced ? 0 : Math.sin(time * 2 + i) * 8;
        const floatX = prefersReduced ? 0 : Math.cos(time * 1.5 + i) * 8;

        const parallaxX = isTouch ? 0 : nx * 50 * conf.speed * 10;
        const parallaxY = isTouch ? 0 : ny * 50 * conf.speed * 10;

        el.style.transform = `translate3d(${floatX + parallaxX}px, ${floatY + parallaxY}px, 0) scale(${conf.scale})`;
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [mouse]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {ICONS.map((conf, i) => {
        const { Icon, x, y, color, glow } = conf;
        return (
          <div
            key={i}
            ref={(el) => (elementsRef.current[i] = el)}
            className={`absolute flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-surface/10  border border-gold/20 shadow-lg shadow-gold/20`}
            style={{ 
              left: `${x}%`, 
              top: `${y}%`,
              transform: `scale(${conf.scale})`
            }}
          >
            <Icon size={24} className={color} strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}


