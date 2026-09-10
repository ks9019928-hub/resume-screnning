import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CircularScoreGauge({
  score = 0,
  size = 140,
  strokeWidth = 10,
  label = "ATS Score",
  color = "#10b981",
  glowColor = "rgba(16, 185, 129, 0.4)",
}) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const end = Math.min(Math.max(score, 0), 100);
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      if (end === 0) {
        setCurrentScore(0);
        clearInterval(timer);
        return;
      }
      start += increment;
      if (start >= end) {
        setCurrentScore(end);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Ambient Radar Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse pointer-events-none"
          style={{ background: glowColor }}
        />

        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Animated Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Inner Counter Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none"
          >
            {currentScore}%
          </motion.span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
