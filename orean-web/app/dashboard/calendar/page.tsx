"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";

interface CalendarPost {
  id: string;
  content: string;
  dueDate: string;
  status: { name: string };
  campaign: { id: string; title: string };
  platforms: string[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_DOT_COLORS: Record<string, string> = {
  Pending: "bg-amber-400",
  "In Review": "bg-blue-400",
  Approved: "bg-emerald-400",
  Scheduled: "bg-purple-400",
  Published: "bg-slate-400",
  Draft: "bg-slate-500",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadCalendarData();
  }, [year, month]);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi(
        `/api/calendar?year=${year}&month=${month + 1}`
      );
      if (res.ok) {
        const data = await res.json();
        setPosts(data.data || []);
      }
    } catch (e) {
      console.error("Failed to load calendar data", e);
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date().getDate());
  };

  // Calendar grid calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  // Group posts by day
  const postsByDay: Record<number, CalendarPost[]> = {};
  posts.forEach((post) => {
    if (post.dueDate) {
      const date = new Date(post.dueDate);
      if (date.getMonth() === month && date.getFullYear() === year) {
        const day = date.getDate();
        if (!postsByDay[day]) postsByDay[day] = [];
        postsByDay[day].push(post);
      }
    }
  });

  const selectedDayPosts = selectedDay ? postsByDay[selectedDay] || [] : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Content Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Schedule and manage your content timeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
          >
            Today
          </button>
          <div className="flex items-center gap-2 bg-[#0c142c] border border-blue-900/30 rounded-xl p-1">
            <button
              onClick={prevMonth}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-white px-3 min-w-[160px] text-center">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl overflow-hidden"
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
            {DAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[100px] p-2 border-b border-r border-white/5 bg-black/10"
              ></div>
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isToday = isCurrentMonth && today.getDate() === day;
              const dayPosts = postsByDay[day] || [];
              const isSelected = selectedDay === day;

              return (
                <motion.div
                  key={day}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[100px] p-2 border-b border-r border-white/5 cursor-pointer transition-all ${
                    isSelected ? "bg-blue-500/10 border-blue-500/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          : "text-slate-300"
                      }`}
                    >
                      {day}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  {/* Post indicators */}
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-1.5"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            STATUS_DOT_COLORS[post.status.name] || "bg-slate-400"
                          }`}
                        ></div>
                        <span className="text-[10px] text-slate-300 truncate">
                          {post.content.substring(0, 25)}
                        </span>
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-bold">
                        +{dayPosts.length - 3} more
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Day Detail Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl flex flex-col overflow-hidden shrink-0"
        >
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-400" />
              {selectedDay
                ? `${MONTHS[month]} ${selectedDay}, ${year}`
                : "Select a day"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedDay === null ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Click a day to see scheduled posts.
              </div>
            ) : selectedDayPosts.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No posts scheduled</p>
              </div>
            ) : (
              selectedDayPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0c142c] border border-blue-900/30 rounded-xl p-4 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        post.status.name === "Approved"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : post.status.name === "Pending"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {post.status.name}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto">
                      {post.campaign.title}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 line-clamp-2">
                    {post.content}
                  </p>
                  {post.platforms.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {post.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
