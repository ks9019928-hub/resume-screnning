import { Code2 } from 'lucide-react';

function SkillsCard({ skills, skillsByCategory }) {
  const skillList = Array.isArray(skills) ? skills : [];
  if (skillList.length === 0 && (!skillsByCategory || Object.keys(skillsByCategory).length === 0)) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <Code2 className="text-indigo-500" size={20} />
        Extracted Technical Skills
        <span className="text-xs text-slate-400 font-normal ml-auto">
          {skillList.length} skills detected
        </span>
      </h2>

      {skillsByCategory && Object.keys(skillsByCategory).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(skillsByCategory).map(([category, items]) => {
            if (!items || items.length === 0) return null;
            const categoryTitle = category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <div key={category} className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {categoryTitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50/70 text-indigo-700 border border-indigo-100/80 px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skillList.map((skill, index) => (
            <span
              key={index}
              className="bg-indigo-50/70 text-indigo-700 border border-indigo-100/80 px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillsCard;