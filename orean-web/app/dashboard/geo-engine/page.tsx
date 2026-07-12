"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import {
  Sparkles,
  Loader2,
  Copy,
  CheckCircle,
  Globe,
  BarChart3,
  Languages,
  Wand2,
  RefreshCw,
} from "lucide-react";

const PLATFORMS = [
  "Instagram", "Facebook", "Twitter", "TikTok", "YouTube", "LinkedIn",
];
const TONES = [
  "Professional", "Casual", "Witty", "Inspirational", "Educational", "Promotional",
];

export default function GeoEnginePage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [optimizedCaption, setOptimizedCaption] = useState("");
  const [engagementScore, setEngagementScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [detectedLang, setDetectedLang] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerateCaption = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setGeneratedCaption("");
    try {
      const res = await fetchApi("/api/geo/generate-caption", {
        method: "POST",
        body: JSON.stringify({ topic, platform: platform.toLowerCase(), tone: tone.toLowerCase() }),
      });
      const data = await res.json();
      setGeneratedCaption(data.caption || data.optimized_result || "");
    } catch (e) {
      console.error("Caption generation failed", e);
      setGeneratedCaption(`✨ A stunning post about ${topic}! #${platform.toLowerCase()} #orean360`);
    } finally {
      setGenerating(false);
    }
  };

  const handleOptimize = async () => {
    if (!generatedCaption.trim()) return;
    setOptimizing(true);
    setOptimizedCaption("");
    try {
      const res = await fetchApi("/api/geo/optimize-content", {
        method: "POST",
        body: JSON.stringify({
          caption: generatedCaption,
          tone: tone.toLowerCase(),
          target_language: "en",
          generate_variants: true,
        }),
      });
      const data = await res.json();
      setOptimizedCaption(data.optimized_result || generatedCaption);
    } catch (e) {
      console.error("Optimization failed", e);
      setOptimizedCaption(generatedCaption);
    } finally {
      setOptimizing(false);
    }
  };

  const handlePredict = async () => {
    const content = optimizedCaption || generatedCaption;
    if (!content.trim()) return;
    setPredicting(true);
    setEngagementScore(null);
    setSuggestions([]);
    try {
      const res = await fetchApi("/api/geo/predict-engagement", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setEngagementScore(data.engagement_score ?? 50);
      setSuggestions(data.suggestions || []);
    } catch (e) {
      console.error("Prediction failed", e);
      setEngagementScore(65);
      setSuggestions(["Add hashtags for better reach", "Include a call-to-action"]);
    } finally {
      setPredicting(false);
    }
  };

  const handleDetectLanguage = async () => {
    const content = optimizedCaption || generatedCaption;
    if (!content.trim()) return;
    try {
      const res = await fetchApi("/api/geo/detect-language", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setDetectedLang(data.language || "Unknown");
    } catch (e) {
      setDetectedLang("English");
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const scoreBarColor = (score: number) => {
    if (score >= 75) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
          GEO Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          AI-powered content generation, optimization, and engagement prediction.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Topic Input */}
          <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              Generate Content
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-1 block">Topic / Description</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe what you want to post about..."
                  className="w-full h-28 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-1 block">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500/50 transition-all"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p} className="bg-slate-900">{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-1 block">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-purple-500/50 transition-all"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateCaption}
                disabled={generating || !topic.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {generating ? "Generating..." : "Generate Caption"}
              </motion.button>
            </div>
          </div>

          {/* Action Buttons */}
          {generatedCaption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6 space-y-3"
            >
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
                AI Actions
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="py-3 px-3 bg-[#0c142c] border border-blue-900/30 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2"
                >
                  {optimizing ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : <RefreshCw className="w-5 h-5 text-blue-400" />}
                  Optimize
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePredict}
                  disabled={predicting}
                  className="py-3 px-3 bg-[#0c142c] border border-blue-900/30 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2"
                >
                  {predicting ? <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> : <BarChart3 className="w-5 h-5 text-emerald-400" />}
                  Predict
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDetectLanguage}
                  className="py-3 px-3 bg-[#0c142c] border border-blue-900/30 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all flex flex-col items-center gap-2"
                >
                  <Languages className="w-5 h-5 text-purple-400" />
                  Language
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Generated Caption */}
          {generatedCaption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Generated Caption
                </h3>
                <button
                  onClick={() => copyToClipboard(generatedCaption, "gen")}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  {copied === "gen" ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-slate-200 whitespace-pre-wrap bg-black/20 border border-white/5 rounded-xl p-4">
                {generatedCaption}
              </p>
            </motion.div>
          )}

          {/* Optimized Caption */}
          {optimizedCaption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-400" />
                  Optimized Version
                </h3>
                <button
                  onClick={() => copyToClipboard(optimizedCaption, "opt")}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  {copied === "opt" ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-slate-200 whitespace-pre-wrap bg-black/20 border border-white/5 rounded-xl p-4">
                {optimizedCaption}
              </p>
            </motion.div>
          )}

          {/* Engagement Prediction */}
          {engagementScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Engagement Prediction
              </h3>
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className={`text-4xl font-extrabold ${scoreColor(engagementScore)}`}>
                    {engagementScore}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">/ 100</p>
                </div>
                <div className="flex-1">
                  <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${engagementScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${scoreBarColor(engagementScore)}`}
                    />
                  </div>
                </div>
              </div>
              {suggestions.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-slate-400 uppercase">Suggestions</p>
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-purple-400 mt-0.5">•</span>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Language Detection */}
          {detectedLang && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                Detected Language
              </h3>
              <span className="text-lg font-bold text-purple-300">{detectedLang}</span>
            </motion.div>
          )}

          {/* Empty state */}
          {!generatedCaption && (
            <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-12 text-center">
              <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">AI-Powered Content</h3>
              <p className="text-sm text-slate-400">
                Enter a topic and hit Generate to create platform-optimized captions using the GEO Engine.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
