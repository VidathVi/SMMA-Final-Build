"use client";

import React from "react";
import Calendar from "@/components/Calendar";
import { ScheduledPost } from "@/types/calendar";

export default function CalendarPage() {
  // Mock data for the calendar
  const mockPosts: ScheduledPost[] = [
    {
      id: "1",
      title: "Spring Campaign Launch",
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      platform: "instagram",
      status: "scheduled",
      author: "Admin User",
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
      author: "Community Mgr",
    },
    {
      id: "6",
      title: "Behind the Scenes Story",
      date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      platform: "instagram",
      status: "scheduled",
      author: "Admin User",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-8 flex flex-col font-sans">
      <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Calendar</h1>
          <p className="text-gray-500 mt-2">Manage and view your scheduled posts across all platforms.</p>
        </div>
        
        <div className="flex-1 w-full flex min-h-[700px]">
          <Calendar posts={mockPosts} />
        </div>
      </div>
    </div>
  );
}
