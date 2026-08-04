import React, { useEffect, useState } from "react";

// Mock service for history to make it runnable without the actual backend
const MOCK_HISTORY = [
  { id: 1, filename: "John_Doe_Resume_2023.pdf", ats_score: 72, semantic_score: 65, date: "2023-10-12" },
  { id: 2, filename: "John_Doe_Resume_Updated.pdf", ats_score: 85, semantic_score: 82, date: "2023-11-05" },
  { id: 3, filename: "JDoe_Frontend_Dev.pdf", ats_score: 94, semantic_score: 89, date: "2024-01-20" },
];

const mockGetResumeHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_HISTORY), 800);
  });
};

function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        // Replace mockGetResumeHistory with your actual getResumeHistory import when ready
        // import { getResumeHistory } from "../../services/history";
        const data = await mockGetResumeHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-8">
      <h2 className="text-2xl font-semibold text-slate-800 mb-5">
        Resume History
      </h2>

      {loading ? (
         <div className="flex justify-center items-center py-8">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
         </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
           <p>No resumes uploaded yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {history.map((resume, index) => (
             <div
               key={index}
               className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50 transition-colors -mx-6 px-6"
             >
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {resume.filename}
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">{resume.date}</p>
                  </div>
               </div>

               <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">ATS Score</p>
                    <p className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm">
                      {resume.ats_score}%
                    </p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Semantic Match</p>
                    <p className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">
                      {resume.semantic_score}%
                    </p>
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumeHistory;