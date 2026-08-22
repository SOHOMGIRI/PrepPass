import { useCallback, useRef } from "react";

/**
 * Adds a Material-style ripple-on-click to the element that receives the
 * returned onPointerDown handler.
 *
 * Usage:
 *   const ripple = useRipple();
 *   <button onPointerDown={ripple} className="relative overflow-hidden">
 *
 * The ripple is a real DOM span injected into the target; it self-removes
 * after the animation.  No GSAP dependency — pure CSS.
 */
export default function useRipple(color = "rgba(212, 167, 44, 0.35)") {
  const cleaning = useRef(false);

  const handlePointerDown = useCallback(
    (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
        background:${color};
        transform:scale(0); opacity:1;
        animation:ripple-expand 0.5s ease-out forwards;
      `;

      el.appendChild(ripple);

      const remove = () => {
        ripple.remove();
      };
      ripple.addEventListener("animationend", remove, { once: true });
      // Safety: remove after 600ms even if animationend doesn't fire.
      setTimeout(remove, 600);
    },
    [color]
  );

  return handlePointerDown;
}
