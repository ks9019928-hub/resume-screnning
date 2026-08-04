import React, { useState } from "react";
import { FileUp, Type, Bot } from "lucide-react";

export default function UploadForm({ onAnalyze, isLoading }) {
  const [inputMode, setInputMode] = useState("text");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert("Please provide both Resume and Job Description text.");
      return;
    }
    onAnalyze(resumeText, jobDescription, "Pasted Text Resume");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button 
          onClick={() => setInputMode("text")}
          className={`flex-1 py-4 px-6 text-center font-bold flex items-center justify-center gap-2 transition-colors ${inputMode === "text" ? "bg-white text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <Type size={18} /> Paste Text
        </button>
        <button 
          onClick={() => setInputMode("file")}
          className={`flex-1 py-4 px-6 text-center font-bold flex items-center justify-center gap-2 transition-colors ${inputMode === "file" ? "bg-white text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <FileUp size={18} /> Upload PDF
        </button>
      </div>

      <div className="p-8">
        {inputMode === "text" ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-3">
              <label className="font-bold text-slate-800">1. Paste Your Resume</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the plain text of your resume here..."
                className="w-full border border-slate-300 rounded-xl p-4 h-64 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none text-sm leading-relaxed"
              ></textarea>
            </div>
            <div className="flex-1 space-y-3">
              <label className="font-bold text-slate-800">2. Paste Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the exact job description you are targeting..."
                className="w-full border border-slate-300 rounded-xl p-4 h-64 bg-slate-50 focus:bg-white focus:ring-2 focus:blue-500 focus:outline-none transition-all resize-none text-sm leading-relaxed"
              ></textarea>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col justify-center items-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500">
            <FileUp size={48} className="text-slate-400 mb-4" />
            <p className="font-semibold text-lg text-slate-700">Drag & Drop PDF Resume</p>
            <p className="text-sm mt-2">Connect to your backend upload API here.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading || (inputMode === "text" && (!resumeText || !jobDescription))}
            className="w-full md:w-auto md:min-w-[300px] mx-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            {isLoading ? "Analyzing..." : <><Bot size={20} /> Analyze Match</>}
          </button>
        </div>
      </div>
    </div>
  );
}