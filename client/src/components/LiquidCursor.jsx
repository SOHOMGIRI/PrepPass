import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export default function LiquidCursor() {
  const location = useLocation();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isHovering = useRef(false);

  // Disable check
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isExcluded = ["/test-mode", "/login", "/register"].includes(location.pathname);
    
    if (isTouch || isExcluded) {
      setEnabled(false);
      document.body.style.cursor = "auto";
    } else {
      setEnabled(true);
      document.body.style.cursor = "none";
    }
    
    return () => { document.body.style.cursor = "auto"; };
  }, [location.pathname]);

  // Mouse logic via GSAP
  useEffect(() => {
    if (!enabled) return;

    // QuickTo for high performance
    const xDot = gsap.quickTo(dotRef.current, "x", { duration: 0.05, ease: "power3.out" });
    const yDot = gsap.quickTo(dotRef.current, "y", { duration: 0.05, ease: "power3.out" });
    const xRing = gsap.quickTo(ringRef.current, "x", { duration: 0.3, ease: "power3.out" });
    const yRing = gsap.quickTo(ringRef.current, "y", { duration: 0.3, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      // Center dot (4px radius)
      xDot(clientX - 4);
      yDot(clientY - 4);
      // Center ring (16px radius initially)
      xRing(clientX - 16);
      yRing(clientY - 16);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[data-cursor="pointer"]')
      ) {
        if (!isHovering.current) {
          isHovering.current = true;
          gsap.to(ringRef.current, { scale: 1.8, backgroundColor: "rgba(212, 167, 44, 0.1)", duration: 0.2 });
          gsap.to(dotRef.current, { opacity: 0, scale: 0, duration: 0.2 });
        }
      } else {
        if (isHovering.current) {
          isHovering.current = false;
          gsap.to(ringRef.current, { scale: 1, backgroundColor: "transparent", duration: 0.2 });
          gsap.to(dotRef.current, { opacity: 1, scale: 1, duration: 0.2 });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-gold"
        style={{
          width: 32,
          height: 32,
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-gold"
        style={{
          width: 8,
          height: 8,
          willChange: "transform",
        }}
      />
    </>
  );
}
