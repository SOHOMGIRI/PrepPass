import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

/**
 * SpotlightCard — Tinted Frosted Surface with Tilt Physics & Color Spotlight
 * No more plain white — uses warm cream / soft lavender tinted glass with
 * pronounced tilt animation and colorful hover spotlight.
 */
export default function SpotlightCard({ children, className, to, onClick, as: Component = "div" }) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    setTilt({ rx: rotateX, ry: rotateY });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ rx: 0, ry: 0 });
  };

  const Tag = to ? Link : Component;
  const props = to ? { to } : {};

  return (
    <Tag
      {...props}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden block rounded-3xl backdrop-blur-md transition-all duration-300 ease-out",
        "border border-amber-200/40 shadow-[0_8px_30px_rgba(180,140,60,0.06)]",
        "hover:shadow-[0_20px_50px_rgba(180,140,60,0.12)] hover:border-violet-300/50",
        className
      )}
      style={{
        background: "linear-gradient(145deg, rgba(255,250,240,0.85) 0%, rgba(252,244,225,0.8) 50%, rgba(248,238,215,0.85) 100%)",
        transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${opacity ? 1.02 : 1})`,
        transition: opacity ? "transform 0.1s ease-out" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Multi-color spotlight trace on hover */}
      <div
        className="pointer-events-none absolute inset-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(167, 139, 250, 0.15), rgba(232, 121, 160, 0.08), transparent 65%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
