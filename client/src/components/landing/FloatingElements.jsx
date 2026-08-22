import { useRef, useEffect } from "react";
import gsap from "gsap";
import { GraduationCap, FileText, LineChart, BadgeCheck } from "lucide-react";
import { useMouse } from "../../context/MouseContext.jsx";

const ELEMENTS = [
  { id: "cap", Icon: GraduationCap, color: "text-[#1E1B4B]", bg: "bg-indigo-50", initialPos: { top: "20%", left: "15%" }, delay: 0, scale: 1.2, parallax: 0.04 },
  { id: "resume", Icon: FileText, color: "text-[#F59E0B]", bg: "bg-amber-50", initialPos: { bottom: "25%", left: "20%" }, delay: 0.2, scale: 1, parallax: -0.03 },
  { id: "chart", Icon: LineChart, color: "text-[#1E1B4B]", bg: "bg-indigo-50", initialPos: { top: "30%", right: "15%" }, delay: 0.4, scale: 1.1, parallax: 0.05 },
  { id: "badge", Icon: BadgeCheck, color: "text-[#10B981]", bg: "bg-emerald-50", initialPos: { bottom: "35%", right: "20%" }, delay: 0.6, scale: 1.3, parallax: -0.06 },
];

export default function FloatingElements() {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const mouse = useMouse();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // 1. Idle float animation (gentle vertical loop)
    elementsRef.current.forEach((el, index) => {
      if (!el) return;
      gsap.to(el, {
        y: "+=15",
        duration: 2.5 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: ELEMENTS[index].delay,
      });
    });

    return () => {
      gsap.killTweensOf(elementsRef.current);
    };
  }, []);

  // 2. Parallax tied to cursor (using quickTo for performance)
  const xTos = useRef([]);
  const yTos = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isTouch || elementsRef.current.length === 0) return;

    elementsRef.current.forEach((el, i) => {
      if (!el) return;
      xTos.current[i] = gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" });
      yTos.current[i] = gsap.quickTo(el, "y", { duration: 0.8, ease: "power2.out" });
    });
  }, []);

  useEffect(() => {
    if (xTos.current.length === 0) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = mouse.x - centerX;
    const deltaY = mouse.y - centerY;

    elementsRef.current.forEach((el, i) => {
      if (xTos.current[i] && yTos.current[i]) {
        xTos.current[i](deltaX * ELEMENTS[i].parallax);
        yTos.current[i](deltaY * ELEMENTS[i].parallax);
      }
    });
  }, [mouse]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {ELEMENTS.map((item, index) => {
        const { Icon } = item;
        return (
          <div
            key={item.id}
            ref={(el) => (elementsRef.current[index] = el)}
            className={`absolute flex items-center justify-center rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm ${item.bg} ${item.color} hidden md:flex`}
            style={{
              ...item.initialPos,
              width: `${item.scale * 3.5}rem`,
              height: `${item.scale * 3.5}rem`,
              transform: `scale(0)`, // Initial scale for entrance animation (handled in Hero)
            }}
          >
            <Icon size={24 * item.scale} strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}
