import { Search, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="hidden lg:flex items-center bg-slate-100/80 rounded-full px-4 py-2 w-96 border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-colors">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search resumes, skills, jobs..."
          className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-slate-700"
        />
      </div>

      {/* User Actions & Logout */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
            <User size={20} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.email ? user.email.split("@")[0] : user?.username || "Account"}
            </p>
            <p className="text-xs text-slate-400">
              {user?.email || "Signed In"}
            </p>
          </div>
        </div>

        <div className="h-7 w-px bg-slate-200 mx-2"></div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-200 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}