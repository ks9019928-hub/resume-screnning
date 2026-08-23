export default function ScoreCard({ title, value, subtitle, type = "default", color }) {
  const colors = {
    default: "text-slate-800 bg-slate-50 border-slate-200/80",
    success: "text-emerald-600 bg-emerald-50/70 border-emerald-200/70",
    primary: "text-indigo-600 bg-indigo-50/70 border-indigo-200/70",
    warning: "text-amber-600 bg-amber-50/70 border-amber-200/70",
    purple: "text-purple-600 bg-purple-50/70 border-purple-200/70",
  };

  const selectedColors = colors[type] || colors.default;
  const bgClass = selectedColors.split(' ').slice(1).join(' ');
  const textClass = color || selectedColors.split(' ')[0];

  return (
    <div className={`rounded-2xl shadow-sm border p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group transition-transform duration-300 ${bgClass}`}>
      <h3 className="text-slate-500 font-bold mb-2 text-xs uppercase tracking-wider">{title}</h3>
      <div className="flex items-baseline gap-1 mb-1">
        <h1 className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${textClass}`}>
          {value}
        </h1>
      </div>
      {subtitle && (
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white shadow-sm mt-1 text-slate-600`}>
          {subtitle}
        </span>
      )}
    </div>
  );
}