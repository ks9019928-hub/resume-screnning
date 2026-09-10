import { motion } from "framer-motion";
import { ShieldCheck, Target, MessageSquare, Cpu, Sparkles, CheckCircle2 } from "lucide-react";



const features = [
  {
    icon: ShieldCheck,
    title: "Real-Time ATS Parsing Engine",
    description: "Scan your resume through industry-standard ATS algorithms. Identify formatting bottlenecks, font readability issues, and missing keyword sections before recruiters see it.",
    badge: "99% Parse Accuracy",
    color: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400",
    borderGlow: "hover:border-emerald-500/40",
  },
  {
    icon: Target,
    title: "Semantic Job Matching",
    description: "Compare your resume directly against any job description. Our cosine similarity engine analyzes semantic relevance beyond raw keyword matching.",
    badge: "AI Powered Match",
    color: "from-indigo-500/20 to-blue-500/5",
    iconColor: "text-indigo-400",
    borderGlow: "hover:border-indigo-500/40",
  },
  {
    icon: Cpu,
    title: "Deep Skill Gap Analysis",
    description: "Automatically categorized hard skills, libraries, frameworks, and domain expertise. Instantly highlights high-impact missing qualifications.",
    badge: "Instant Extraction",
    color: "from-purple-500/20 to-pink-500/5",
    iconColor: "text-purple-400",
    borderGlow: "hover:border-purple-500/40",
  },
  {
    icon: MessageSquare,
    title: "RAG AI Career Copilot",
    description: "Ask targeted questions about your resume. Get contextual bullet rewrites, tailored interview prep questions, and custom summary suggestions.",
    badge: "Gemini 2.5 Assistant",
    color: "from-amber-500/20 to-orange-500/5",
    iconColor: "text-amber-400",
    borderGlow: "hover:border-amber-500/40",
  },
];

export default function SearchChanged() {
  return (
    <section id="features" className="relative bg-slate-950 py-32 px-6 overflow-hidden">
      <div className="ambient-glow-purple top-1/2 left-1/3 -translate-y-1/2 opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles size={13} />
            Complete Resume Intelligence
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
          >
            Everything you need to <br />
            <span className="gradient-text">stand out in seconds.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-slate-400"
          >
            Built by engineers and recruiters to give job seekers the unfair advantage in today&apos;s competitive tech job market.
          </motion.p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`glass-panel rounded-3xl p-8 border border-white/10 ${feature.borderGlow} transition-all duration-300 relative group overflow-hidden`}
              >
                {/* Subtle gradient background highlight */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${feature.color} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Icon size={24} className={feature.iconColor} />
                    </div>
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-slate-300 group-hover:text-indigo-400 transition-colors">
                    <CheckCircle2 size={14} className="text-indigo-400" />
                    <span>Included in free analysis</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

