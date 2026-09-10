import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileUp,
  FileText,
  Bot,
  X,
  CheckCircle2,
  Sparkles,
  FileCode,
  Briefcase,
} from "lucide-react";
import LaserScanner from "../ui/LaserScanner";
import BorderBeam from "../ui/BorderBeam";

const SAMPLE_JDS = [
  {
    title: "Full Stack Engineer",
    text: "Looking for a Full Stack Engineer proficient in React, Node.js, Python, PostgreSQL, and AWS. Experience with Docker, RESTful APIs, Git, and agile software development is required.",
  },
  {
    title: "AI / ML Engineer",
    text: "Seeking an AI/ML Engineer skilled in Python, FastAPI, PyTorch, LangChain, RAG pipelines, Vector Databases, Google Gemini / OpenAI APIs, Docker, and Model deployment.",
  },
  {
    title: "Frontend Specialist",
    text: "Seeking a Senior Frontend Developer skilled in React 19, TypeScript, Next.js, Tailwind CSS, Framer Motion, Vite, state management, and modern Web Performance / Core Web Vitals.",
  },
];

export default function UploadForm({ onAnalyze, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(extension)) {
      alert("Please select a valid PDF or DOCX file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10 MB limit.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select or upload a resume file (PDF or DOCX).");
      return;
    }
    onAnalyze(selectedFile, jobDescription);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
    >
      <BorderBeam size={280} duration={14} borderWidth={1.5} />

      {/* Top Header Banner */}
      <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              AI Resume Screening & Job Matcher
            </h3>
            <p className="text-[11px] text-slate-400">
              Upload your resume and target job description for comprehensive ATS scoring
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <CheckCircle2 size={12} />
          <span>PDF & DOCX Supported</span>
        </span>
      </div>

      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-6 flex flex-col items-center justify-center"
            >
              <LaserScanner fileName={selectedFile?.name || "resume.pdf"} />
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resume Upload Dropzone */}
                <div className="space-y-2.5">
                  <label className="block font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FileText size={15} className="text-indigo-400" />
                    Step 1: Upload Resume (PDF / DOCX) *
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-64 flex flex-col justify-center items-center border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                        isDragging
                          ? "border-indigo-400 bg-indigo-950/40 scale-[0.99] shadow-lg shadow-indigo-950/50"
                          : "border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-indigo-500/50"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-lg shadow-indigo-950/50"
                      >
                        <FileUp size={26} />
                      </motion.div>
                      <p className="font-bold text-white text-sm">
                        Click to browse or drop resume here
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports .PDF and .DOCX (Up to 10 MB)
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/90 border border-slate-700/80 px-2.5 py-0.5 rounded-lg">
                          ATS Format Check
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/90 border border-slate-700/80 px-2.5 py-0.5 rounded-lg">
                          100% Private
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col justify-center items-center border-2 border-indigo-500/40 rounded-2xl bg-indigo-950/20 p-6 relative">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors"
                      >
                        <X size={16} />
                      </button>

                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mb-3 shadow-xl shadow-indigo-950/50">
                        <FileCode size={30} />
                      </div>

                      <p className="font-bold text-white text-center break-all max-w-xs text-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB · Ready for parsing
                      </p>

                      <div className="mt-4 flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
                        <CheckCircle2 size={14} /> Ready for Screening
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Job Description */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Briefcase size={15} className="text-indigo-400" />
                      Step 2: Job Description (Optional)
                    </label>
                    <span className="text-[11px] text-indigo-400 font-semibold">
                      For Role Fit Matching
                    </span>
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description or requirements here to analyze semantic matching, missing keywords, and role fit..."
                    className="w-full border border-slate-800 rounded-2xl p-4 h-48 bg-slate-900/70 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/60 focus:outline-none transition-all resize-none text-xs sm:text-sm leading-relaxed text-slate-200 placeholder-slate-500"
                  ></textarea>

                  {/* Quick Sample Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Quick Presets:
                    </span>
                    {SAMPLE_JDS.map((sample) => (
                      <button
                        key={sample.title}
                        type="button"
                        onClick={() => setJobDescription(sample.text)}
                        className="text-[11px] font-medium text-slate-400 bg-slate-900/80 hover:bg-indigo-600/20 hover:text-indigo-300 hover:border-indigo-500/40 border border-slate-800 rounded-xl px-3 py-1 transition-all"
                      >
                        + {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex justify-center">
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="w-full sm:w-auto sm:min-w-[320px] flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Bot size={18} />
                  <span>Start AI Screening & Matching</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}