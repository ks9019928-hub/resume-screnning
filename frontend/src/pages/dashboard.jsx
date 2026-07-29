import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import UploadForm from "../components/upload/UploadForm";
import API from "../services/api";
import { getDashboardStats } from "../services/dashboard";

import ScoreCard from "../components/dashboard/ScoreCard";
import ResumeOverview from "../components/dashboard/ResumeOverview";
import SkillsCard from "../components/dashboard/SkillsCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import ResumeHistory from "../components/dashboard/ResumeHistory";
import ChatBox from "../components/chat/ChatBox";

function Dashboard() {
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);

  const handleAnalyze = async (file, jobDescription) => {
    if (!file || !jobDescription) {
      alert("Please upload resume and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/analyze-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-10">
          <h1 className="mb-8 text-4xl font-bold">
            Dashboard
          </h1>

          <UploadForm
            handleAnalyze={handleAnalyze}
            loading={loading}
          />

          {stats && (
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
              <ScoreCard
                title="Total Resumes"
                value={stats.total_resumes}
                color="text-blue-600"
              />

              <ScoreCard
                title="Average ATS"
                value={`${stats.average_ats}%`}
                color="text-green-600"
              />

              <ScoreCard
                title="Best Match"
                value={`${stats.best_match}%`}
                color="text-purple-600"
              />
            </div>
          )}

          {result && (
            <>
              <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-4">
                <ScoreCard
                  title="ATS Score"
                  value={`${result.ats_analysis.ats_score}%`}
                  color="text-blue-600"
                />

                <ScoreCard
                  title="Semantic Match"
                  value={`${result.semantic_match}%`}
                  color="text-green-600"
                />

                <ScoreCard
                  title="Skills"
                  value={result.skills.length}
                  color="text-purple-600"
                />

                <ScoreCard
                  title="Recommendations"
                  value={result.recommendations.length}
                  color="text-orange-600"
                />
              </div>

              <ResumeOverview result={result} />

              <SkillsCard skills={result.skills} />

              <RecommendationCard
                recommendations={result.recommendations}
              />

              <ResumeHistory />

              <ChatBox />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;