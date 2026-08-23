import {
  LayoutDashboard,
  Upload,
  History,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function Sidebar({
  activeTab = "dashboard",
  setActiveTab = () => {},
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "upload",
      label: "Analyze Resume",
      icon: Upload,
    },
    {
      id: "history",
      label: "Resume History",
      icon: History,
    },
    {
      id: "chat",
      label: "AI Assistant",
      icon: MessageSquare,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 min-h-screen bg-slate-950 text-slate-300 border-r border-slate-800 flex-col flex-shrink-0">
      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/30">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              ResumeAI
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Screening & ATS
            </p>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}
      <div className="p-4 flex-1">
        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 mt-2">
          Navigation
        </p>

        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-sm font-medium ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40 font-semibold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : "text-slate-400"
                    }
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ================================================== */}
      {/* BOTTOM CTA */}
      {/* ================================================== */}
      <div className="p-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          <Upload size={16} />
          Analyze New Resume
        </button>
      </div>
    </aside>
  );
}