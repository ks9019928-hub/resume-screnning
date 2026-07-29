import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Search,
  Bell,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  "Home",
  "How It Works",
  "Philosophy",
  "Use Cases",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="relative w-8 h-8">

            <div className="absolute inset-0 rounded-full border border-white" />

            <div className="absolute inset-[4px] rounded-full border border-white/70" />

            <div className="absolute inset-[8px] rounded-full border border-white/40" />

          </div>

          <span className="text-lg font-semibold tracking-tight">
            Mindloop
          </span>

        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 text-sm text-white/65">

          {navItems.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-4"
            >
              <a
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="transition duration-300 hover:text-white"
              >
                {item}
              </a>

              {index !== navItems.length - 1 && (
                <span className="text-white/25">•</span>
              )}
            </div>
          ))}

        </nav>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center gap-3">

          <GlassIcon>
  <Home size={18} />
</GlassIcon>

<GlassIcon>
  <Search size={18} />
</GlassIcon>

<GlassIcon>
  <Bell size={18} />
</GlassIcon>

        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
        >
          <div className="flex flex-col py-6 px-6 space-y-5">

            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="text-white/70 hover:text-white transition"
              >
                {item}
              </a>
            ))}

            <div className="flex gap-4 pt-4">

              <GlassIcon>
  <Home size={18} />
</GlassIcon>

<GlassIcon>
  <Search size={18} />
</GlassIcon>

<GlassIcon>
  <Bell size={18} />
</GlassIcon>

            </div>

          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function GlassIcon({ children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="w-11 h-11 rounded-full
                 bg-white/[0.05]
                 backdrop-blur-xl
                 border border-white/10
                 flex items-center justify-center
                 text-white/80
                 hover:text-white
                 transition"
    >
      {children}
    </motion.button>
  );
}