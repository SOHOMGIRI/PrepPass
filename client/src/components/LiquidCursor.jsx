import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMouse } from "../context/MouseContext.jsx";

export default function LiquidCursor() {
  const containerRef = useRef(null);
  const elementsRef = useRef({});
  const mouse = useMouse();
  const location = useLocation();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (location.pathname === "/test-mode" || location.pathname === "/login" || location.pathname === "/register") {
      setIsActive(false);
      document.body.style.cursor = "auto";
    } else {
      setIsActive(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isActive) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) {
      setIsActive(false);
      return;
    }

    document.body.style.cursor = "none";
    
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    
    let rafId;
    const numBlobs = 5;
    if (!elementsRef.current.positions) {
      elementsRef.current.positions = Array.from({ length: numBlobs }).map(() => ({ x: mouse.x, y: mouse.y }));
    }

    const render = () => {
      const positions = elementsRef.current.positions;
      
      positions[0].x += (mouse.x - positions[0].x) * 0.8;
      positions[0].y += (mouse.y - positions[0].y) * 0.8;
      
      for (let i = 1; i < numBlobs; i++) {
        const lag = 0.5 - (i * 0.08); 
        positions[i].x += (positions[i - 1].x - positions[i].x) * Math.max(0.1, lag);
        positions[i].y += (positions[i - 1].y - positions[i].y) * Math.max(0.1, lag);
      }

      const els = elementsRef.current.elements;
      if (els && els.length) {
        for (let i = 0; i < numBlobs; i++) {
          if (els[i]) {
            els[i].style.transform = "translate(" + positions[i].x + "px, " + positions[i].y + "px) scale(" + (1 - i * 0.1) + ")";
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [mouse, isActive]);

  if (!isActive) return null;

  return (
    <>
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div 
        ref={containerRef}
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ filter: "url(#goo)" }}
      >
        <div className="absolute top-0 left-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                if (!elementsRef.current.elements) elementsRef.current.elements = [];
                elementsRef.current.elements[i] = el;
              }}
              className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]"
              style={{
                willChange: "transform",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

