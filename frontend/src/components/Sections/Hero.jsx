import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
  FileText,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import DottedSurface from "../ui/DottedSurface";
import BackgroundPaths from "../ui/BackgroundPaths";
import BorderBeam from "../ui/BorderBeam";
import CardSpotlight from "../ui/CardSpotlight";
import CircularScoreGauge from "../ui/CircularScoreGauge";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 pb-20 px-6 overflow-hidden bg-slate-950">
      {/* 21st.dev Dynamic Interactive Backgrounds */}
      <DottedSurface
        className="opacity-45"
        dotColor="rgba(165, 180, 252, 0.45)"
        glowColor="rgba(99, 102, 241, 0.85)"
        speed={0.0016}
      />
      <BackgroundPaths className="opacity-40" />

      {/* Ambient Gradients */}
      <div className="ambient-glow-indigo top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="ambient-glow-purple bottom-10 right-1/4 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
        {/* Top Feature Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8 shadow-lg shadow-indigo-950/40"
        >
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">
            Next-Gen AI Resume Screening & ATS Matcher
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]"
        >
          Beat the ATS. Get Hired at <br />
          <span className="gradient-text">Top Tech Companies.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal"
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Zap size={18} />
            <span>Analyze Your Resume Free</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-white font-semibold text-sm backdrop-blur-md transition-all duration-200 hover:border-slate-700"
          >
            <FileText size={16} />
            <span>Sign In to Dashboard</span>
          </Link>
        </motion.div>

        {/* Floating Interactive Live Mockup Card with Laser Border and Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto relative"
        >
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent shadow-2xl">
            <CardSpotlight
              spotlightColor="rgba(99, 102, 241, 0.2)"
              borderColor="rgba(129, 140, 248, 0.5)"
              className="p-6 sm:p-8 text-left bg-slate-950/90"
            >
              {/* Animated Border Tracer Beam */}
              <BorderBeam size={260} duration={9} borderWidth={2} />

              {/* Window header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    resume_analysis_report.pdf
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 shadow-xs">
                    <CheckCircle2 size={13} /> ATS Passed (94%)
                  </span>
                </div>
              </div>

              {/* Grid preview inside mockup */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                {/* Score Box 1 with Circular Gauge */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between mb-3 text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">ATS Score</span>
                    <ShieldCheck size={16} className="text-emerald-400" />
                  </div>
                  <CircularScoreGauge
                    score={94}
                    size={110}
                    strokeWidth={8}
                    label="ATS Ready"
                    color="#10b981"
                    glowColor="rgba(16, 185, 129, 0.4)"
                  />
                  <p className="text-[11px] text-slate-400 mt-3">Optimal structure & keyword density</p>
                </div>

                {/* Score Box 2 with Circular Gauge */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between mb-3 text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Role Match</span>
                    <Target size={16} className="text-indigo-400" />
                  </div>
                  <CircularScoreGauge
                    score={89}
                    size={110}
                    strokeWidth={8}
                    label="Fit Rating"
                    color="#6366f1"
                    glowColor="rgba(99, 102, 241, 0.4)"
                  />
                  <p className="text-[11px] text-slate-400 mt-3">High alignment with target JD</p>
                </div>

                {/* Score Box 3 */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Extracted Skills
                      </span>
                      <Zap size={16} className="text-purple-400" />
                    </div>
                    <div className="text-3xl font-black text-purple-400">18 Found</div>
                    <p className="text-[11px] text-slate-400 mt-1">Key proficiencies identified</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {["React 19", "Python", "FastAPI", "Docker", "AWS"].map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Smart Recommendation preview banner */}
              <div className="mt-5 bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">AI Optimization Tip</p>
                    <p className="text-[11px] text-slate-400">
                      Add quantitative impact metrics to your recent lead engineering experience.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-lg">
                  <TrendingUp size={12} /> High Priority
                </span>
              </div>
            </CardSpotlight>
          </div>
        </motion.div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">50,000+</div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">Resumes Analyzed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">98.4%</div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">ATS Accuracy Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">3.5x</div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">Callback Boost</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 3 Sec</div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">Instant Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
}