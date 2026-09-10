import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UploadCloud, FileSearch, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UploadCloud,
    title: "Upload Resume & Job Description",
    description: "Drop your PDF or DOCX file. Optionally paste the target job description to run customized role-specific matching.",
  },
  {
    step: "02",
    icon: FileSearch,
    title: "Instant ATS & Semantic Analysis",
    description: "Our dual-engine extracts hard skills, evaluates ATS parseability, calculates keyword density, and computes cosine similarity fit.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Optimize with AI Career Assistant",
    description: "Review prioritized fix recommendations, identify missing keywords, and chat live with the AI copilot to refine your bullet points.",
  },
];

const faqs = [
  {
    q: "How does the ATS Score calculation work?",
    a: "Our ATS engine evaluates 4 critical dimensions: keyword matching against standard taxonomies, formatting parseability (headings, fonts, tables), experience clarity, and contact completeness.",
  },
  {
    q: "Are my resume and personal details kept private?",
    a: "Yes. All resumes are securely processed with isolated session IDs. We never share, sell, or publicly index your resume data.",
  },
  {
    q: "Can I use this for multiple jobs and resumes?",
    a: "Absolutely. You can upload multiple versions, compare ATS scores against different job descriptions, and track your screening history directly in your dashboard.",
  },
];

export default function Mission() {
  return (
    <section id="how-it-works" className="bg-slate-950 py-32 px-6 relative overflow-hidden border-t border-slate-900">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
            How ResumeAI Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4">
            From raw document to optimized, interview-ready resume in under 30 seconds.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-panel rounded-3xl p-8 border border-white/10 relative group hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon size={22} />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-800 group-hover:text-indigo-500/30 transition-colors font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto pt-16 border-t border-slate-900">
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/5"
              >
                <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-indigo-400 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-400 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-28 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to land more interviews?
            </h3>
            <p className="text-slate-300 mt-4 text-sm sm:text-base">
              Upload your resume now and get your detailed ATS report with personalized suggestions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-lg"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}