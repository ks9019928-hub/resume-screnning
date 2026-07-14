function Navbar() {
  return (
    <nav className="bg-slate-900 text-white h-16 flex items-center justify-between px-8 shadow-lg">

      <h1 className="text-2xl font-bold">
        HireMind AI
      </h1>

      <div className="flex gap-6">

        <button className="hover:text-cyan-400">
          Dashboard
        </button>

        <button className="hover:text-cyan-400">
          Profile
        </button>

        <button className="hover:text-red-400">
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;