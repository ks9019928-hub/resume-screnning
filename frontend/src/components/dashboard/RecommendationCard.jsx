import React from 'react';

function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><polyline points="20 6 9 17 4 12"/></svg>
        AI Recommendations
      </h2>

      <div className="space-y-3">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-slate-700"
          >
            <div className="mt-0.5 text-amber-500 flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendationCard;