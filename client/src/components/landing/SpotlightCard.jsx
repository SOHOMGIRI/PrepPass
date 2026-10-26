import { useRef, useState } from "react";
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

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
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
        "relative overflow-hidden block rounded-2xl bg-white backdrop-blur-md transition-all duration-300",
        "border border-[#0A1128]/8 shadow-[0_4px_18px_rgba(10,17,40,0.04)]",
        "hover:shadow-[0_16px_36px_rgba(10,17,40,0.08)] hover:border-[#C5A059]/50",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${opacity ? 1.015 : 1})`,
      }}
    >
      {/* Aurum spotlight trace */}
      <div
        className="pointer-events-none absolute inset-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(197, 160, 89, 0.12), transparent 70%)`,
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
