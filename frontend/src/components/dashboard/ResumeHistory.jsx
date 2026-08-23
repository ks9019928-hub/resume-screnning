import { useEffect, useState } from "react";
import { FileText, Calendar, Trash2 } from "lucide-react";
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
      setHistory((prev) => prev.filter((item) => item._id !== resumeId && item.id !== resumeId));
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <FileText size={20} className="text-indigo-500" />
          Resume Screening History
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          {history.length} {history.length === 1 ? "Resume" : "Resumes"}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <FileText size={36} className="mx-auto mb-2 opacity-40" />
          <p className="font-medium text-slate-600">No resumes analyzed yet.</p>
          <p className="text-xs text-slate-400 mt-1">Upload a resume above to see your history.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {history.map((resume, index) => {
            const resumeId = resume._id || resume.id;
            const atsScore = resume.ats_score ?? resume.ats_analysis?.ats_score ?? 0;
            const matchScore = resume.match_score ?? resume.semantic_score ?? 0;

            return (
              <div
                key={resumeId || index}
                onClick={() => onSelectResume && onSelectResume(resumeId)}
                className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/80 transition-colors -mx-6 px-6 ${
                  onSelectResume ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-3 bg-indigo-50/70 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm truncate max-w-xs md:max-w-md">
                      {resume.filename || "Resume"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Calendar size={12} />
                      <span>{formatDate(resume.created_at || resume.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 justify-end">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 font-medium mb-0.5">ATS Score</p>
                    <p className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg text-xs inline-block">
                      {Math.round(atsScore)}%
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 font-medium mb-0.5">Match Score</p>
                    <p className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg text-xs inline-block">
                      {Math.round(matchScore)}%
                    </p>
                  </div>

                  {resumeId && (
                    <button
                      type="button"
                      title="Delete Resume"
                      onClick={(e) => handleDelete(e, resumeId)}
                      className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ResumeHistory;