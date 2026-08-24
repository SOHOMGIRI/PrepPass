import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export default function SpotlightCard({ children, className, to, onClick, as: Component = "div" }) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
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
  const handleMouseLeave = () => setOpacity(0);

  const Tag = to ? Link : Component;
  const props = to ? { to } : {};

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
        "border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
        "hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(37,99,235,0.1)] hover:border-blue-500/30",
        className
      )}
    >
      {/* Soft glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-0" />
      
      {/* The border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 z-0 mix-blend-overlay"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.4), transparent 40%)`,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}



