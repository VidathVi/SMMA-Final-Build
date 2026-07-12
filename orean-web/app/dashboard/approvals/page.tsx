"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  Filter,
  RefreshCw,
} from "lucide-react";

interface ApprovalPost {
  id: string;
  content: string;
  status: { id: string; name: string };
  campaign: { id: string; title: string };
  assignedTo?: { id: string; name: string; email: string };
  platforms: string[];
  updatedAt: string;
  approvalComments: Array<{
    id: string;
    content: string;
    action?: string;
    author: { id: string; name: string };
    createdAt: string;
  }>;
  _count: { approvalComments: number };
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ApprovalPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/api/approvals");
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.data || []);
      }
    } catch (e) {
      console.error("Failed to load approvals", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (postId: string, action: "approve" | "reject" | "request_changes") => {
    setSubmitting(true);
    try {
      const res = await fetchApi(`/api/approvals/${postId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          action,
          authorId: "system",
          comment: commentText || undefined,
        }),
      });
      if (res.ok) {
        setCommentText("");
        loadApprovals();
        setSelectedPost(null);
      }
    } catch (e) {
      console.error("Failed to update approval", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetchApi(`/api/approvals/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ authorId: "system", content: commentText }),
      });
      if (res.ok) {
        setCommentText("");
        loadApprovals();
        // Reload selected post comments
        const updatedRes = await fetchApi(`/api/approvals/${postId}/comments`);
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          if (selectedPost) {
            setSelectedPost({ ...selectedPost, approvalComments: data.data || [] });
          }
        }
      }
    } catch (e) {
      console.error("Failed to add comment", e);
    } finally {
      setSubmitting(false);
    }
  };

  const statusFilters = ["all", "In Review", "Pending", "Changes Requested"];

  const filteredApprovals = filterStatus === "all"
    ? approvals
    : approvals.filter((a) => a.status.name === filterStatus);

  return (
    <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-5rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Approvals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review and approve content before publishing.
          </p>
        </div>
        <button
          onClick={loadApprovals}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === status
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10"
            }`}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      <div className="flex gap-6 h-[calc(100%-10rem)]">
        {/* Approvals List */}
        <div className="w-96 bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                Pending Review
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                {filteredApprovals.length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : filteredApprovals.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-slate-400">All caught up!</p>
              </div>
            ) : (
              filteredApprovals.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  onClick={() => setSelectedPost(post)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedPost?.id === post.id ? "bg-white/10 border-l-2 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        post.status.name === "In Review"
                          ? "bg-amber-500/20 text-amber-300"
                          : post.status.name === "Changes Requested"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-slate-500/20 text-slate-300"
                      }`}
                    >
                      {post.status.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="truncate">{post.campaign.title}</span>
                    {post._count.approvalComments > 0 && (
                      <span className="flex items-center gap-1 ml-auto">
                        <MessageSquare className="w-3 h-3" />
                        {post._count.approvalComments}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Detail / Comment Panel */}
        <div className="flex-1 bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl flex flex-col overflow-hidden">
          {selectedPost ? (
            <>
              {/* Post Preview */}
              <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Content Review</h3>
                    <p className="text-xs text-slate-400">
                      Campaign: {selectedPost.campaign.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(selectedPost.id, "approve")}
                      disabled={submitting}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(selectedPost.id, "request_changes")}
                      disabled={submitting}
                      className="px-4 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5" /> Request Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(selectedPost.id, "reject")}
                      disabled={submitting}
                      className="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </motion.button>
                  </div>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">{selectedPost.content}</p>
                  {selectedPost.platforms.length > 0 && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                      {selectedPost.platforms.map((p) => (
                        <span key={p} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedPost.approvalComments.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No comments yet. Start the discussion below.
                  </div>
                ) : (
                  selectedPost.approvalComments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {comment.author.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{comment.author.name}</span>
                          {comment.action && (
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                comment.action === "approve"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : comment.action === "reject"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {comment.action.replace("_", " ")}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-white/10 bg-black/10">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(selectedPost.id)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddComment(selectedPost.id)}
                    disabled={!commentText.trim() || submitting}
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Select a post to review</h3>
              <p className="text-sm text-slate-400">Choose a post from the left panel to start reviewing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
