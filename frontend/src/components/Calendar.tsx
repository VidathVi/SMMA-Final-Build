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
  facebook: "bg-blue-100 text-blue-600 border-blue-200",
  twitter: "bg-sky-100 text-sky-600 border-sky-200",
  instagram: "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200",
  linkedin: "bg-blue-50 text-blue-700 border-blue-200",
  youtube: "bg-red-100 text-red-600 border-red-200",
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const selectedPosts = selectedDay
    ? getPostsForDay(selectedDay.getDate())
    : [];

  return (
    <div className="flex w-full h-full gap-6">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <CalendarIcon className="text-blue-500" size={28} />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-4 flex-1">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[120px] rounded-xl bg-gray-50/50" />
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
                className={`min-h-[120px] rounded-xl border p-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/30"
                    : isToday
                    ? "border-blue-200 bg-blue-50/10"
                    : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-sm font-medium flex items-center justify-center w-7 h-7 rounded-full ${
                      isToday
                        ? "bg-blue-600 text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  {dayPosts.length > 0 && (
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 rounded-full py-0.5">
                      {dayPosts.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 overflow-hidden h-[72px]">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className={`text-xs px-2 py-1 rounded-md border truncate flex items-center gap-1.5 ${
                        platformColors[post.platform]
                      }`}
                    >
                      {platformIcons[post.platform]}
                      <span className="truncate">{post.title}</span>
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="text-xs text-center text-gray-500 font-medium">
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
            animate={{ opacity: 1, x: 0, width: 320 }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col shrink-0"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">
                {selectedDay.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3">
              {selectedPosts.length === 0 ? (
                <div className="text-center text-gray-400 py-10 flex flex-col items-center gap-2">
                  <CalendarIcon size={32} className="opacity-20" />
                  <p className="text-sm">No posts scheduled for this day.</p>
                </div>
              ) : (
                selectedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border flex flex-col gap-2 ${
                      platformColors[post.platform]
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5 font-medium truncate">
                        {platformIcons[post.platform]}
                        <span className="truncate">{post.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/50 border`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs opacity-80">
                      <span>{new Date(post.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>By {post.author}</span>
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
