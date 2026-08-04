import React from "react";
import { LayoutDashboard, Upload, User, Settings, Bell, BarChart3, Bookmark } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="bg-slate-900 text-slate-300 w-64 min-h-screen border-r border-slate-800 flex flex-col hidden lg:flex">
      <div className="h-20 flex items-center px-8 border-b border-slate-800">
        <span className="text-xl font-bold tracking-tight text-white">Mindloop ATS</span>
      </div>
      
      <div className="p-4 flex-1">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-4">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}