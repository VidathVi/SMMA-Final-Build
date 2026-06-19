"use client";

import { useState } from "react";
import { Bell, Search, Command, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const [isAiLoading, setIsAiLoading] = useState(false);

  const triggerAi = () => {
    setIsAiLoading(true);
    setTimeout(() => setIsAiLoading(false), 2000);
  };

  return (
    <header className="h-20 bg-white/5 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-6 shrink-0 shadow-lg z-20 sticky top-0 transition-all">
      {/* Search / Command Palette Taser */}
      <div className="flex-1 max-w-lg">
        <div className="relative group hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-12 py-2.5 border-white/10 rounded-xl text-sm bg-black/20 border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500 hover:bg-white/5 shadow-inner"
            placeholder="Search campaigns, workflows, or people..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block border border-white/10 rounded-md px-2 py-0.5 text-[10px] font-sans font-bold text-slate-400 bg-black/40 shadow-sm">
              <Command className="w-3 h-3 inline-block -mt-0.5 mr-0.5" /> K
            </kbd>
          </div>
        </div>
        <button className="sm:hidden p-2.5 text-slate-300 hover:bg-white/10 rounded-xl transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* GEO AI Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerAi}
          disabled={isAiLoading}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 hover:text-white hover:from-purple-500/40 hover:to-indigo-500/40 transition-all rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.2)] border border-purple-500/30 overflow-hidden relative"
        >
          {isAiLoading ? (
            <Loader2 className="w-4 h-4 mr-2 shrink-0 animate-spin text-purple-300" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2 shrink-0 animate-pulse text-purple-400" />
          )}
          <span className="hidden sm:inline-block truncate">
            {isAiLoading ? "Processing..." : "AI Co-pilot"}
          </span>
        </motion.button>

        {/* Notifications */}
        <div className="relative px-1">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 text-slate-400 hover:text-white focus:outline-none transition-colors rounded-xl hover:bg-white/10 relative shadow-sm border border-transparent hover:border-white/5"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 block h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] border border-slate-900"></span>
          </motion.button>
        </div>

        {/* User Profile */}
        <div className="pl-4 border-l border-white/10 flex items-center space-x-3 cursor-pointer group">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
              Jane Doe
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Admin
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-slate-800 flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
            <span className="text-sm drop-shadow-md">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
