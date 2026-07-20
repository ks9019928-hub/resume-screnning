import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import UploadForm from "../components/upload/UploadForm";
import { useState } from "react";
import API from "../services/api";
import ScoreCard from "../components/dashboard/ScoreCard";
import ResumeOverview from "../components/dashboard/ResumeOverview";
import SkillsCard from "../components/dashboard/SkillsCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import ChatBox from "../components/chat/ChatBox";

function Dashboard() {
    const [result, setResult] = useState(null);
    const [result, setResult] = useState(null);

const [loading, setLoading] = useState(false);
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
                    Authorization: `Bearer ${token}`
                }
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

          <h1 className="text-4xl font-bold mb-8">
  Dashboard
</h1>

{/* Upload Component */}

          <UploadForm
    handleAnalyze={handleAnalyze}
    loading={loading}
/>

          {/* Later we'll replace this JSON with cards */}

          {result && (
<>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

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
<SkillsCard skills={result.skills} />
 <ResumeOverview result={result} />
 <RecommendationCard

    recommendations={result.recommendations}

/><ChatBox />
</>
  
)}

        </main>

      </div>

    </div>

  );

}
export default Dashboard;