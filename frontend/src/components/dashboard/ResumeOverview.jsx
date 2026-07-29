function ResumeOverview({ result }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        Resume Overview
      </h2>

      <div className="space-y-3">

        <div>
          <span className="font-semibold">File Name:</span>{" "}
          {result.filename}
        </div>

        <div>
          <span className="font-semibold">Extracted Skills:</span>{" "}
          {result.skills.length}
        </div>

        <div>
          <span className="font-semibold">Recommendations:</span>{" "}
          {result.recommendations.length}
        </div>

      </div>
    </div>
  );
}

export default ResumeOverview;