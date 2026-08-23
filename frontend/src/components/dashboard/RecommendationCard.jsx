import { Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';


function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <Sparkles className="text-amber-500" size={20} />
        AI Recommendations & Actionable Tips
      </h2>

      <div className="space-y-3">
        {recommendations.map((item, index) => {
          const message = typeof item === 'string' ? item : item.message || '';
          const priority = typeof item === 'object' ? item.priority : 'medium';
          const type = typeof item === 'object' ? item.type : 'general';

          return (
            <div
              key={index}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                priority === 'high'
                  ? 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700'
              }`}
            >
              <div className="mt-0.5 text-amber-600 flex-shrink-0">
                {priority === 'high' ? (
                  <AlertCircle size={18} />
                ) : type === 'success' ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : (
                  <Info size={18} className="text-indigo-500" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {typeof item === 'object' && item.skill && (
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
                      {item.skill}
                    </span>
                  )}
                  {typeof item === 'object' && item.priority && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : item.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.priority} priority
                    </span>
                  )}
                </div>
                <p className="leading-relaxed text-sm">{message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecommendationCard;