const fs = require('fs');

const content = import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export default function SpotlightCard({ children, className, to, onClick, as: Component = "div" }) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    // Calculate 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation of 10 degrees
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTilt({ rx: rotateX, ry: rotateY });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };
  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };
  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ rx: 0, ry: 0 });
  };

  const Tag = to ? Link : Component;
  const props = to ? { to } : {};

  // For responsive touch devices, we don't want crazy tilt, so we apply perspective wrapper
  // and use transition for smooth return.

  return (
    <Tag
      {...props}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden block rounded-2xl bg-surface/5 backdrop-blur-md transition-all duration-300",
        "border border-gold/20 shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
        "hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:border-gold",
        className
      )}
      style={{
        transform: \\\perspective(1000px) rotateX(\\\deg) rotateY(\\\deg) scale(\\\)\\\,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Soft glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0" />
      
      {/* The border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 transition duration-500 z-0 mix-blend-overlay"
        style={{
          opacity,
          background: \\\adial-gradient(600px circle at \\\px \\\px, rgba(212, 175, 55, 0.4), transparent 40%)\\\,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full" style={{ transform: "translateZ(30px)" }}>{children}</div>
    </Tag>
  );
}
;
fs.writeFileSync('client/src/components/landing/SpotlightCard.jsx', content.replace(/\\\\\\\/g, '\'), 'utf8');
