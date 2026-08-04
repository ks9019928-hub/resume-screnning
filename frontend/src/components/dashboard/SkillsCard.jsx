import React from 'react';

function SkillsCard({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        Extracted Skills
      </h2>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsCard;