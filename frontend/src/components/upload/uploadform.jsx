import { useState } from "react";
import API from "../../services/api";

function UploadForm({ handleAnalyze, loading })  {
  const [file, setFile] = useState(null);

const [jobDescription, setJobDescription] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        Upload Resume
      </h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border rounded-lg p-3 mb-5"
      />

      <textarea
        rows="8"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste Job Description..."
        className="w-full border rounded-lg p-4 mb-6"
      />

      <button
    onClick={handleAnalyze}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
>
    {loading ? "Analyzing..." : "Analyze Resume"}
</button>

      {file && (
        <p className="mt-4 text-green-600">
          Selected: {file.name}
        </p>
      )}

    </div>
  );
}
const handleAnalyze = async () => {

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
                    "Content-Type": "multipart/form-data"
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

export default UploadForm;