import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, LogOut, User, Zap, ArrowRight } from "lucide-react";
import { logoutUser } from "../../services/api";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header
      className={`h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 transition-colors backdrop-blur-xl ${
        isDashboard
          ? "bg-slate-900/90 border-b border-slate-800 text-white"
          : "bg-slate-950/80 border-b border-white/5 text-white"
      }`}
    >
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-950/50 group-hover:scale-105 transition-transform">
          <Sparkles className="text-white" size={20} />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            ResumeAI
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Screening
          </span>
        </div>
      </Link>

      {/* Navigation Links for Public/Landing Pages */}
      {!isDashboard && (
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <Link to="/dashboard" className="hover:text-white transition-colors">
            ATS Checker
          </Link>
        </nav>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {isDashboard ? (
          /* Dashboard User Info & Logout */
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                <User size={14} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-none">
                  {user?.email ? user.email.split("@")[0] : user?.username || "Dashboard User"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Free Plan</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-slate-700 hover:border-red-500/30 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          /* Public / Home Action Buttons */
          <div className="flex items-center gap-3">
            {token ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
                >
                  <Zap size={14} />
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}