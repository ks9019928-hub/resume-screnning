import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {

    if (!file || !jobDescription) {
      alert("Please upload resume and add job description");
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
      alert("Error analyzing resume");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1>AI Resume Analyzer</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <textarea
        rows="10"
        cols="70"
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={handleAnalyze}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {result && (

        <div style={{ marginTop: "40px" }}>

          <h2>Analysis Result</h2>

          <p>
            <strong>Skills:</strong>
            {" "}
            {result.skills.join(", ")}
          </p>

          <p>
            <strong>Semantic Match:</strong>
            {" "}
            {result.semantic_match}%
          </p>

          <p>
            <strong>ATS Score:</strong>
            {" "}
            {result.ats_analysis.ats_score}
          </p>

          <h3>Recommendations</h3>

          <ul>
            {result.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>

        </div>
      )}

    </div>
  );
}

export default App;