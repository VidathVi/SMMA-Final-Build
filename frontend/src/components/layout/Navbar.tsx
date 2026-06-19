"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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
  Bell,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  // User Profile
  const [userProfile, setUserProfile] = useState({
    fullName: "Jane Doe",
    avatar: "/default-avatar.png",
    workflowRole: "Admin",
  });

  useEffect(() => {
    const loadProfile = () => {
      const savedUser = localStorage.getItem("user_profile");
      if (savedUser) {
        try {
          setUserProfile(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing user profile in Navbar", e);
        }
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "user_profile") loadProfile();
    };

    loadProfile();
    window.addEventListener("storage_user_profile", loadProfile);
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage_user_profile", loadProfile);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true); // Defaults to true initially for long lists

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Approvals", href: "/approval", icon: CheckCircle },
    { name: "Unified Inbox", href: "/inbox", icon: MessageSquare },
    { name: "Analytics", href: "#", icon: BarChart3 },
    { name: "Publish Post", href: "/create-post", icon: Upload },
    { name: "GEO Studio", href: "/geo-studio", icon: Globe },
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
        className="flex items-center group cursor-pointer mr-8 relative"
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
          Orean
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            360
          </span>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex items-center relative overflow-hidden mx-4 h-14">
        {showLeftScroll && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-20 p-1 bg-gradient-to-r from-[#0A0A3C] via-[#0A0A3C]/80 to-transparent text-slate-300 hover:text-white h-full pr-4 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 drop-shadow-md" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 flex items-center justify-start overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 h-full"
        >
          <ul className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname?.startsWith(item.href + "/") && item.href !== "/");
              const isLoading = isNavigating === item.name;

              return (
                <li key={item.name}>
                  <motion.a
                    href={item.href}
                    onClick={(e: React.MouseEvent) => handleNavClick(item, e)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden group whitespace-nowrap ${
                      isActive
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
                        <item.icon
                          className={`w-4 h-4 mr-2 transition-colors flex-shrink-0 ${isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "group-hover:text-blue-400"}`}
                        />
                      )}
                      <span className="tracking-wide hidden md:block lg:block xl:block">
                        {item.name}
                      </span>
                    </div>
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </div>

        {showRightScroll && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-20 p-1 bg-gradient-to-l from-[#0A0A3C] via-[#0A0A3C]/80 to-transparent text-slate-300 hover:text-white h-full pl-4 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 drop-shadow-md" />
          </button>
        )}
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
        <a
          href="/personal-profile"
          className="pl-4 border-l border-white/10 flex items-center space-x-3 cursor-pointer group"
        >
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
              {userProfile.fullName}
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {userProfile.workflowRole || "Admin"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-slate-800 flex items-center justify-center text-white font-extrabold shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform overflow-hidden relative">
            {userProfile.avatar &&
            userProfile.avatar !== "/default-avatar.png" ? (
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <span className="text-sm drop-shadow-md">
                {userProfile.fullName
                  ? userProfile.fullName
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "JD"}
              </span>
            )}
          </div>
        </a>
      </div>
    </nav>
  );
}
