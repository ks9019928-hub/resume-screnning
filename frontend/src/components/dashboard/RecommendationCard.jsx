function RecommendationCard({ recommendations }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-5">
        AI Recommendations
      </h2>

      <div className="space-y-4">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-lg"
          >
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendationCard;