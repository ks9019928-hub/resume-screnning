import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CardSpotlight({
  children,
  className = "",
  spotlightColor = "rgba(99, 102, 241, 0.15)",
  borderColor = "rgba(99, 102, 241, 0.4)",
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
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

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Radial Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isFocused ? 1 : opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl border transition-opacity duration-300"
        style={{
          opacity: isFocused ? 1 : opacity,
          borderColor: borderColor,
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

