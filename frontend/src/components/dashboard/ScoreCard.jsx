import React from 'react';

// Assuming you have a Card component in common. If not, here is a simple inline version
// to ensure it works without external dependencies for this example.
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

function ScoreCard({ title, value, colorClass }) {
  return (
    <Card className="flex flex-col justify-center items-center text-center relative overflow-hidden group hover:shadow-md transition-shadow">
      <h3 className="text-slate-500 font-medium mb-2">{title}</h3>
      <div className="flex items-baseline gap-1">
        <h1 className={`text-5xl font-bold tracking-tight ${colorClass || 'text-slate-800'}`}>
          {value}
        </h1>
        {typeof value === 'number' && <span className="text-xl font-semibold text-slate-400">%</span>}
      </div>
    </Card>
  );
}

export default ScoreCard;