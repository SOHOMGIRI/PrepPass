import { useEffect, useRef } from "react";

/**
 * LiquidCursor - Smooth GPU-Accelerated Trailing Glow Cursor
 * Emits an Electric Sapphire & Cyan Aureole glow matching PræpPass's high-tech aesthetic.
 * Operates at native display refresh rates using requestAnimationFrame and lerp interpolation.
 */
export default function LiquidCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Disable on touch screens or mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHoveringInteractive = false;
    let isMouseDown = false;
    let animationFrameId = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const checkInteractiveHover = (e) => {
      const target = e.target;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea") ||
        target.closest("[role='button']") ||
        target.hasAttribute("data-interactive")
      ) {
        isHoveringInteractive = true;
      } else {
        isHoveringInteractive = false;
      }
    };

    // Smooth trailing animation loop
    const render = () => {
      // Linear interpolation for smooth trailing physics
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        const scale = isMouseDown ? 0.8 : isHoveringInteractive ? 1.6 : 1.0;
        const opacity = isHoveringInteractive ? 0.85 : 0.45;

        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = opacity;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousemove", checkInteractiveHover, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousemove", checkInteractiveHover);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Outer Trailing Glow Orb (Electric Sapphire / Cyan Aurum) */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform transition-[transform,opacity] duration-150 ease-out"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(37, 99, 235, 0.25) 45%, rgba(79, 70, 229, 0) 75%)",
          filter: "blur(4px)",
        }}
      />

      {/* Crisp Inner High-Tech Specular Core */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#06B6D4",
          boxShadow: "0 0 10px #2563EB, 0 0 4px #FFFFFF",
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
}
