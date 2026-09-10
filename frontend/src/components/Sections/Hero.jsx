import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Target, Zap, FileText, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-28 pb-20 px-6 overflow-hidden bg-slate-950">
      {/* Background Decorative Grids & Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="ambient-glow-indigo top-0 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="ambient-glow-purple bottom-10 right-1/4 translate-x-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
        {/* Top Feature Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8"
        >
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">
            Next-Gen AI Resume Screening & ATS Analyzer
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]"
        >
          Beat the ATS. Get Hired at <br />
          <span className="gradient-text">Top Tech Companies.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed"
        >
          Instant ATS compatibility scoring, deep semantic job description matching,
          and a personalized AI career coach to optimize every bullet point.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Zap size={18} />
            <span>Analyze Your Resume Free</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-medium text-sm backdrop-blur-md transition-all duration-200"
          >
            <FileText size={16} />
            <span>Sign In to Dashboard</span>
          </Link>
        </motion.div>

        {/* Floating Interactive Live Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto relative"
        >
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden text-left">
            {/* Window header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">resume_analysis_report.pdf</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={12} /> ATS Passed (94%)
                </span>
              </div>
            </div>

            {/* Grid preview inside mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Score Box 1 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">ATS Match Score</span>
                  <ShieldCheck size={16} className="text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">94%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "94%" }}></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Optimal formatting & keyword frequency</p>
              </div>

              {/* Score Box 2 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">Job Role Fit</span>
                  <Target size={16} className="text-indigo-400" />
                </div>
                <div className="text-3xl font-extrabold text-indigo-400">89%</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: "89%" }}></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Senior Full Stack Engineer JD match</p>
              </div>

              {/* Score Box 3 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">Extracted Skills</span>
                  <Zap size={16} className="text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-purple-400">18 Found</div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">React</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">Python</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">FastAPI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">Docker</span>
                </div>
              </div>
            </div>

            {/* Smart Recommendation preview banner */}
            <div className="mt-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">AI Optimization Tip</p>
                  <p className="text-[11px] text-slate-400">Add quantitative impact metrics to your recent lead engineering experience.</p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">High Priority</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <div className="text-2xl font-bold text-white">50,000+</div>
            <div className="text-xs text-slate-400 mt-0.5">Resumes Analyzed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-400">98.4%</div>
            <div className="text-xs text-slate-400 mt-0.5">ATS Accuracy Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">3.5x</div>
            <div className="text-xs text-slate-400 mt-0.5">Callback Boost</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">&lt; 3 Sec</div>
            <div className="text-xs text-slate-400 mt-0.5">Instant Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
}