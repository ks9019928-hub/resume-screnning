import { useEffect, useState } from "react";



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
      loadStats(); // refresh summary statistics
      setActiveTab("dashboard"); // focus on results
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "upload" && "Analyze Resume"}
                {activeTab === "history" && "Resume History"}
                {activeTab === "chat" && "AI Career Assistant"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                AI-Powered ATS resume screening, matching, and optimization
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* Top Aggregate Stats */}
          {stats && activeTab === "dashboard" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-8">
              <ScoreCard
                title="Total Resumes Screened"
                value={stats.total_resumes}
                color="text-indigo-600"
                type="primary"
              />

              <ScoreCard
                title="Average ATS Score"
                value={`${stats.average_ats}%`}
                color="text-emerald-600"
                type="success"
              />

              <ScoreCard
                title="Best Match Score"
                value={`${stats.best_match}%`}
                color="text-purple-600"
                type="purple"
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
          {result && (activeTab === "dashboard" || activeTab === "upload") && (
            <>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Analysis Results
                  </h2>
                  <button
                    onClick={() => setResult(null)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Analyze Another Resume
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <ScoreCard
                    title="ATS Score"
                    value={`${Math.round(atsScore)}%`}
                    color="text-emerald-600"
                    type="success"
                  />

                  <ScoreCard
                    title="Job Match Score"
                    value={`${Math.round(matchScore)}%`}
                    color="text-indigo-600"
                    type="primary"
                  />

                  <ScoreCard
                    title="Skills Found"
                    value={skillsList.length}
                    color="text-purple-600"
                    type="purple"
                  />

                  <ScoreCard
                    title="Actionable Tips"
                    value={recommendationsList.length}
                    color="text-amber-600"
                    type="warning"
                  />
                </div>

                <ResumeOverview result={result} />

                <SkillsCard
                  skills={skillsList}
                  skillsByCategory={skillsByCategory}
                />

                <RecommendationCard
                  recommendations={recommendationsList}
                />
              </div>
            </>
          )}

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