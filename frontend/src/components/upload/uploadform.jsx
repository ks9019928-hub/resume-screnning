import { useState, useRef } from "react";
import { FileUp, FileText, Bot, X, CheckCircle2 } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Upload Area */}
            <div className="space-y-3">
              <label className="block font-bold text-slate-800 text-sm uppercase tracking-wider">
                1. Upload Resume (PDF or DOCX) *
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
                  className={`h-64 flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-400"
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                    <FileUp size={28} />
                  </div>
                  <p className="font-semibold text-slate-700">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PDF or DOCX (Max 10 MB)
                  </p>
                </div>
              ) : (
                <div className="h-64 flex flex-col justify-center items-center border-2 border-indigo-200 rounded-xl bg-indigo-50/30 p-6 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                    <FileText size={32} />
                  </div>

                  <p className="font-bold text-slate-800 text-center break-all max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                    <CheckCircle2 size={14} /> Ready for analysis
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800 text-sm uppercase tracking-wider">
                  2. Job Description
                </label>
                <span className="text-xs text-slate-400 font-medium">Optional (For Matching)</span>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description to calculate semantic similarity, matching skills, and missing keywords..."
                className="w-full border border-slate-300 rounded-xl p-4 h-64 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none text-sm leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="w-full md:w-auto md:min-w-[280px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Bot size={20} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}