import React from "react";
import {
  LayoutDashboard,
  Upload,
  User,
  Settings,
  Bell,
  BarChart3,
  Bookmark,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
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
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 min-h-screen bg-slate-950 text-slate-300 border-r border-slate-800 flex-col">

      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}

      <div className="h-20 flex items-center px-7 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/30">
            <span className="text-white font-bold text-sm">
              AI
            </span>
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Mindloop
            </h1>

            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              AI Resume Screening
            </p>
          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <div className="p-4 flex-1">

        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">
          Menu
        </p>

        <ul className="space-y-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const isActive =
              activeTab === item.id;

            return (
              <li key={item.id}>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(item.id)
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >

                  <Icon
                    size={19}
                    className={
                      isActive
                        ? "text-white"
                        : "text-slate-500"
                    }
                  />

                  <span>
                    {item.label}
                  </span>

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
          onClick={() =>
            setActiveTab("upload")
          }
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >

          <Upload size={18} />

          Analyze New Resume

        </button>

      </div>

    </aside>
  );
}