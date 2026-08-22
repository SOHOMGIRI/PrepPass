import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMouse } from "../context/MouseContext.jsx";

const NUM_BLOBS = 6;
const BLOB = "rgba(212, 167, 44, 0.55)";
const WIDTHS = Array.from({ length: NUM_BLOBS }, (_, i) => 54 - i * 3);

const isTouchDevice = () =>
  typeof navigator !== "undefined" &&
  (navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|Windows Phone|Touch/.test(navigator.userAgent));

export default function LiquidCursor() {
  const location = useLocation();
  const globalMouse = useMouse();
  const [enabled, setEnabled] = useState(false);
  const mouse = useRef({ x: -200, y: -200 });
  const blobs = useRef(
    Array.from({ length: NUM_BLOBS }, () => ({ x: -120, y: -120 }))
  );
  const dots = useRef([]);
  const solidDotRef = useRef(null);
  const cursorScale = useRef(1);

  // Sync global mouse to local ref
  useEffect(() => {
    mouse.current = { x: globalMouse.x, y: globalMouse.y };
  }, [globalMouse]);

  // Cursor state detection
  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.closest('[data-cursor="pointer"]')) {
        cursorScale.current = 1.5;
      } else {
        cursorScale.current = 1;
      }
    };
    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  // Hide the cursor entirely on touch devices (no real mouse pointer).
  useEffect(() => {
    const media = window.matchMedia("(hover: none)");
    const update = () => setEnabled(!isTouchDevice() && !media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  // Manual rAF easing: the head snaps toward the cursor; every later blob
  // trails the previous one with more lag, forming a flowing, gooey tail.
  // Writes go straight to the DOM (no React re-render per frame).
  useEffect(() => {
    if (!enabled) return;
    const store = blobs.current;
    let raf;
    const tick = () => {
      store[0].x += (mouse.current.x - store[0].x) * 0.4;
      store[0].y += (mouse.current.y - store[0].y) * 0.4;
      for (let i = 1; i < NUM_BLOBS; i++) {
        const k = 0.16 + i * 0.02;
        store[i].x += (store[i - 1].x - store[i].x) * k;
        store[i].y += (store[i - 1].y - store[i].y) * k;
      }
      for (let i = 0; i < NUM_BLOBS; i++) {
        const el = dots.current[i];
        if (el) {
          el.style.transform = `translate(${store[i].x - WIDTHS[i] / 2}px, ${
            store[i].y - WIDTHS[i] / 2
          }px)`;
        }
      }
      
      if (solidDotRef.current) {
        solidDotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${
          mouse.current.y - 4
        }px) scale(${cursorScale.current})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled || location.pathname === "/test-mode") return null;

  return (
    <>
      <svg
        className="fixed inset-0 size-full pointer-events-none"
        aria-hidden="true"
        style={{ zIndex: 1, overflow: "visible" }}
      >
        <defs>
          <filter id="liquid-goo" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="fixed inset-0 size-full pointer-events-none"
        style={{ zIndex: 2, filter: "url(#liquid-goo)" }}
      >
        {WIDTHS.map((w, i) => (
          <span
            key={i}
            ref={(el) => {
              dots.current[i] = el;
            }}
            className="absolute block rounded-full"
            style={{
              left: 0,
              top: 0,
              width: w,
              height: w,
              backgroundColor: BLOB,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      <span
        ref={solidDotRef}
        className="fixed top-0 left-0 block rounded-full pointer-events-none transition-transform duration-100"
        style={{
          width: 8,
          height: 8,
          backgroundColor: "#d4a72c",
          zIndex: 3,
          willChange: "transform",
        }}
      />
    </>
  );
}
