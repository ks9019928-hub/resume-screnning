import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, CheckCircle2, AlertTriangle, Layers, Zap } from "lucide-react";
import CardSpotlight from "../ui/CardSpotlight";

export default function SkillsCard({
  skills,
  skillsByCategory,
  matchedSkills = [],
  missingSkills = [],
}) {
  const [activeView, setActiveView] = useState("categories");
  const skillList = Array.isArray(skills) ? skills : [];
  const hasMatchingData =
    matchedSkills.length > 0 || missingSkills.length > 0;

  if (
    skillList.length === 0 &&
    (!skillsByCategory || Object.keys(skillsByCategory).length === 0)
  ) {
    return null;
  }

  return (
    <CardSpotlight
      spotlightColor="rgba(168, 85, 247, 0.12)"
      borderColor="rgba(168, 85, 247, 0.35)"
      className="p-6 sm:p-8 mt-6 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-lg">
            <Code2 size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Skills & Keyword Breakdown
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {skillList.length} Extracted
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Technical competencies detected across your resume and matched against job criteria
            </p>
          </div>
        </div>

        {hasMatchingData && (
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView("categories")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeView === "categories"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Skills
            </button>
            <button
              type="button"
              onClick={() => setActiveView("matching")}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeView === "matching"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              JD Match ({matchedSkills.length}/
              {matchedSkills.length + missingSkills.length})
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeView === "matching" && hasMatchingData ? (
          <motion.div
            key="matching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Matched Skills */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4">
                <CheckCircle2 size={16} />
                Matched Requirements ({matchedSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <span className="text-emerald-400 font-bold">✓</span>
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-4">
                <AlertTriangle size={16} />
                Missing from Resume ({missingSkills.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="bg-rose-900/40 text-rose-300 border border-rose-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <span className="text-rose-400 font-bold">+</span>
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : skillsByCategory && Object.keys(skillsByCategory).length > 0 ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {Object.entries(skillsByCategory).map(([category, items]) => {
              if (!items || items.length === 0) return null;
              const categoryTitle = category
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <div
                  key={category}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Layers size={13} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {categoryTitle}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium ml-auto px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                      {items.length} {items.length === 1 ? "skill" : "skills"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        whileHover={{ scale: 1.04, y: -1 }}
                        className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-indigo-400/50 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5"
          >
            {skillList.map((skill, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.04 }}
                className="bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
              >
                <Zap size={12} className="inline mr-1 text-indigo-400" />
                {skill}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </CardSpotlight>
  );
}