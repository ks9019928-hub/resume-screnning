import { motion } from "framer-motion";

export default function BackgroundPaths({ className = "" }) {
  // Generate harmonious floating bezier curve trajectories
  const paths = [
    {
      d: "M -100 120 C 300 20, 600 240, 1100 80 S 1600 200, 2100 90",
      stroke: "rgba(99, 102, 241, 0.25)",
      width: 1.5,
      duration: 18,
      delay: 0,
    },
    {
      d: "M -100 180 C 250 80, 700 320, 1200 120 S 1700 280, 2100 160",
      stroke: "rgba(168, 85, 247, 0.2)",
      width: 1.2,
      duration: 22,
      delay: 2,
    },
    {
      d: "M -100 60 C 400 220, 800 40, 1300 200 S 1800 60, 2100 240",
      stroke: "rgba(59, 130, 246, 0.2)",
      width: 1.4,
      duration: 25,
      delay: 4,
    },
    {
      d: "M -100 300 C 350 140, 750 380, 1250 180 S 1750 340, 2100 210",
      stroke: "rgba(129, 140, 248, 0.18)",
      width: 1.0,
      duration: 20,
      delay: 1,
    },
    {
      d: "M -100 240 C 450 340, 900 100, 1400 260 S 1900 140, 2100 320",
      stroke: "rgba(192, 132, 252, 0.15)",
      width: 1.3,
      duration: 24,
      delay: 3,
    },
  ];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full opacity-60"
        viewBox="0 0 2000 400"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="30%" stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>

        {paths.map((p, idx) => (
          <motion.path
            key={idx}
            d={p.d}
            stroke={idx === 0 ? "url(#pathGradient)" : p.stroke}
            strokeWidth={p.width}
            strokeDasharray="16 8"
            initial={{ pathOffset: 0, opacity: 0.3 }}
            animate={{
              pathOffset: [0, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
