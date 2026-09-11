import { motion } from "framer-motion";

export default function BorderBeam({
  className = "",
  size = 200,
  duration = 10,
  borderWidth = 1.5,
  colorFrom = "#6366f1",
  colorTo = "#a855f7",
}) {
  return (
    <div
      style={{
        "--size": `${size}px`,
        "--duration": `${duration}s`,
        "--border-width": `${borderWidth}px`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
      }}
      className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] ${className}`}
    >
      <motion.div
        className="absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent"
        style={{
          width: "var(--size)",
          offsetPath: `rect(0 auto auto 0 round calc(var(--size)))`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
}

