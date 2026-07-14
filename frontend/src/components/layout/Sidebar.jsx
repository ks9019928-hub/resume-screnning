import {
  LayoutDashboard,
  Upload,
  MessageSquare,
  User,
  Settings
} from "lucide-react";

function Sidebar() {

  return (

    <aside className="bg-slate-800 text-white w-64 min-h-screen p-6">

      <h2 className="text-xl font-bold mb-10">
        Navigation
      </h2>

      <ul className="space-y-6">

        <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
          <LayoutDashboard size={20}/>
          Dashboard
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
          <Upload size={20}/>
          Upload Resume
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
          <MessageSquare size={20}/>
          AI Chat
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
          <User size={20}/>
          Profile
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
          <Settings size={20}/>
          Settings
        </li>

      </ul>

    </aside>

  );

}

export default Sidebar;