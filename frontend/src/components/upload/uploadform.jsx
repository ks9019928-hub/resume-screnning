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


export default function UploadForm({
  handleAnalyze,
  loading,
}) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-5"
      />

      {/* Uploaded File Details */}

      {file && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">

          <h3 className="font-semibold text-green-700">
            Uploaded Resume
          </h3>

          <p className="mt-2 text-gray-700">
            📄 <strong>{file.name}</strong>
          </p>

          <p className="text-sm text-gray-600">
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>

          <p className="text-sm text-gray-600">
            Type: {file.type}
          </p>

        </div>
      )}

      <textarea
        rows="8"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste Job Description..."
        className="w-full rounded-xl border p-4"
      />

      <button
        onClick={() =>
          handleAnalyze(file, jobDescription)
        }
        className="mt-6 rounded-xl bg-black px-6 py-3 text-white"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

    </div>
  );
}

<span className="mt-2 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
  ✓ Ready for Analysis
</span>