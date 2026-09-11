import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Check,
  Copy,
} from "lucide-react";
import CardSpotlight from "../ui/CardSpotlight";

export default function RecommendationCard({ recommendations }) {
  const [filter, setFilter] = useState("all");
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  if (!recommendations || recommendations.length === 0) return null;

  const toggleResolve = (idx) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const copyTip = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = recommendations.filter((item) => {
    if (filter === "all") return true;
    const priority =
      typeof item === "object" ? item.priority?.toLowerCase() : "medium";
    return priority === filter;
  });

  const highCount = recommendations.filter(
    (r) => typeof r === "object" && r.priority === "high"
  ).length;

  return (
    <CardSpotlight
      spotlightColor="rgba(245, 158, 11, 0.12)"
      borderColor="rgba(245, 158, 11, 0.35)"
      className="p-6 sm:p-8 mt-6 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              AI Optimization Recommendations
              {highCount > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {highCount} High Priority
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Prioritized actionable fixes to optimize formatting, keywords, and recruiter impact
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({recommendations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("high")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === "high"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            High ({highCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("medium")}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filter === "medium"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Medium
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredItems.map((item, index) => {
            const message =
              typeof item === "string" ? item : item.message || "";
            const priority =
              typeof item === "object"
                ? item.priority || "medium"
                : "medium";
            const isResolved = resolvedIds.has(index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 group relative ${
                  isResolved
                    ? "bg-slate-900/40 border-slate-800/60 opacity-50"
                    : priority === "high"
                    ? "bg-gradient-to-r from-rose-950/20 to-slate-900/80 border-rose-500/30 text-white"
                    : priority === "medium"
                    ? "bg-gradient-to-r from-amber-950/20 to-slate-900/80 border-amber-500/30 text-white"
                    : "bg-slate-900/60 border-slate-800 text-white"
                }`}
              >
                {/* Checkbox button */}
                <button
                  type="button"
                  onClick={() => toggleResolve(index)}
                  title={isResolved ? "Mark as active" : "Mark as done"}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-colors flex-shrink-0 ${
                    isResolved
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : priority === "high"
                      ? "border-rose-400/40 text-rose-400 hover:bg-rose-500/20"
                      : "border-slate-600 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {isResolved ? (
                    <Check size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                </button>

                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {typeof item === "object" && item.skill && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.skill}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        priority === "high"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : priority === "medium"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {priority} Priority
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isResolved
                        ? "line-through text-slate-500"
                        : "text-slate-200 font-normal"
                    }`}
                  >
                    {message}
                  </p>
                </div>

                {/* Copy button */}
                <button
                  type="button"
                  onClick={() => copyTip(message, index)}
                  title="Copy suggestion"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white"
                >
                  {copiedId === index ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </CardSpotlight>
  );
}