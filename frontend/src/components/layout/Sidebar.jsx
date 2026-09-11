import { motion } from "framer-motion";
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
      label: "AI Copilot",
      icon: MessageSquare,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 min-h-screen bg-slate-950/80 backdrop-blur-xl text-slate-300 border-r border-slate-800/80 flex-col flex-shrink-0 relative z-20">
      {/* Navigation Links */}
      <div className="p-4 flex-1 mt-4">
        <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Workspace
        </p>

        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left text-sm font-semibold relative ${
                    isActive
                      ? "text-white bg-indigo-600 shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-white" : "text-slate-400"}
                  />
                  <span>{item.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveGlow"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Quick Action */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles size={15} />
          <span>New Resume Scan</span>
        </button>
      </div>
    </aside>
  );
}