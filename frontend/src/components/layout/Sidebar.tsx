"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  BarChart3,
  Calendar,
  Workflow,
  FolderSearch,
  CheckCircle,
  Gem,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isNavigating, setIsNavigating] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Campaigns", href: "#", icon: Calendar },
    { name: "Workflows", href: "#", icon: Workflow },
    { name: "Approvals", href: "#", icon: CheckCircle },
    { name: "Unified Inbox", href: "/dashboard/inbox", icon: MessageSquare },
    { name: "Analytics", href: "#", icon: BarChart3 },
    { name: "Publish Post", href: "/create-post", icon: FolderSearch },
    { name: "Assets", href: "#", icon: FolderSearch },
  ];

  const handleNavClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(item.name);
    setTimeout(() => {
      setActiveItem(item.name);
      setIsNavigating(null);
      if (item.href !== "#") {
        router.push(item.href);
      }
    }, 800);
  };

  return (
    <div className={`${isCollapsed ? "w-24" : "w-72"} bg-[#0A0A3C]/80 backdrop-blur-3xl text-white flex flex-col h-full border-r border-white/10 transition-all duration-300 relative z-30 shadow-2xl shrink-0`}>
      {/* Glowing accent border */}
      <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/50 to-transparent opacity-50"></div>

      {/* Brand & Toggle */}
      <div className={`h-20 flex items-center ${isCollapsed ? "justify-center px-4" : "justify-between px-6"} border-b border-white/5 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center"></div>
        
        <div className={`flex items-center overflow-hidden cursor-pointer ${isCollapsed ? "hidden" : "flex-1"}`} onClick={() => !isCollapsed && router.push('/dashboard')}>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 shrink-0"
          >
            <Gem className="w-7 h-7 text-blue-400 mr-3 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
          </motion.div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="font-heading font-extrabold text-2xl tracking-tight text-white relative z-10 drop-shadow-md whitespace-nowrap"
            >
              Orean<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">360</span>
            </motion.span>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="relative z-20 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10 shrink-0"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {!isCollapsed && (
          <div className="px-4 mb-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] drop-shadow-sm">
            Main Menu
          </div>
        )}
        {navItems.map((item) => {
          const isActive = activeItem === item.name;
          const isLoading = isNavigating === item.name;

          return (
            <motion.a
              key={item.name}
              href={item.href}
              onClick={(e: React.MouseEvent) => handleNavClick(item, e)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
                isCollapsed ? 'justify-center px-0 mx-2' : 'px-4'
              } ${isActive
                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                />
              )}

              <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'w-full'}`}>
                {isLoading ? (
                  <Loader2 className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-3.5'} text-blue-400 animate-spin shrink-0`} />
                ) : (
                  <item.icon className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-3.5'} shrink-0 transition-colors ${isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "group-hover:text-blue-400"}`} />
                )}
                {!isCollapsed && <span className="truncate tracking-wide">{item.name}</span>}
              </div>
            </motion.a>
          );
        })}
      </nav>

      {/* Bottom Section (Settings & Workspace) */}
      <div className={`border-t border-white/5 bg-black/20 ${isCollapsed ? 'p-4 flex flex-col items-center' : 'p-6'}`}>
        <motion.button
          onClick={() => {
            localStorage.removeItem("orean360_token");
            window.location.href = "/signin";
          }}
          whileHover={{ x: isCollapsed ? 0 : 4 }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/5 group`}
        >
          <Settings className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-3.5'} group-hover:rotate-90 transition-transform duration-500 shrink-0`} />
          {!isCollapsed && <span className="tracking-wide">Log Out</span>}
        </motion.button>

        {/* Workspace Card */}
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          className={`mt-6 ${isCollapsed ? 'p-2 justify-center w-full' : 'p-4'} bg-white/5 border border-white/10 rounded-2xl flex items-center shrink-0 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all group overflow-hidden relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-black shadow-[0_0_15px_rgba(96,165,250,0.4)] border border-white/20">
            T1
          </div>
          {!isCollapsed && (
            <div className="relative z-10 ml-3.5 min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">Team Alpha</p>
              <p className="text-[11px] font-semibold text-purple-300 uppercase tracking-widest mt-0.5">Pro Plan</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
