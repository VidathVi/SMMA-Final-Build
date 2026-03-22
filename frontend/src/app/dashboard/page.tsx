"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Workflow
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const kpis = [
    { label: "Active Campaigns", value: "12", change: "+2", trend: "up", icon: Share2, color: "text-blue-400", bg: "bg-blue-500/20" },
    { label: "Pending Approvals", value: "5", change: "-1", trend: "down", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/20" },
    { label: "Avg. GEO Score", value: "94/100", change: "+5%", trend: "up", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/20" },
    { label: "Total Engagement", value: "48.2k", change: "+12%", trend: "up", icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  ];

  const approvals = [
    { id: "APP-091", task: "Q3 Product Launch Video", type: "Creative", status: "urgent", requester: "Sarah J.", time: "2h ago" },
    { id: "APP-092", task: "Sinhala New Year Post", type: "Copy", status: "pending", requester: "Kasun P.", time: "4h ago" },
    { id: "APP-093", task: "Meta Ads Budget Increase", type: "Strategy", status: "pending", requester: "Mike T.", time: "1d ago" },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      router.push("/create-post");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Global Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Here&apos;s what&apos;s happening across your workspaces today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] flex items-center justify-center min-w-[140px]"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Generate Report"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            disabled={isCreating}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center min-w-[150px] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-xl"></div>
            {isCreating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin relative z-10" />
            ) : (
              <PenTool className="w-4 h-4 mr-2 relative z-10" />
            )}
            <span className="relative z-10">{isCreating ? "Creating..." : "New Campaign"}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl relative overflow-hidden group"
          >
            {/* Soft decorative background glow */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 ${kpi.bg} group-hover:opacity-50 transition-opacity duration-500`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} border border-white/5 shadow-inner`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${kpi.trend === "up" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                }`}>
                {kpi.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {kpi.change}
              </span>
            </div>

            <h3 className="text-4xl font-extrabold text-white tracking-tight relative z-10 drop-shadow-md">{kpi.value}</h3>
            <p className="text-sm font-medium text-slate-400 mt-2 relative z-10">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Campaigns Board (Takes 2 columns) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-blue-400" />
              Campaign Pipeline
            </h2>
            <button className="text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-white/10">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex-1 relative min-h-[300px]">
            {/* A styled Kanban preview */}
            <div className="grid grid-cols-3 gap-6 h-full">

              {/* Column 1: Drafts */}
              <div className="bg-black/20 rounded-xl p-4 border border-white/5 shadow-inner">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Drafting</span>
                  <span className="bg-white/10 text-white text-xs py-0.5 px-2.5 rounded-full border border-white/10">3</span>
                </div>
                {/* Task Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push('/calendar?taskId=7')}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 hover:border-blue-400/50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300 uppercase tracking-wider border border-blue-500/20">Instagram</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-tight mb-3 group-hover:text-blue-300 transition-colors">Summer Collection Reels</h4>
                  <div className="flex items-center justify-between mt-4 py-2 border-t border-white/10 text-xs text-slate-400">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1.5 text-blue-400" /> Due Tomorrow
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Column 2: In Review */}
              <div className="bg-black/20 rounded-xl p-4 border border-white/5 shadow-inner">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">In Review</span>
                  <span className="bg-white/10 text-white text-xs py-0.5 px-2.5 rounded-full border border-white/10">2</span>
                </div>
                {/* Task Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push('/calendar?taskId=8')}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 border-l-2 border-l-amber-400 hover:border-l-amber-300 transition-colors cursor-pointer group mb-2"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 uppercase tracking-wider border border-amber-500/20">Multi-platform</span>
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-tight mb-3 group-hover:text-amber-300 transition-colors">Annual Report Highlights</h4>
                  <div className="flex items-center mt-3 py-2 border-t border-white/10">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border-2 border-slate-900 shadow-sm"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">+2</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Column 3: Scheduled */}
              <div className="bg-black/20 rounded-xl p-4 border border-white/5 shadow-inner">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Scheduled</span>
                  <span className="bg-white/10 text-white text-xs py-0.5 px-2.5 rounded-full border border-white/10">5</span>
                </div>
                {/* Task Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push('/calendar?taskId=9')}
                  className="bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/5 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-500/20 text-slate-300 uppercase tracking-wider border border-slate-500/20">LinkedIn</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300 leading-tight line-through decoration-slate-500">CEO Interview-Teaser</h4>
                  <div className="mt-4 pt-2 border-t border-white/5 text-[11px] font-bold text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Ready to publish
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
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h2 className="text-lg font-bold text-white">Action Items</h2>
            <span className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-extrabold rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]">{approvals.length}</span>
          </div>
          <div className="p-0 flex flex-col divide-y divide-white/5">
            {approvals.map((item, idx) => (
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                key={idx}
                className="p-5 transition-colors cursor-pointer flex gap-4 items-start group"
              >
                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 shadow-lg ${item.status === "urgent" ? "bg-rose-500 shadow-rose-500/50 animate-pulse" : "bg-amber-400 shadow-amber-400/50"}`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-blue-300 transition-colors">{item.task}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-2 font-medium">
                    <span className="text-slate-300">{item.requester}</span>
                    <span className="text-slate-600">•</span>
                    <span>{item.time}</span>
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest bg-white/10 border border-white/10 px-2 py-1 rounded-md">{item.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10 mt-auto bg-black/10">
            <button className="w-full py-2.5 text-sm font-bold text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              View All Tasks
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
