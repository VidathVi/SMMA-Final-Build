"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  BarChart3,
  CalendarDays,
  Workflow,
  FolderSearch,
  CheckCircle,
  Gem,
  Loader2,
  PenTool,
  Sparkles,
  FolderKanban,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Publisher", href: "/dashboard/publisher", icon: PenTool },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: FolderKanban },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
    { name: "Workflows", href: "/dashboard/workflows", icon: Workflow },
    { name: "Approvals", href: "/dashboard/approvals", icon: CheckCircle },
    { name: "Unified Inbox", href: "/dashboard/inbox", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Assets", href: "/dashboard/assets", icon: FolderSearch },
    { name: "GEO Engine", href: "/dashboard/geo-engine", icon: Sparkles },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleNavClick = (name: string, href: string, e: React.MouseEvent) => {
    if (pathname === href) return;
    e.preventDefault();
    setIsNavigating(name);
    setTimeout(() => {
      setIsNavigating(null);
      router.push(href);
    }, 800);
  };

  return (
    <div className="w-64 bg-[#14224d] text-white flex flex-col h-full border-r border-[#14224d]/10 transition-all duration-300 relative z-30 shadow-2xl">
      {/* Subtle accent border */}
      <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-white/5 opacity-50"></div>

      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 relative overflow-hidden group cursor-pointer">
        <div className="relative z-10 flex items-center">
          <img
            src="/logo-icon.png"
            alt="Logo Icon"
            className="w-10 h-10 mr-3 object-contain"
          />
          <span className="font-andora font-bold text-3xl tracking-normal text-white drop-shadow-md">
            Orean
            <span className="text-blue-400 ml-1.5 font-sans text-xl font-extrabold tracking-tight">
              360
            </span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] drop-shadow-sm">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isLoading = isNavigating === item.name;

          return (
            <motion.a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(item.name, item.href, e)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all relative overflow-hidden group ${
                isActive
                  ? "bg-[#223c8f] text-white shadow-[0_0_20px_rgba(34,60,143,0.15)] border border-blue-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500"
                />
              )}

              <div className="relative z-10 flex items-center w-full">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2.5 text-blue-400 animate-spin" />
                ) : (
                  <item.icon
                    className={`w-4 h-4 mr-2.5 transition-colors ${isActive ? "text-blue-400" : "group-hover:text-blue-400"}`}
                  />
                )}
                <span className="truncate tracking-wide">{item.name}</span>
              </div>
            </motion.a>
          );
        })}
      </nav>

      {/* Bottom Section (Settings & Workspace) */}
      <div className="p-4 border-t border-white/5 bg-black/10 space-y-3">
        {/* User Profile */}
        <div className="flex items-center px-3 py-1.5 space-x-3 cursor-pointer group rounded-lg hover:bg-white/5 transition-all">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-600/20">
            <span className="text-xs">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
              Jane Doe
            </p>
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mt-0.5">
              Admin
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => {
            localStorage.removeItem("orean360_token");
            window.location.href = "/login";
          }}
          whileHover={{ x: 4 }}
          className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/5 group"
        >
          <LogOut className="w-4 h-4 mr-2.5 group-hover:translate-x-1 transition-transform" />
          <span className="tracking-wide">Log Out</span>
        </motion.button>


      </div>
    </div>
  );
}
