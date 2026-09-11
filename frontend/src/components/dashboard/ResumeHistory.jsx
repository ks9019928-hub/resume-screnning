import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Trash2, ArrowRight } from "lucide-react";
import { getResumeHistory, deleteResume } from "../../services/api";

function ResumeHistory({ onSelectResume }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getResumeHistory()
      .then((data) => {
        if (!isMounted) return;
        if (data && Array.isArray(data.resumes)) {
          setHistory(data.resumes);
        } else if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load resume history:", err);
        setError("Unable to load resume history.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (e, resumeId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteResume(resumeId);
      setHistory((prev) =>
        prev.filter((item) => item._id !== resumeId && item.id !== resumeId)
      );
    } catch (err) {
      console.error("Failed to delete resume:", err);
      alert("Failed to delete resume.");
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Recent";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-3xl p-6 sm:p-8 mt-6 border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-lg">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Resume Screening History
            </h2>
            <p className="text-xs text-slate-400">
              Your previously analyzed resumes and ATS benchmark logs
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-300 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
          {history.length} {history.length === 1 ? "Resume" : "Resumes"}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
          <span className="text-xs text-slate-400">Loading history...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FileText size={40} className="mx-auto mb-3 opacity-30 text-indigo-400" />
          <p className="font-semibold text-slate-300 text-sm">No resumes analyzed yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            Upload and scan a resume to view results and historical benchmarks here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((resume, index) => {
            const resumeId = resume._id || resume.id;
            const atsScore =
              resume.ats_score ?? resume.ats_analysis?.ats_score ?? 0;
            const matchScore =
              resume.match_score ?? resume.semantic_score ?? 0;

            return (
              <motion.div
                key={resumeId || index}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                onClick={() => onSelectResume && onSelectResume(resumeId)}
                className={`p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  onSelectResume ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors flex items-center justify-center flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-200 text-sm truncate max-w-xs md:max-w-md group-hover:text-indigo-300 transition-colors">
                      {resume.filename || "Resume Document"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Calendar size={12} />
                      <span>{formatDate(resume.created_at || resume.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="flex items-center gap-3">
                    {/* ATS Score */}
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">
                        ATS Score
                      </p>
                      <span className="font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg text-xs inline-block">
                        {Math.round(atsScore)}%
                      </span>
                    </div>

                    {/* Match Score */}
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">
                        Role Match
                      </p>
                      <span className="font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg text-xs inline-block">
                        {Math.round(matchScore)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {onSelectResume && (
                      <span className="p-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                        <ArrowRight size={16} />
                      </span>
                    )}

                    {resumeId && (
                      <button
                        type="button"
                        title="Delete Resume"
                        onClick={(e) => handleDelete(e, resumeId)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default ResumeHistory;