"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { ScheduledPost, PostPlatform } from "../types/calendar";

const platformIcons: Record<PostPlatform, React.ReactNode> = {
  facebook: <Facebook size={14} />,
  twitter: <Twitter size={14} />,
  instagram: <Instagram size={14} />,
  linkedin: <Linkedin size={14} />,
  youtube: <Youtube size={14} />,
};

const platformColors: Record<PostPlatform, string> = {
  facebook: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  twitter: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  instagram: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  linkedin: "bg-blue-600/20 text-blue-200 border-blue-600/30",
  youtube: "bg-red-500/20 text-red-300 border-red-500/30",
};

interface CalendarProps {
  posts: ScheduledPost[];
}

export default function Calendar({ posts }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getPostsForDay = (day: number) => {
    return posts.filter((post) => {
      const postDate = new Date(post.date);
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === currentDate.getMonth() &&
        postDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const selectedPosts = selectedDay
    ? getPostsForDay(selectedDay.getDate())
    : [];

  return (
    <div className="flex w-full h-full gap-6 flex-col lg:flex-row">
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-64 h-64 rounded-full blur-3xl opacity-10 bg-blue-500 group-hover:opacity-20 transition-opacity duration-1000"></div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20 border border-white/5 shadow-inner">
               <CalendarIcon className="text-blue-400 w-5 h-5" />
            </span>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5 border border-white/5"
            >
              <ChevronLeft size={20} className="text-slate-300" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5 border border-white/5"
            >
              <ChevronRight size={20} className="text-slate-300" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-4 mb-4 relative z-10">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-3 sm:gap-4 flex-1 relative z-10">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[100px] sm:min-h-[120px] rounded-xl bg-black/10 border border-white/5 shadow-inner" />
          ))}
          {days.map((day) => {
            const dayPosts = getPostsForDay(day);
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear();
            const isSelected = selectedDay?.getDate() === day;

            return (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={`day-${day}`}
                onClick={() =>
                  setSelectedDay(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  )
                }
                className={`min-h-[100px] sm:min-h-[120px] rounded-xl border p-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-400/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : isToday
                    ? "border-blue-500/30 bg-white/10"
                    : "bg-white/5 border border-white/10 hover:border-slate-400/50 hover:bg-white/10 shadow-lg"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-xs font-bold flex items-center justify-center w-7 h-7 rounded-full ${
                      isToday
                        ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        : "text-slate-300"
                    }`}
                  >
                    {day}
                  </span>
                  {dayPosts.length > 0 && (
                    <span className="text-[10px] font-bold bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/10">
                      {dayPosts.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 overflow-hidden h-[72px]">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className={`text-[10px] px-1.5 py-1 rounded border truncate flex items-center gap-1.5 ${
                        platformColors[post.platform]
                      }`}
                    >
                      {platformIcons[post.platform]}
                      <span className="truncate font-medium">{post.title}</span>
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="text-[10px] text-center text-slate-400 font-bold mt-1 tracking-wider uppercase">
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Side Panel for Selected Day Details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "100%", lg: { width: 340 } }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col shrink-0 lg:w-[340px]"
          >
            <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h3 className="font-extrabold text-white">
                {selectedDay.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-white/5"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              {selectedPosts.length === 0 ? (
                <div className="text-center text-slate-500 py-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5 mb-2">
                     <CalendarIcon size={24} className="opacity-40" />
                  </div>
                  <p className="text-sm font-medium">No posts scheduled</p>
                </div>
              ) : (
                selectedPosts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border flex flex-col gap-3 shadow-lg hover:brightness-110 transition-all ${
                      platformColors[post.platform]
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 font-bold truncate text-sm">
                        {platformIcons[post.platform]}
                        <span className="truncate">{post.title}</span>
                      </div>
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded bg-black/20 border border-white/10 text-white`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-black/10 text-xs font-semibold opacity-90">
                      <span className="flex items-center gap-1.5">
                         <div className="w-4 h-4 rounded-full bg-white/20 border border-white/10 shadow-inner flex items-center justify-center text-[8px] text-white">A</div>
                         {post.author}
                      </span>
                      <span>{new Date(post.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
