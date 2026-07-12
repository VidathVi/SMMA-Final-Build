"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocialMedia } from "../../contexts/SocialMediaContext";
import {
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  PenTool,
  Share2,
  Sparkles,
  BarChart3,
  Loader2,
  Workflow,
} from "lucide-react";

export default function Dashboard() {
  const { connections } = useSocialMedia();

  const colorMap: Record<string, { bg: string; icon: string }> = {
    "text-blue-400": { bg: "bg-blue-950/50 border-blue-900/50", icon: "text-blue-400" },
    "text-amber-400": { bg: "bg-amber-950/40 border-amber-900/50", icon: "text-amber-400" },
    "text-purple-400": { bg: "bg-purple-950/40 border-purple-900/50", icon: "text-purple-400" },
    "text-emerald-400": { bg: "bg-emerald-950/40 border-emerald-900/50", icon: "text-emerald-400" },
  };

  const kpis = [
    {
      label: "Connected Accounts",
      value: connections.length.toString(),
      change: "Active",
      trend: connections.length > 0 ? "up" : "down",
      icon: Share2,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      label: "Pending Approvals",
      value: "5",
      change: "-1",
      trend: "down",
      icon: AlertCircle,
      color: "text-amber-400",
      bg: "bg-amber-500/20",
    },
    {
      label: "Avg. GEO Score",
      value: "94/100",
      change: "+5%",
      trend: "up",
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
    {
      label: "Total Engagement",
      value: "48.2k",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
    },
  ];

  const approvals = [
    {
      id: "APP-091",
      task: "Q3 Product Launch Video",
      type: "Creative",
      status: "urgent",
      requester: "Sarah J.",
      time: "2h ago",
    },
    {
      id: "APP-092",
      task: "Sinhala New Year Post",
      type: "Copy",
      status: "pending",
      requester: "Kasun P.",
      time: "4h ago",
    },
    {
      id: "APP-093",
      task: "Meta Ads Budget Increase",
      type: "Strategy",
      status: "pending",
      requester: "Mike T.",
      time: "1d ago",
    },
  ];


  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-2 border-b border-blue-900/20"
      >
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Global Overview
        </h1>
        <p className="text-sm text-blue-200/60 mt-1">
          Here&apos;s what&apos;s happening across your workspaces today.
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => {
          const config = colorMap[kpi.color] || { bg: "bg-blue-950/50 border-blue-900/50", icon: "text-blue-400" };
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 p-6 rounded-2xl shadow-md relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} border`}
                >
                  <kpi.icon className={`w-6 h-6 ${config.icon}`} />
                </div>
                <span
                  className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                    kpi.trend === "up"
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                      : "bg-slate-900/40 text-slate-400 border border-slate-800/40"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {kpi.change}
                </span>
              </div>

              <h3 className="text-4xl font-extrabold text-white tracking-tight relative z-10">
                {kpi.value}
              </h3>
              <p className="text-sm font-medium text-blue-200/60 mt-2 relative z-10">
                {kpi.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns Board (Takes 2 columns) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl shadow-md flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-blue-800/25 flex items-center justify-between bg-blue-950/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-400" />
              Campaign Pipeline
            </h2>
            <button className="text-blue-300 hover:text-white transition-colors p-1 bg-[#223c8f] hover:bg-[#2c4cb0] rounded-md border border-blue-800/25 cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex-1 relative min-h-[300px]">
            {/* A styled Kanban preview */}
            <div className="grid grid-cols-3 gap-6 h-full">
              {/* Column 1: Drafts */}
              <div className="bg-[#14224d] rounded-xl p-4 border border-blue-800/20 shadow-inner">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200/70">
                    Drafting
                  </span>
                  <span className="bg-blue-950/60 text-blue-300 text-xs py-0.5 px-2.5 rounded-full border border-blue-800/25 font-bold">
                    3
                  </span>
                </div>
                {/* Task Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#101b42] p-4 rounded-xl shadow-sm border border-blue-800/25 hover:border-blue-500/50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-950/60 text-blue-300 uppercase tracking-wider border border-blue-800/25">
                      Instagram
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight mb-3 group-hover:text-blue-300 transition-colors">
                    Summer Collection Reels
                  </h4>
                  <div className="flex items-center justify-between mt-4 py-2 border-t border-blue-900/25 text-xs text-blue-300/60">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1.5 text-blue-400" /> Due
                      Tomorrow
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Column 2: In Review */}
              <div className="bg-[#14224d] rounded-xl p-4 border border-blue-800/20 shadow-inner">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200/70">
                    In Review
                  </span>
                  <span className="bg-blue-950/60 text-blue-300 text-xs py-0.5 px-2.5 rounded-full border border-blue-800/25 font-bold">
                    2
                  </span>
                </div>
                {/* Task Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#101b42] p-4 rounded-xl shadow-sm border border-blue-800/20 border-l-2 border-l-amber-500 hover:border-blue-500/50 transition-colors cursor-pointer group mb-2"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-950/60 text-amber-300 uppercase tracking-wider border border-amber-900/50">
                      Multi-platform
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight mb-3 group-hover:text-amber-400 transition-colors">
                    Annual Report Highlights
                  </h4>
                  <div className="flex items-center mt-3 py-2 border-t border-blue-900/25">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-blue-950 shadow-sm"></div>
                      <div className="w-6 h-6 rounded-full bg-[#223c8f] border border-blue-800/25 flex items-center justify-center text-[9px] font-bold text-blue-300 shadow-sm">
                        +2
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Column 3: Scheduled */}
              <div className="bg-[#14224d] rounded-xl p-4 border border-blue-800/20 shadow-inner">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200/70">
                    Scheduled
                  </span>
                  <span className="bg-blue-950/60 text-blue-300 text-xs py-0.5 px-2.5 rounded-full border border-blue-800/25 font-bold">
                    5
                  </span>
                </div>
                {/* Task Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#101b42] p-4 rounded-xl shadow-sm border border-blue-800/25 hover:border-blue-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-950/60 text-slate-300 uppercase tracking-wider border border-slate-800/50">
                      LinkedIn
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-blue-300/50 leading-tight line-through">
                    CEO Interview Teaser
                  </h4>
                  <div className="mt-4 pt-2 border-t border-blue-900/25 text-[11px] font-bold text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Ready to
                    publish
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Action Items / Approvals (1 Column) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl shadow-md flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-blue-800/25 flex items-center justify-between bg-blue-950/20">
            <h2 className="text-lg font-bold text-white">Action Items</h2>
            <span className="px-2.5 py-1 bg-rose-950 border border-rose-900/50 text-rose-400 text-xs font-extrabold rounded-full">
              {approvals.length}
            </span>
          </div>
          <div className="p-0 flex flex-col divide-y divide-blue-800/20">
            {approvals.map((item, idx) => (
              <motion.div
                whileHover={{ backgroundColor: "rgba(44, 76, 176, 0.4)" }}
                key={idx}
                className="p-5 transition-colors cursor-pointer flex gap-4 items-start group border-b border-blue-800/20 last:border-b-0"
              >
                <div
                  className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${item.status === "urgent" ? "bg-rose-500 shadow-rose-500/25 animate-pulse" : "bg-amber-400 shadow-amber-400/25"}`}
                ></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-blue-50 truncate group-hover:text-blue-300 transition-colors">
                    {item.task}
                  </h4>
                  <p className="text-xs text-blue-300/50 mt-1.5 flex items-center gap-2 font-medium">
                    <span className="text-blue-300">{item.requester}</span>
                    <span className="text-blue-900">•</span>
                    <span>{item.time}</span>
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest bg-blue-950/60 border border-blue-800/25 px-2 py-1 rounded-md">
                    {item.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="p-4 border-t border-blue-800/25 mt-auto bg-blue-950/20">
            <button className="w-full py-2.5 text-sm font-bold text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-800/25 hover:border-transparent rounded-xl transition-all cursor-pointer">
              View All Tasks
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
