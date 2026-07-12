"use client";

import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="h-20 bg-[#223c8f] border-b border-blue-700/30 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0 transition-all shadow-md">
      {/* Search / Command Palette Taser */}
      <div className="flex-1 max-w-lg">
        <div className="relative group hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-blue-200 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 border-blue-900/30 rounded-xl text-sm bg-[#0c142c] border focus:bg-[#101b42] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-white placeholder-blue-300/50"
            placeholder="Search campaigns, workflows, or people..."
          />
        </div>
        <button className="sm:hidden p-2.5 text-blue-200 hover:bg-[#101b42]/50 rounded-xl transition-colors cursor-pointer">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Notifications */}
        <div className="relative px-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-blue-200 hover:text-white focus:outline-none transition-colors rounded-xl hover:bg-[#2c4cb0] relative border border-transparent cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 block h-2.5 w-2.5 rounded-full bg-rose-500 border border-[#223c8f]"></span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
