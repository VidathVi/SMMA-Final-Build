"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  tiktok: "#00f2ea",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
};

// Mock data for initial display (replaced by real API data when available)
const mockEngagementData = [
  { date: "Jun 1", engagement: 2400, reach: 8400, impressions: 12000 },
  { date: "Jun 5", engagement: 3100, reach: 9800, impressions: 15000 },
  { date: "Jun 10", engagement: 2800, reach: 10200, impressions: 14500 },
  { date: "Jun 15", engagement: 4200, reach: 13800, impressions: 19000 },
  { date: "Jun 20", engagement: 3800, reach: 12400, impressions: 17500 },
  { date: "Jun 25", engagement: 5100, reach: 15600, impressions: 22000 },
  { date: "Jun 30", engagement: 4700, reach: 14200, impressions: 20000 },
];

const mockPlatformData = [
  { name: "Instagram", value: 35, color: "#E4405F" },
  { name: "Facebook", value: 25, color: "#1877F2" },
  { name: "TikTok", value: 20, color: "#00f2ea" },
  { name: "Twitter", value: 12, color: "#1DA1F2" },
  { name: "YouTube", value: 8, color: "#FF0000" },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<any>(null);
  const [engagementData, setEngagementData] = useState(mockEngagementData);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, engagementRes] = await Promise.all([
        fetchApi("/api/analytics/overview"),
        fetchApi(`/api/analytics/engagement?days=${dateRange}`),
      ]);

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setOverview(data.data);
      }

      if (engagementRes.ok) {
        const data = await engagementRes.json();
        if (data.data?.length > 0) {
          setEngagementData(data.data);
        }
      }
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    {
      label: "Total Followers",
      value: overview?.totalFollowers?.toLocaleString() || "12.4k",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      label: "Engagement Rate",
      value: overview?.avgEngagement ? `${overview.avgEngagement.toFixed(1)}%` : "4.8%",
      change: "+1.2%",
      icon: Heart,
      color: "text-rose-400",
      bg: "bg-rose-500/20",
    },
    {
      label: "Total Reach",
      value: "48.2k",
      change: "+15%",
      icon: Eye,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
    },
    {
      label: "Published Posts",
      value: overview?.publishedPosts?.toString() || "156",
      change: "+12",
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
  ];

  const dateRanges = [
    { label: "7 Days", value: "7" },
    { label: "30 Days", value: "30" },
    { label: "90 Days", value: "90" },
  ];

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
            Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track performance across all your platforms.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0c142c] border border-blue-900/30 rounded-xl p-1">
          {dateRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                dateRange === range.value
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 ${kpi.bg}`}></div>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                {kpi.change}
              </span>
            </div>
            <h3 className="text-3xl font-extrabold text-white">{kpi.value}</h3>
            <p className="text-sm text-slate-400 mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Over Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Engagement Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#6366f1"
                fill="url(#engGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="reach"
                stroke="#06b6d4"
                fill="url(#reachGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-4">Platform Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockPlatformData}
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {mockPlatformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {mockPlatformData.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  ></div>
                  <span className="text-slate-300">{platform.name}</span>
                </div>
                <span className="text-white font-bold">{platform.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6"
      >
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Top Performing Content
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-slate-400 font-bold text-xs uppercase">Content</th>
                <th className="text-left py-3 px-4 text-slate-400 font-bold text-xs uppercase">Platform</th>
                <th className="text-left py-3 px-4 text-slate-400 font-bold text-xs uppercase">Engagement</th>
                <th className="text-left py-3 px-4 text-slate-400 font-bold text-xs uppercase">Reach</th>
                <th className="text-left py-3 px-4 text-slate-400 font-bold text-xs uppercase">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { content: "Summer Collection Launch 🌊", platform: "Instagram", engagement: "4.2k", reach: "18.5k", date: "Jun 15" },
                { content: "Behind the Scenes Reel", platform: "TikTok", engagement: "3.8k", reach: "22.1k", date: "Jun 18" },
                { content: "CEO Interview Highlights", platform: "LinkedIn", engagement: "2.1k", reach: "8.4k", date: "Jun 20" },
                { content: "Product Review Compilation", platform: "YouTube", engagement: "1.9k", reach: "12.3k", date: "Jun 22" },
              ].map((post, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{post.content}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-300 font-bold">{post.engagement}</td>
                  <td className="py-3 px-4 text-blue-300 font-bold">{post.reach}</td>
                  <td className="py-3 px-4 text-slate-400">{post.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
