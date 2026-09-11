import { motion } from "framer-motion";
import { CheckCircle2, Target, Award, Lightbulb, TrendingUp } from "lucide-react";

export default function ScoreCard({
  title,
  value,
  subtitle,
  type = "default",
  color,
  percentage,
}) {
  const configs = {
    default: {
      border: "border-slate-800 hover:border-slate-700",
      bgGlow: "from-slate-800/10 via-slate-900/5 to-transparent",
      accent: "text-slate-200",
      bar: "from-slate-500 to-slate-400",
      bgBar: "bg-slate-800/80",
      badge: "bg-slate-800 text-slate-300 border-slate-700",
      iconBg: "bg-slate-800/80 text-slate-300",
      icon: TrendingUp,
    },
    success: {
      border: "border-emerald-500/30 hover:border-emerald-500/60",
      bgGlow: "from-emerald-500/10 via-emerald-950/20 to-transparent",
      accent: "text-emerald-400",
      bar: "from-emerald-500 to-teal-400",
      bgBar: "bg-emerald-950/50",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      iconBg: "bg-emerald-500/20 text-emerald-400",
      icon: CheckCircle2,
    },
    primary: {
      border: "border-indigo-500/30 hover:border-indigo-500/60",
      bgGlow: "from-indigo-500/10 via-indigo-950/20 to-transparent",
      accent: "text-indigo-400",
      bar: "from-indigo-500 to-purple-500",
      bgBar: "bg-indigo-950/50",
      badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
      iconBg: "bg-indigo-500/20 text-indigo-400",
      icon: Target,
    },
    warning: {
      border: "border-amber-500/30 hover:border-amber-500/60",
      bgGlow: "from-amber-500/10 via-amber-950/20 to-transparent",
      accent: "text-amber-400",
      bar: "from-amber-500 to-orange-400",
      bgBar: "bg-amber-950/50",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      iconBg: "bg-amber-500/20 text-amber-400",
      icon: Lightbulb,
    },
    purple: {
      border: "border-purple-500/30 hover:border-purple-500/60",
      bgGlow: "from-purple-500/10 via-purple-950/20 to-transparent",
      accent: "text-purple-400",
      bar: "from-purple-500 to-pink-500",
      bgBar: "bg-purple-950/50",
      badge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
      iconBg: "bg-purple-500/20 text-purple-400",
      icon: Award,
    },
  };

  const currentConfig = configs[type] || configs.default;
  const IconComponent = currentConfig.icon;
  const numericVal =
    typeof value === "string"
      ? parseInt(value, 10)
      : typeof value === "number"
      ? value
      : null;

  const progressPercent =
    percentage !== undefined
      ? percentage
      : !isNaN(numericVal) && String(value).includes("%")
      ? numericVal
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-3xl p-6 relative overflow-hidden bg-slate-900/90 backdrop-blur-xl border ${currentConfig.border} shadow-xl shadow-black/20 flex flex-col justify-between group transition-all`}
    >
      {/* Subtle background ambient gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentConfig.bgGlow} opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentConfig.iconBg} shadow-inner`}
            >
              <IconComponent size={16} />
            </div>
            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">
              {title}
            </h3>
          </div>

          {subtitle && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${currentConfig.badge}`}
            >
              {subtitle}
            </span>
          )}
        </div>

        <div className="my-3">
          <h1
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              color || currentConfig.accent
            }`}
          >
            {value}
          </h1>
        </div>
      </div>

      {/* Animated Glowing Progress Bar for % based cards */}
      {progressPercent !== null && (
        <div className="mt-2 relative z-10">
          <div
            className={`w-full h-2 rounded-full overflow-hidden ${currentConfig.bgBar} border border-white/5`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full bg-gradient-to-r ${currentConfig.bar} shadow-sm`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}