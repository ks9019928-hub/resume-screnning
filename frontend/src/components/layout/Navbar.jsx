import React from "react";
import { Search, Bell } from "lucide-react";

export default function Navbar({ user }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      
      {/* Search Bar */}
      <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white transition-colors">
        <Search size={18} className="text-slate-400" />
        <input type="text" placeholder="Search resumes, jobs..." className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-slate-700" />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative">
          <Bell size={20} />
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{user?.name || "Demo User"}</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=68" alt="avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}