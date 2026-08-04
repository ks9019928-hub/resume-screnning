import React from 'react';

function ResumeOverview({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-5">
        Resume Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <span className="text-sm text-slate-400 mb-1">File Name</span>
          <div className="flex items-center gap-2 font-medium text-slate-700 break-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            {result.filename}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-slate-400 mb-1">Total Skills Found</span>
          <span className="font-semibold text-2xl text-slate-800">
            {result.skills?.length || 0}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-slate-400 mb-1">Actionable Tips</span>
          <span className="font-semibold text-2xl text-slate-800">
            {result.recommendations?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ResumeOverview;