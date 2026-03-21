"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Calendar,
  Workflow,
  FolderSearch,
  CheckCircle,
  Gem,
  Orbit,
  Loader2,
  Upload,
  Bell
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "#", icon: Calendar },
    { name: "Workflows", href: "#", icon: Workflow },
    { name: "Approvals", href: "#", icon: CheckCircle },
    { name: "Unified Inbox", href: "/inbox", icon: MessageSquare },
    { name: "Analytics", href: "#", icon: BarChart3 },
    { name: "Publish Post", href: "/create-post", icon: Upload },
    { name: "Assets", href: "#", icon: FolderSearch },
  ];

  const handleNavClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    if (item.href === "#" || item.href === pathname) return;

    setIsNavigating(item.name);
    setTimeout(() => {
      setIsNavigating(null);
      router.push(item.href);
    }, 800);
  };

  return (
    <nav className="w-full bg-[#0A0A3C]/80 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between py-4 px-8 relative z-30 shadow-2xl">
      {/* Glowing accent border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>

      {/* Brand */}
      <div
        className="flex items-center group cursor-pointer mr-8"
        onClick={() => router.push("/dashboard")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Orbit className="w-7 h-7 text-blue-400 mr-3 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
        </motion.div>
        <span className="font-heading font-extrabold text-2xl tracking-tight text-white relative z-10 drop-shadow-md hidden sm:block">
          Orean<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">360</span>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex items-center justify-center overflow-x-auto custom-scrollbar mr-4">
        <ul className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/");
            const isLoading = isNavigating === item.name;

            return (
              <li key={item.name}>
                <motion.a
                  href={item.href}
                  onClick={(e: React.MouseEvent) => handleNavClick(item, e)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden group whitespace-nowrap ${isActive
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-1 rounded-t-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    />
                  )}

                  <div className="relative z-10 flex items-center">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 text-blue-400 animate-spin" />
                    ) : (
                      <item.icon className={`w-4 h-4 mr-2 transition-colors flex-shrink-0 ${isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "group-hover:text-blue-400"}`} />
                    )}
                    <span className="tracking-wide hidden md:block lg:block xl:block">{item.name}</span>
                  </div>
                </motion.a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Side Actions & Profile */}
      <div className="flex items-center gap-4 ml-auto shrink-0">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="p-2.5 text-slate-400 hover:text-white focus:outline-none transition-colors rounded-xl hover:bg-white/10 relative shadow-sm border border-transparent hover:border-white/5"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 block h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] border border-slate-900"></span>
        </motion.button>

        {/* User Profile */}
        <div className="pl-4 border-l border-white/10 flex items-center space-x-3 cursor-pointer group">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Jane Doe</span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Admin</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-slate-800 flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
            <span className="text-sm drop-shadow-md">JD</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
