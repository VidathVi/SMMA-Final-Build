"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";
import {
  Workflow,
  Plus,
  Play,
  Pause,
  Trash2,
  Settings,
  ArrowRight,
  Loader2,
  Zap,
  Bell,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

interface WorkflowDef {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: { id: string; name: string };
  createdAt: string;
  _count: { nodes: number };
}

const NODE_TYPES = [
  { type: "trigger", label: "Post Drafted", icon: Zap, color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { type: "action", label: "AI Enhancement", icon: Settings, color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { type: "approval", label: "Manager Approval", icon: CheckCircle, color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { type: "action", label: "Send Notification", icon: Bell, color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { type: "action", label: "Schedule Post", icon: Clock, color: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: "", description: "" });
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/api/workflows");
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data.data || []);
      }
    } catch (e) {
      console.error("Failed to load workflows", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newWorkflow.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetchApi("/api/workflows", {
        method: "POST",
        body: JSON.stringify({
          ...newWorkflow,
          createdById: "system",
          nodes: [
            { type: "trigger", label: "Post Drafted", positionX: 100, positionY: 100 },
            { type: "approval", label: "Manager Approval", positionX: 400, positionY: 100 },
            { type: "action", label: "Schedule Post", positionX: 700, positionY: 100 },
          ],
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewWorkflow({ name: "", description: "" });
        loadWorkflows();
      }
    } catch (e) {
      console.error("Failed to create workflow", e);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetchApi(`/api/workflows/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadWorkflows();
        if (selectedWorkflow === id) setSelectedWorkflow(null);
      }
    } catch (e) {
      console.error("Failed to delete workflow", e);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await fetchApi(`/api/workflows/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !isActive }),
      });
      loadWorkflows();
    } catch (e) {
      console.error("Failed to toggle workflow", e);
    }
  };

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
            Workflows
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build automated approval pipelines for your content.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Workflow
        </motion.button>
      </motion.div>

      {/* Workflows List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Workflow className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No workflows yet</h3>
          <p className="text-sm text-slate-400 mb-4">Create a workflow to automate your content approval process.</p>

          {/* Example Pipeline Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-[#223c8f] border border-blue-800/25 rounded-2xl p-8 mt-8"
          >
            <h4 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider">Example Pipeline</h4>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {NODE_TYPES.slice(0, 4).map((node, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold flex items-center gap-2 ${node.color}`}
                  >
                    <node.icon className="w-4 h-4" />
                    {node.label}
                  </motion.div>
                  {idx < 3 && <ArrowRight className="w-4 h-4 text-slate-500" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((workflow, idx) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${workflow.isActive ? "bg-emerald-500/20" : "bg-slate-500/20"}`}>
                    <Workflow className={`w-5 h-5 ${workflow.isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{workflow.name}</h3>
                    {workflow.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{workflow.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggle(workflow.id, workflow.isActive)}
                    className={`p-2 rounded-lg transition-all ${workflow.isActive ? "text-emerald-400 hover:bg-emerald-500/20" : "text-slate-400 hover:bg-white/10"}`}
                  >
                    {workflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(workflow.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 border-t border-white/5">
                <span className={`px-2 py-0.5 rounded-full font-bold ${workflow.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"}`}>
                  {workflow.isActive ? "Active" : "Paused"}
                </span>
                <span>{workflow._count.nodes} nodes</span>
                <span className="ml-auto">{new Date(workflow.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1e1b4b]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">New Workflow</h2>
                <button onClick={() => setShowCreate(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-1 block">Name</label>
                  <input
                    type="text"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="e.g., Content Approval Pipeline"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-1 block">Description</label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none h-20"
                    placeholder="Describe the workflow purpose..."
                  />
                </div>
                <p className="text-xs text-slate-400">A default 3-step pipeline (Draft → Approval → Schedule) will be created. You can customize it later.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={creating || !newWorkflow.name.trim()}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {creating ? "Creating..." : "Create Workflow"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
