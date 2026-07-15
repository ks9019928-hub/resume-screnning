import { useState } from "react";
import API from "../../services/api";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
      >
        Analyze Resume
      </button>

      {file && (
        <p className="mt-4 text-green-600">
          Selected: {file.name}
        </p>
      )}

    </div>
  );
}

export default UploadForm;