"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Image,
  Video,
  FileText,
  Trash2,
  Tag,
  Loader2,
  FolderOpen,
  X,
  Film,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Asset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  tags: string[];
  transcodingStatus: string;
  createdAt: string;
}

// Local state assets for demo (connected to API when backend is running)
const MOCK_ASSETS: Asset[] = [
  {
    id: "1",
    filename: "summer-collection.jpg",
    originalName: "summer-collection.jpg",
    mimeType: "image/jpeg",
    size: 2400000,
    url: "",
    tags: ["summer", "fashion"],
    transcodingStatus: "completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    filename: "product-demo.mp4",
    originalName: "product-demo.mp4",
    mimeType: "video/mp4",
    size: 15000000,
    url: "",
    tags: ["product", "demo"],
    transcodingStatus: "processing",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    filename: "brand-logo.png",
    originalName: "brand-logo.png",
    mimeType: "image/png",
    size: 150000,
    url: "",
    tags: ["branding", "logo"],
    transcodingStatus: "completed",
    createdAt: new Date().toISOString(),
  },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    setUploading(true);

    // Simulate upload (connect to API when backend runs)
    setTimeout(() => {
      const newAssets: Asset[] = Array.from(files).map((file, idx) => ({
        id: `upload-${Date.now()}-${idx}`,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        tags: [],
        transcodingStatus: file.type.startsWith("video/") ? "pending" : "completed",
        createdAt: new Date().toISOString(),
      }));
      setAssets((prev) => [...newAssets, ...prev]);
      setUploading(false);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (selectedAsset?.id === id) setSelectedAsset(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType.startsWith("video/")) return Video;
    return FileText;
  };

  const filteredAssets = assets
    .filter((a) => {
      if (filterType === "images") return a.mimeType.startsWith("image/");
      if (filterType === "videos") return a.mimeType.startsWith("video/");
      return true;
    })
    .filter(
      (a) =>
        a.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
            Assets
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your media library. Upload, organize, and tag assets.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload Files
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </motion.div>

      {/* Drag & Drop Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragOver
            ? "border-blue-500 bg-blue-500/10"
            : "border-white/10 hover:border-white/20 bg-white/5"
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 ${dragOver ? "text-blue-400" : "text-slate-500"}`} />
        <p className="text-sm text-slate-400">
          Drag and drop files here, or{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:text-blue-300 font-bold"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-slate-500 mt-1">Images and videos up to 100MB</p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or tag..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { id: "all", label: "All" },
            { id: "images", label: "Images" },
            { id: "videos", label: "Videos" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === filter.id
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-400"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-slate-400"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Assets Grid/List */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No assets found</h3>
          <p className="text-sm text-slate-400">Upload your first files to get started.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset, idx) => {
            const FileIcon = getFileIcon(asset.mimeType);
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedAsset(asset)}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden cursor-pointer group hover:border-white/20 transition-all"
              >
                <div className="aspect-square bg-black/20 flex items-center justify-center relative">
                  {asset.url ? (
                    asset.mimeType.startsWith("video/") ? (
                      <video src={asset.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={asset.url} alt={asset.originalName} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <FileIcon className="w-10 h-10 text-slate-500" />
                  )}

                  {/* Transcoding badge */}
                  {asset.mimeType.startsWith("video/") && (
                    <div className="absolute top-2 right-2">
                      {asset.transcodingStatus === "processing" ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/80 text-white text-[9px] font-bold rounded-full">
                          <Loader2 className="w-3 h-3 animate-spin" /> Transcoding
                        </span>
                      ) : asset.transcodingStatus === "completed" ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/80 text-white text-[9px] font-bold rounded-full">
                          <CheckCircle className="w-3 h-3" /> Ready
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-500/80 text-white text-[9px] font-bold rounded-full">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                    className="absolute top-2 left-2 p-1 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3">
                  <p className="text-xs font-medium text-white truncate">{asset.originalName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatSize(asset.size)}</p>
                  {asset.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {asset.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-white/10 text-slate-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
          {filteredAssets.map((asset) => {
            const FileIcon = getFileIcon(asset.mimeType);
            return (
              <motion.div
                key={asset.id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                onClick={() => setSelectedAsset(asset)}
                className="flex items-center gap-4 p-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center shrink-0">
                  <FileIcon className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{asset.originalName}</p>
                  <p className="text-xs text-slate-400">{formatSize(asset.size)} • {asset.mimeType}</p>
                </div>
                <div className="flex items-center gap-3">
                  {asset.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-white/10 text-slate-300 rounded">
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-slate-500">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
