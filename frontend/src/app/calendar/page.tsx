"use client";

import React from "react";
import Calendar from "@/components/Calendar";
import { ScheduledPost } from "@/types/calendar";
import { motion } from "framer-motion";
import { Loader2, Plus } from "lucide-react";

export default function CalendarPage() {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const mockPosts: ScheduledPost[] = [
    {
      id: "1",
      title: "Spring Campaign Launch",
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      platform: "instagram",
      status: "scheduled",
      author: "Sarah J.",
    },
    {
      id: "2",
      title: "Product Announcement",
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      platform: "twitter",
      status: "scheduled",
      author: "Admin User",
    },
    {
      id: "3",
      title: "Weekly Update Video",
      date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      platform: "youtube",
      status: "draft",
      author: "Media Team",
    },
    {
      id: "4",
      title: "B2B Outreach Strategy",
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      platform: "linkedin",
      status: "published",
      author: "Sales Lead",
    },
    {
      id: "5",
      title: "Community Q&A Post",
      date: new Date().toISOString(),
      platform: "facebook",
      status: "scheduled",
      author: "Kasun P.",
    },
    {
      id: "6",
      title: "Behind the Scenes Story",
      date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      platform: "instagram",
      status: "scheduled",
      author: "Admin",
    },
  ];

  const handleCreate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 font-sans">
      
      {/* Page Header matching Dashboard */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Content Calendar</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and view your scheduled posts across all platforms.</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            disabled={isGenerating}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center min-w-[150px] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-xl"></div>
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin relative z-10" />
            ) : (
              <Plus className="w-4 h-4 mr-2 relative z-10" />
            )}
            <span className="relative z-10">{isGenerating ? "Creating..." : "Schedule Post"}</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 w-full flex min-h-[700px]"
      >
        <Calendar posts={mockPosts} />
      </motion.div>
    </div>
  );
}
