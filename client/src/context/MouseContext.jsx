import { createContext, useContext, useEffect, useRef, useState } from "react";

const MouseContext = createContext({ x: 0, y: 0 });

/**
 * Hook to consume the global mouse position.
 * Returns { x, y } in viewport pixels (clientX / clientY).
 */
export function useMouse() {
  return useContext(MouseContext);
}

const isTouchDevice = () =>
  typeof navigator !== "undefined" &&
  (navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Windows Phone|Touch/.test(navigator.userAgent));

/**
 * Global mouse tracker.  Updates CSS custom properties --mouse-x / --mouse-y
 * on <html> so any CSS can reference the pointer position, and exposes the
 * values through React context for JS consumers.
 *
 * Disabled on touch devices and viewports < 768px.
 */
export function MouseProvider({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const raf = useRef(null);
  const latest = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  // Detect pointer capability.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const mqWidth = window.matchMedia("(max-width: 767px)");
    const check = () => setEnabled(!isTouchDevice() && !mq.matches && !mqWidth.matches);
    check();
    mq.addEventListener?.("change", check);
    mqWidth.addEventListener?.("change", check);
    return () => {
      mq.removeEventListener?.("change", check);
      mqWidth.removeEventListener?.("change", check);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      latest.current = { x: e.clientX, y: e.clientY };
      if (raf.current == null) {
        raf.current = requestAnimationFrame(() => {
          const { x, y } = latest.current;
          setPos({ x, y });
          document.documentElement.style.setProperty("--mouse-x", `${x}px`);
          document.documentElement.style.setProperty("--mouse-y", `${y}px`);
          raf.current = null;
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current != null) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, [enabled]);

  return <MouseContext.Provider value={pos}>{children}</MouseContext.Provider>;
}
