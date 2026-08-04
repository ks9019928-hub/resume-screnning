import React from "react";

export default function ScoreCard({ title, value, subtitle, type = "default" }) {
  const colors = {
    default: "text-slate-800 bg-slate-50 border-slate-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    primary: "text-indigo-600 bg-indigo-50 border-indigo-100",
    warning: "text-orange-600 bg-orange-50 border-orange-100"
  };

  const selectedColors = colors[type] || colors.default;
  const bgClass = selectedColors.split(' ').slice(1).join(' ');
  const textClass = selectedColors.split(' ')[0];

  return (
    <div className={`rounded-2xl shadow-sm border p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group transition-transform duration-300 ${bgClass}`}>
      <h3 className="text-slate-600 font-semibold mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <h1 className={`text-4xl lg:text-5xl font-bold tracking-tight ${textClass}`}>
          {value}
        </h1>
      </div>
      {subtitle && (
        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white shadow-sm ${textClass}`}>
          {subtitle}
        </span>
      )}
    </div>
  );
}