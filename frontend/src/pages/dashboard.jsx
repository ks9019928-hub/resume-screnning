import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Printer,
  Plus,
  X,
  ShieldCheck,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import UploadForm from "../components/upload/UploadForm";
import { analyzeResume, getDashboardStats, getResume } from "../services/api";

import ScoreCard from "../components/dashboard/ScoreCard";
import ResumeOverview from "../components/dashboard/ResumeOverview";
import SkillsCard from "../components/dashboard/SkillsCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import ResumeHistory from "../components/dashboard/ResumeHistory";
import ChatBox from "../components/chat/ChatBox";
import BackgroundPaths from "../components/ui/BackgroundPaths";
import CardSpotlight from "../components/ui/CardSpotlight";
import BorderBeam from "../components/ui/BorderBeam";
import CircularScoreGauge from "../components/ui/CircularScoreGauge";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getDashboardStats()
      .then((data) => {
        if (isMounted && data) {
          setStats(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAnalyze = async (file, jobDescription) => {
    if (!file) {
      alert("Please select a resume file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await analyzeResume(file, jobDescription);
      setResult(response);
      loadStats();
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Resume analysis error:", err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "An error occurred while analyzing the resume.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistoryResume = async (resumeId) => {
    try {
      setLoading(true);
      const res = await getResume(resumeId);
      if (res && res.resume) {
        setResult(res.resume);
        setActiveTab("dashboard");
      }
    } catch (err) {
      console.error("Failed to fetch resume details:", err);
    } finally {
      setLoading(false);
    }
  };

  const atsScore =
    result?.ats?.ats_score ??
    result?.ats_score ??
    result?.ats_analysis?.ats_score ??
    0;

  const matchScore =
    result?.matching?.match_score ??
    result?.match_score ??
    result?.matching?.semantic_score ??
    result?.semantic_score ??
    0;

  const skillsList =
    result?.analysis?.hard_skills ??
    result?.skills ??
    [];

  const skillsByCategory =
    result?.analysis?.skills_by_category ??
    result?.resume_analysis?.skills_by_category ??
    {};

  const recommendationsList =
    result?.recommendations ??
    [];

  const activeResumeId =
    result?.resume?.id ??
    result?._id ??
    result?.id;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-hidden">
      {/* 21st.dev Background Animated Paths & Ambient Glows */}
      <BackgroundPaths className="opacity-35" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="ambient-glow-indigo top-0 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="ambient-glow-purple bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <Navbar />

      <div className="flex flex-1 relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {/* Main Tab Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={13} />
                <span>AI Screening Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "upload" && "Analyze Resume"}
                {activeTab === "history" && "Resume History"}
                {activeTab === "chat" && "AI Career Copilot"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                AI-Powered ATS resume screening, semantic job matching, and real-time optimization
              </p>
            </div>

            {/* Header Action Buttons when results are present */}
            {result && activeTab === "dashboard" && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all shadow-md"
                >
                  <Printer size={15} />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setActiveTab("upload");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
                >
                  <Plus size={15} />
                  <span>Scan Another</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-rose-300 text-xs sm:text-sm font-medium flex items-center justify-between shadow-lg"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-rose-400 hover:text-rose-200 font-bold ml-4 p-1"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden overflow-x-auto gap-2 mb-6 pb-2 border-b border-slate-800">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "upload", label: "Upload & Scan" },
              { id: "history", label: "History" },
              { id: "chat", label: "AI Copilot" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-900 text-slate-400 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Top Aggregate Stats */}
          {stats && activeTab === "dashboard" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
              <ScoreCard
                title="Total Resumes Screened"
                value={stats.total_resumes}
                color="text-indigo-400"
                type="primary"
                subtitle="All Time"
              />

              <ScoreCard
                title="Average ATS Score"
                value={`${stats.average_ats}%`}
                color="text-emerald-400"
                type="success"
                subtitle="Compatibility"
                percentage={stats.average_ats}
              />

              <ScoreCard
                title="Best Match Score"
                value={`${stats.best_match}%`}
                color="text-purple-400"
                type="purple"
                subtitle="Peak Fit"
                percentage={stats.best_match}
              />
            </div>
          )}

          {/* Upload Form View */}
          {(activeTab === "upload" || (activeTab === "dashboard" && !result)) && (
            <div className="mb-8">
              <UploadForm
                onAnalyze={handleAnalyze}
                isLoading={loading}
              />
            </div>
          )}

          {/* Analysis Results View */}
          <AnimatePresence>
            {result && (activeTab === "dashboard" || activeTab === "upload") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 pt-8 border-t border-slate-800 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Screening & ATS Analysis Results
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Job Fit, Keyword Extraction & Actionable Optimization Checklist
                    </p>
                  </div>
                </div>

                {/* Main Dynamic Gauge Showcase Card */}
                <CardSpotlight
                  spotlightColor="rgba(99, 102, 241, 0.15)"
                  borderColor="rgba(99, 102, 241, 0.4)"
                  className="p-6 sm:p-8 relative"
                >
                  <BorderBeam size={280} duration={10} borderWidth={1.5} />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                    {/* Gauge 1: ATS Score */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center gap-2 mb-3 text-emerald-400">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          ATS Compatibility
                        </span>
                      </div>
                      <CircularScoreGauge
                        score={Math.round(atsScore)}
                        size={120}
                        strokeWidth={9}
                        label={atsScore >= 80 ? "Pass" : atsScore >= 60 ? "Review" : "Warning"}
                        color="#10b981"
                        glowColor="rgba(16, 185, 129, 0.4)"
                      />
                      <span className="mt-3 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                        {atsScore >= 80 ? "Ready for Submission" : "Optimize Before Applying"}
                      </span>
                    </div>

                    {/* Gauge 2: Role Fit Match */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center gap-2 mb-3 text-indigo-400">
                        <Target size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Job Fit Score
                        </span>
                      </div>
                      <CircularScoreGauge
                        score={Math.round(matchScore)}
                        size={120}
                        strokeWidth={9}
                        label={matchScore >= 75 ? "High Fit" : "Moderate"}
                        color="#6366f1"
                        glowColor="rgba(99, 102, 241, 0.4)"
                      />
                      <span className="mt-3 text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-0.5 rounded-full">
                        {matchScore >= 75 ? "Strong Candidate" : "Add Missing Skills"}
                      </span>
                    </div>

                    {/* Extracted Stats Summary */}
                    <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 h-full">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Skills Detected
                          </span>
                          <Zap size={16} className="text-purple-400" />
                        </div>
                        <div className="text-3xl font-black text-purple-400">
                          {skillsList.length}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Categorized across tech stacks & domain tools
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs font-medium text-slate-300">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>Matched: {result?.matching?.matched_skills?.length || 0}</span>
                      </div>
                    </div>

                    {/* Action Items Summary */}
                    <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 h-full">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Actionable Tips
                          </span>
                          <Sparkles size={16} className="text-amber-400" />
                        </div>
                        <div className="text-3xl font-black text-amber-400">
                          {recommendationsList.length}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          AI generated fixes to boost recruiter score
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs font-medium text-slate-300">
                        <AlertTriangle size={13} className="text-amber-400" />
                        <span>
                          {recommendationsList.filter((r) => typeof r === "object" && r.priority === "high").length} High Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </CardSpotlight>

                <ResumeOverview result={result} />

                <SkillsCard
                  skills={skillsList}
                  skillsByCategory={skillsByCategory}
                  matchedSkills={result?.matching?.matched_skills || []}
                  missingSkills={result?.matching?.missing_skills || []}
                />

                <RecommendationCard
                  recommendations={recommendationsList}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chatbot View or Attached to Current Result */}
          {(activeTab === "chat" || (activeTab === "dashboard" && result)) && (
            <ChatBox resumeId={activeResumeId} />
          )}

          {/* History View */}
          {(activeTab === "history" || (activeTab === "dashboard" && !result)) && (
            <ResumeHistory onSelectResume={handleSelectHistoryResume} />
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;