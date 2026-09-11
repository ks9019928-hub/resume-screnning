import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  FileSearch,
} from "lucide-react";
import {
  SiReact,
  SiPython,
  SiFastapi,
  SiDocker,
  SiPostgresql,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiKubernetes,
  SiTailwindcss,
  SiGit,
  SiPytorch,
  SiGraphql,
  SiRedis,
  SiNodedotjs,
  SiNextdotjs,
  SiLinux,
  SiFigma,
  SiRust,
  SiGithub,
} from "react-icons/si";
import BorderBeam from "./BorderBeam";

const TECH_ITEMS = [
  { icon: SiReact, label: "React", bg: "from-cyan-500/30 to-blue-600/30", color: "#38bdf8", border: "border-cyan-500/40" },
  { icon: SiPython, label: "Python", bg: "from-yellow-500/30 to-blue-500/30", color: "#facc15", border: "border-yellow-500/40" },
  { icon: SiFastapi, label: "FastAPI", bg: "from-emerald-500/30 to-teal-600/30", color: "#34d399", border: "border-emerald-500/40" },
  { icon: SiDocker, label: "Docker", bg: "from-sky-500/30 to-blue-700/30", color: "#60a5fa", border: "border-sky-500/40" },
  { icon: SiRust, label: "Rust", bg: "from-amber-500/30 to-orange-600/30", color: "#fb923c", border: "border-amber-500/40" },
  { icon: SiPostgresql, label: "PostgreSQL", bg: "from-indigo-500/30 to-blue-600/30", color: "#818cf8", border: "border-indigo-500/40" },
  { icon: SiTypescript, label: "TypeScript", bg: "from-blue-500/30 to-indigo-600/30", color: "#60a5fa", border: "border-blue-500/40" },
  { icon: SiJavascript, label: "JavaScript", bg: "from-yellow-400/30 to-amber-500/30", color: "#fde047", border: "border-yellow-400/40" },
  { icon: SiMongodb, label: "MongoDB", bg: "from-green-500/30 to-emerald-600/30", color: "#4ade80", border: "border-green-500/40" },
  { icon: SiKubernetes, label: "Kubernetes", bg: "from-blue-600/30 to-indigo-700/30", color: "#93c5fd", border: "border-blue-500/40" },
  { icon: SiTailwindcss, label: "Tailwind", bg: "from-teal-400/30 to-cyan-600/30", color: "#2dd4bf", border: "border-teal-400/40" },
  { icon: SiGit, label: "Git", bg: "from-orange-500/30 to-red-600/30", color: "#f87171", border: "border-orange-500/40" },
  { icon: SiPytorch, label: "PyTorch", bg: "from-rose-500/30 to-amber-600/30", color: "#fb7185", border: "border-rose-500/40" },
  { icon: SiGraphql, label: "GraphQL", bg: "from-pink-500/30 to-purple-600/30", color: "#f472b6", border: "border-pink-500/40" },
  { icon: SiRedis, label: "Redis", bg: "from-red-500/30 to-rose-700/30", color: "#f87171", border: "border-red-500/40" },
  { icon: SiNodedotjs, label: "Node.js", bg: "from-emerald-600/30 to-green-700/30", color: "#4ade80", border: "border-emerald-500/40" },
  { icon: SiNextdotjs, label: "Next.js", bg: "from-slate-700/50 to-slate-900/50", color: "#ffffff", border: "border-white/30" },
  { icon: SiLinux, label: "Linux", bg: "from-amber-400/30 to-yellow-600/30", color: "#fde047", border: "border-amber-400/40" },
  { icon: SiFigma, label: "Figma", bg: "from-purple-500/30 to-pink-500/30", color: "#c084fc", border: "border-purple-500/40" },
  { icon: SiGithub, label: "GitHub", bg: "from-slate-600/30 to-slate-800/30", color: "#e2e8f0", border: "border-slate-500/40" },
];

export default function FloatingIconVortex({
  title = "Take a scan.",
  subtitle = "Match anything with a single resume upload.",
  onAction,
  className = "",
}) {
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      setMouseOffset({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAction) {
      onAction(query);
    } else {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  // Generate 2 concentric orbiting vortex rings
  const rings = [
    { radiusX: 380, radiusY: 200, speed: 45, count: 10, items: TECH_ITEMS.slice(0, 10), tilt: 15 },
    { radiusX: 520, radiusY: 260, speed: 60, count: 10, items: TECH_ITEMS.slice(10, 20), tilt: -20 },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[640px] rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center p-6 sm:p-12 border border-white/10 shadow-2xl ${className}`}
    >
      {/* Background Radial Glow & Ambient Focal Light */}
      <div className="absolute inset-0 bg-radial-vortex pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[90px] pointer-events-none" />

      {/* Orbiting Tech Skill Badges Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {rings.map((ring, ringIdx) => {
          return (
            <motion.div
              key={ringIdx}
              className="absolute w-full h-full flex items-center justify-center pointer-events-none"
              animate={{
                rotate: ringIdx % 2 === 0 ? 360 : -360,
              }}
              transition={{
                duration: ring.speed,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                transform: `rotateX(${ring.tilt + mouseOffset.y * 10}deg) rotateY(${mouseOffset.x * 12}deg)`,
              }}
            >
              {ring.items.map((item, idx) => {
                const angle = (idx / ring.count) * Math.PI * 2;
                const x = Math.cos(angle) * ring.radiusX;
                const y = Math.sin(angle) * ring.radiusY;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={idx}
                    className="absolute pointer-events-auto group cursor-pointer"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    whileHover={{ scale: 1.25, zIndex: 30 }}
                  >
                    {/* Counter-rotate icon so it remains upright while orbiting */}
                    <motion.div
                      animate={{
                        rotate: ringIdx % 2 === 0 ? -360 : 360,
                      }}
                      transition={{
                        duration: ring.speed,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className={`w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${item.bg} bg-slate-900/90 border ${item.border} backdrop-blur-xl flex flex-col items-center justify-center shadow-xl shadow-black/60 group-hover:border-white/60 transition-all p-2.5`}
                    >
                      <Icon size={22} color={item.color} className="drop-shadow-md" />
                      <span className="text-[9px] font-bold text-slate-300 mt-1 truncate max-w-full group-hover:text-white">
                        {item.label}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* Central Glassmorphic Focus Card (Matches Image 2 "Waitlist Hero" from 21st.dev) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          transform: `translate3d(${mouseOffset.x * -8}px, ${mouseOffset.y * -8}px, 0)`,
        }}
        className="relative z-20 w-full max-w-lg mx-auto"
      >
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-2xl text-center relative overflow-hidden">
          <BorderBeam size={220} duration={8} borderWidth={1.5} />

          {/* Central Logo / Avatar Node */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/40 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-950/60 mb-6 relative"
          >
            <div className="absolute inset-0 rounded-2xl bg-indigo-400 blur-lg opacity-40 animate-pulse" />
            <FileSearch size={30} className="relative z-10 text-white" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>

          {/* Quick Input Bar Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter target role (e.g. Full Stack / AI Engineer)..."
                className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 pl-4 pr-32 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Instant Fit</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 pt-1"
              >
                <CheckCircle2 size={13} />
                <span>Ready! Upload your resume in the scan tab to start.</span>
              </motion.div>
            )}
          </form>

          {/* Quick Tags Proof */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-300">
              <Sparkles size={12} className="text-amber-400" />
              <span>50+ Stacks Supported</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Zap size={12} className="text-indigo-400" />
              <span>Instant Cosine Match</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
