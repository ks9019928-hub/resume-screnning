import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {

    if (!file || !jobDescription) {
      alert("Please upload a resume and add job description");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-resume",
        formData
      );

      setResult(response.data);

    } catch (error) {

      console.error(error);
      alert("Analysis failed");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-10">
          AI Resume Analyzer
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <input
            type="file"
            className="mb-6"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <textarea
            rows="10"
            placeholder="Paste Job Description"
            className="w-full border rounded-xl p-4 mb-6"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            onClick={handleAnalyze}
            className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

        </div>

        {result && (

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-4">
                Scores
              </h2>

              <p className="mb-2">
                <strong>Semantic Match:</strong>
                {" "}
                {result.semantic_match}%
              </p>

              <p>
                <strong>ATS Score:</strong>
                {" "}
                {result.ats_analysis.ats_score}
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-4">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">

                {result.skills.map((skill, index) => (

                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">

              <h2 className="text-2xl font-bold mb-4">
                Recommendations
              </h2>

              <ul className="list-disc pl-5 space-y-2">

                {result.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}

              </ul>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;