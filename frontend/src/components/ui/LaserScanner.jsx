import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Cpu, Search, Sparkles } from "lucide-react";

export default function LaserScanner({ fileName = "resume.pdf" }) {
  const steps = [
    { text: "Extracting Text & Layout Blocks", icon: FileText },
    { text: "Running Semantic Keyword Matching", icon: Search },
    { text: "Evaluating ATS Parsing & Format Index", icon: Cpu },
    { text: "Synthesizing AI Actionable Tips", icon: Sparkles },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="relative w-full max-w-md mx-auto p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Laser Sweep Line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] z-20 pointer-events-none"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Grid Scanner Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Target Doc Frame */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-950/50">
          <FileText size={32} className="animate-pulse text-indigo-400" />
        </div>

        <h4 className="text-sm font-bold text-white mb-1 truncate max-w-xs">
          Scanning {fileName}
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Neural ATS Analyzer is processing your document
        </p>

        {/* Live Step Progress Indicator */}
        <div className="w-full space-y-2.5 text-left">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 p-3 rounded-2xl text-xs transition-all ${
                  isCurrent
                    ? "bg-indigo-950/60 border border-indigo-500/40 text-white shadow-lg shadow-indigo-950/50"
                    : isDone
                    ? "bg-slate-900/40 border border-emerald-500/30 text-emerald-400"
                    : "bg-slate-900/20 border border-slate-800 text-slate-500"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? "bg-indigo-500 text-white animate-spin"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <Icon size={12} />
                </div>
                <span className="font-semibold">{step.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

