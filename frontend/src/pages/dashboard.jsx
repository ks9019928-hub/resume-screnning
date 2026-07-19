import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import UploadForm from "../components/upload/UploadForm";
import { useState } from "react";
import API from "../services/api";
import ScoreCard from "../components/dashboard/ScoreCard";

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

            <pre className="mt-8 bg-black text-green-400 p-6 rounded-xl overflow-auto">

              {JSON.stringify(result, null, 2)}

            </pre>

          )}

        </main>

      </div>

    </div>

  );

}
export default Dashboard;