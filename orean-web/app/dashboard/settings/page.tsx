"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocialMedia } from "../../../contexts/SocialMediaContext";
import {
  User,
  Building2,
  Bot,
  Lock,
  CreditCard,
  AlertTriangle,
  Camera,
  Smartphone,
  Laptop,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  Share2,
  X,
  Loader2,
  ExternalLink,
  Unlink,
  Link2,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

/* ─── Settings Sidebar ─── */
function SettingsSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const menuItems = [
    { id: "personal", label: "Personal Profile", icon: User },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "social", label: "Connected Accounts", icon: Share2 },
    { id: "ai", label: "AI & Integrations", icon: Bot },
    { id: "security", label: "Security & Access", icon: Lock },
    { id: "billing", label: "Billing & Plan", icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-4 shrink-0 h-fit">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4 }}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === item.id
                ? "bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon
              className={`w-5 h-5 ${activeTab === item.id ? "text-blue-400" : ""}`}
            />
            {item.label}
          </motion.button>
        ))}

        <div className="my-4 h-px bg-white/10" />
        <p className="px-4 pb-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em]">
          Admin Only
        </p>

        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => setActiveTab("danger")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === "danger"
              ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
              : "text-slate-400 hover:bg-rose-500/5 hover:text-rose-400"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </motion.button>
      </nav>
    </div>
  );
}

/* ─── Personal Profile Tab ─── */
function PersonalProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState({
    fullName: "Josie Smith",
    email: "josie.smith@example.com",
    jobTitle: "Content Strategist",
    department: "Marketing",
    workflowRole: "Reviewer",
    timeZone: "(GMT+5:30) Sri Lanka",
    language: "English",
    avatar: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Personal Profile</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal work details
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-8">
        <div className="flex gap-12">
          {/* Avatar */}
          <div className="shrink-0 text-center">
            <h3 className="text-sm font-bold text-slate-300 mb-4">
              Basic Info
            </h3>
            <div className="relative w-36 h-36 mx-auto">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden border-4 border-white/10">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                hidden
                accept="image/*"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">JPG / PNG • Max 5MB</p>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                Full name
              </label>
              <input
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                Work email
              </label>
              <div className="relative">
                <input
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-400 text-sm"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Role / Job title
                </label>
                <input
                  name="jobTitle"
                  value={user.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Workflow role
                </label>
                <select
                  name="workflowRole"
                  value={user.workflowRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  <option>Reviewer</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Department
                </label>
                <select
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>Content</option>
                  <option>Management</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Preferred language
                </label>
                <div className="flex bg-black/20 border border-white/10 rounded-xl p-1">
                  {["Sinhala", "Tamil", "English"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() =>
                        setUser((prev) => ({ ...prev, language: lang }))
                      }
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${user.language === lang ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                Time zone
              </label>
              <select
                name="timeZone"
                value={user.timeZone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                <option>(GMT+5:30) Sri Lanka</option>
                <option>(GMT+0) UTC</option>
                <option>(GMT+1) Europe</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Organization Tab ─── */
function OrganizationProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [org, setOrg] = useState({
    name: "Orean Inc.",
    industry: "SaaS",
    website: "orean.io",
    country: "Sri Lanka",
    plan: "Pro Scale",
    avatar: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setOrg((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Organization</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your organization settings
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-8">
        <div className="flex gap-12">
          <div className="shrink-0 text-center">
            <h3 className="text-sm font-bold text-slate-300 mb-4">
              Organization Info
            </h3>
            <div className="relative w-36 h-36 mx-auto">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden border-4 border-white/10">
                {org.avatar ? (
                  <img
                    src={org.avatar}
                    alt="Org"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "OI"
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-9 h-9 bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f)
                    setOrg((prev) => ({
                      ...prev,
                      avatar: URL.createObjectURL(f),
                    }));
                }}
                hidden
                accept="image/*"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">JPG / PNG • Max 5MB</p>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                Organization name
              </label>
              <input
                name="name"
                value={org.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Industry
                </label>
                <select
                  name="industry"
                  value={org.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm appearance-none"
                >
                  <option>SaaS</option>
                  <option>EduTech</option>
                  <option>FinTech</option>
                  <option>Health</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Website
                </label>
                <input
                  name="website"
                  value={org.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Country / region
                </label>
                <select
                  name="country"
                  value={org.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm appearance-none"
                >
                  <option>Sri Lanka</option>
                  <option>Singapore</option>
                  <option>USA</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  Subscription plan
                </label>
                <div className="relative">
                  <input
                    value={org.plan}
                    disabled
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-400 text-sm"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team & Roles */}
      <h3 className="text-lg font-bold text-white">Team & Roles</h3>
      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Admin
            </span>
            <p className="text-sm text-white mt-2 font-medium">Full Access</p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Manage Users
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Billing
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Settings
            </span>
          </div>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
              Manager
            </span>
            <p className="text-sm text-white mt-2 font-medium">
              Campaign Management
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Create Campaigns
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Approve Content
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-slate-400 border border-white/10">
              Invite Users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Connected Social Accounts Tab ─── */
const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    color: "#E1306C",
    gradient: "from-[#833AB4] via-[#E1306C] to-[#F77737]",
    placeholder: "@username",
    urlPrefix: "https://instagram.com/",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FaFacebookF,
    color: "#1877F2",
    gradient: "from-[#1877F2] to-[#0C5DC7]",
    placeholder: "Page or profile name",
    urlPrefix: "https://facebook.com/",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: FaXTwitter,
    color: "#000000",
    gradient: "from-[#14171A] to-[#657786]",
    placeholder: "@handle",
    urlPrefix: "https://x.com/",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: FaLinkedinIn,
    color: "#0A66C2",
    gradient: "from-[#0A66C2] to-[#004182]",
    placeholder: "Profile or company URL",
    urlPrefix: "https://linkedin.com/in/",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    gradient: "from-[#FF0000] to-[#CC0000]",
    placeholder: "@channel or channel name",
    urlPrefix: "https://youtube.com/@",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: FaTiktok,
    color: "#000000",
    gradient: "from-[#00F2EA] via-[#FF0050] to-[#000000]",
    placeholder: "@username",
    urlPrefix: "https://tiktok.com/@",
  },
];

interface SocialConnection {
  id: number;
  platform: string;
  platform_username: string;
  profile_url: string | null;
  connected_at: string;
}

function ConnectedAccounts() {
  const { connections, loading, refreshConnections } = useSocialMedia();
  const [connectModal, setConnectModal] = useState<string | null>(null);
  const [connectUsername, setConnectUsername] = useState("");
  const [connectLoading, setConnectLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [whatsappQR, setWhatsappQR] = useState<{
    qrCode: string;
    deepLink: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Read URL params to see if we just connected
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    if (connected) {
      setSuccessMsg(`${connected} connected successfully!`);
      refreshConnections();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refreshConnections]);

  const handleConnect = async (platformId: string) => {
    setConnectLoading(true);
    setError("");

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("orean360_token");

      if (platformId === "whatsapp") {
        const res = await fetch("http://localhost:8080/api/whatsapp/qr", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.qrCode) {
          setWhatsappQR(data);
        } else {
          throw new Error("Failed to generate QR code");
        }
      } else {
        // Map frontend IDs to backend routes
        const routeId = platformId === "facebook" ? "meta" : platformId;
        const res = await fetch(`http://localhost:8080/api/${routeId}/auth`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
        } else {
          throw new Error("Failed to fetch auth URL");
        }
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to initiate connection",
      );
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    setDisconnectLoading(platformId);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("orean360_token");
      const routeId = platformId === "facebook" ? "meta" : platformId;
      const res = await fetch(
        `http://localhost:8080/api/${routeId}/disconnect`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        setSuccessMsg(`${platformId} disconnected`);
        refreshConnections();
      }
    } catch (err) {
      console.error("Failed to disconnect:", err);
    } finally {
      setDisconnectLoading(null);
    }
  };

  const getConnection = (platformId: string) =>
    connections.find((c) => c.platform === platformId);

  const connectedCount = connections.length;
  const totalCount = SOCIAL_PLATFORMS.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Connected Accounts</h2>
        <p className="text-sm text-slate-400 mt-1">
          Link your social media accounts to manage and publish across platforms
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
              <Share2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {connectedCount} of {totalCount} Connected
              </p>
              <p className="text-xs text-slate-400">
                Social media accounts linked to your profile
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {SOCIAL_PLATFORMS.map((p) => {
              const connected = !!getConnection(p.id);
              return (
                <div
                  key={p.id}
                  className={`w-2 h-8 rounded-full transition-all ${connected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-white/10"}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center text-sm"
          >
            <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOCIAL_PLATFORMS.map((platform) => {
          const connection = getConnection(platform.id);
          const isConnected = !!connection;
          const IconComponent = platform.icon;

          return (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.01 }}
              className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-5 transition-all overflow-hidden group ${
                isConnected
                  ? "border-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.05)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Subtle gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${platform.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: platform.color }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {platform.name}
                    </p>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">
                          {connection.platform_username}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Not connected
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConnected && connection.profile_url && (
                    <a
                      href={connection.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-[#0c142c] border border-blue-900/30 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {isConnected ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDisconnect(platform.id)}
                      disabled={disconnectLoading === platform.id}
                      className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                    >
                      {disconnectLoading === platform.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Unlink className="w-3 h-3" />
                      )}
                      Disconnect
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConnect(platform.id)}
                      className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Link2 className="w-3 h-3" />
                      Connect
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* WhatsApp QR Modal */}
      <AnimatePresence>
        {whatsappQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setWhatsappQR(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#151c2e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4"
            >
              <h3 className="text-xl font-bold text-white">Connect WhatsApp</h3>
              <p className="text-sm text-slate-400">
                Scan this QR code with your phone to link your WhatsApp Business
                account.
              </p>
              <div className="flex justify-center my-4">
                <img
                  src={whatsappQR.qrCode}
                  alt="WhatsApp QR"
                  className="w-48 h-48 rounded-xl object-cover border border-white/20"
                />
              </div>
              <button
                onClick={() => setWhatsappQR(null)}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── AI & Integrations Tab ─── */
function AIIntegrations() {
  const [level, setLevel] = useState("Pro");
  const platforms = [
    { name: "Facebook", status: "Connected", color: "#1877F2" },
    { name: "Instagram", status: "Connected", color: "#E1306C" },
    { name: "LinkedIn", status: "Expired", color: "#0A66C2" },
    { name: "WhatsApp", status: "Connected", color: "#25D366" },
    { name: "YouTube", status: "Needs re-auth", color: "#FF0000" },
    { name: "TikTok", status: "Connected", color: "#000000" },
    { name: "X (Twitter)", status: "Connected", color: "#000000" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI & Integrations</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your AI settings and connected platforms
        </p>
      </div>

      <h3 className="text-lg font-bold text-white">AI Usage & Preferences</h3>
      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              AI Access Level
            </label>
            <div className="flex gap-3">
              {["Basic", "Pro"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${level === l ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Unlocks premium content generation and advanced analytics.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Monthly AI credit usage
            </label>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">4,500 credits used</span>
              <span className="text-slate-500">Limit: 10,000</span>
            </div>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{ width: "45%" }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">
              Brand tone adherence
            </label>
            <div className="relative">
              <input
                value="Professional & Engaging"
                disabled
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-400 text-sm"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Controlled by organization settings
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">
              Preferred response language
            </label>
            <select className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm appearance-none">
              <option>English</option>
              <option>Sinhala</option>
              <option>Tamil</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
            Cancel
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            Save Changes
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white">Connected Platforms</h3>
      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name[0]}
                </div>
                <span className="text-sm font-medium text-white">{p.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                {p.status === "Connected" && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                {p.status === "Expired" && (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                {p.status === "Needs re-auth" && (
                  <RefreshCw className="w-4 h-4 text-rose-400" />
                )}
                <span
                  className={
                    p.status === "Connected"
                      ? "text-emerald-400"
                      : p.status === "Expired"
                        ? "text-amber-400"
                        : "text-rose-400"
                  }
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Security & Access Tab ─── */
function SecurityAccess() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [autoEscalate, setAutoEscalate] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Security & Access</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your login, verification sessions & AI rules
        </p>
      </div>

      <h3 className="text-lg font-bold text-white">Login & Security</h3>
      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">
            Work Email
          </label>
          <div className="relative">
            <input
              value="josie.smith@example.com"
              disabled
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-400 text-sm pr-36"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">
              Change Password
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl">
          <div>
            <p className="text-sm font-medium text-white">
              Two-Factor Authentication (2FA)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Secure your account with an additional layer of protection.
            </p>
          </div>
          <button
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-12 h-6 rounded-full transition-all ${twoFactor ? "bg-blue-500" : "bg-white/10"} relative`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${twoFactor ? "left-6" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white">Active Sessions</h3>
      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <Laptop className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">
                Windows PC - Chrome
              </p>
              <p className="text-xs text-slate-400">
                Colombo, Sri Lanka • Active now
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Current Device
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Smartphone className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-white">
                iPhone 14 - Safari
              </p>
              <p className="text-xs text-slate-400">
                Colombo, Sri Lanka • 2 hours ago
              </p>
            </div>
          </div>
          <button className="px-4 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">
            Revoke
          </button>
        </div>
        <button className="w-full py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all mt-4">
          Logout from all devices
        </button>
      </div>

      <h3 className="text-lg font-bold text-white">AI Escalation Rules</h3>
      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl">
          <div>
            <p className="text-sm font-medium text-white">
              Auto-escalate sensitive messages
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Automatically flag high-risk content for human review.
            </p>
          </div>
          <button
            onClick={() => setAutoEscalate(!autoEscalate)}
            className={`w-12 h-6 rounded-full transition-all ${autoEscalate ? "bg-blue-500" : "bg-white/10"} relative`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${autoEscalate ? "left-6" : "left-0.5"}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-xl">
          <div>
            <p className="text-sm font-medium text-white">
              Escalate when AI confidence is low
            </p>
            <p className="text-xs text-slate-400 mt-1">
              If confidence drops below 70%, request manual approval.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-slate-400 border border-white/10">
            Read-only (Org Policy)
          </span>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
            Cancel
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Billing & Plan Tab ─── */
function BillingPlan() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Billing & Plan</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your subscription and usage
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Pro Scale Plan
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              $49/month • Billed annually
            </p>
            <p className="text-sm text-white mt-1">
              Next renewal: <strong>Aug 14, 2026</strong>
            </p>
          </div>
          <button className="px-5 py-2.5 bg-white/5 border border-blue-500/30 text-blue-300 rounded-xl text-sm font-bold hover:bg-blue-500/10 transition-all">
            Update Payment Method
          </button>
        </div>

        <div className="h-px bg-white/10" />

        <h4 className="text-base font-bold text-white">Usage Limits</h4>

        {[
          { label: "Monthly Active Users", used: "8", total: "20", pct: 40 },
          {
            label: "AI Text Generations",
            used: "4,500",
            total: "100,000",
            pct: 4.5,
          },
          { label: "Storage", used: "12GB", total: "50GB", pct: 24 },
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{item.label}</span>
              <span className="text-white">
                {item.used} / {item.total}
              </span>
            </div>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
            Download Invoices
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Danger Zone Tab ─── */
function DangerZone() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Danger Zone</h2>
        <p className="text-sm text-slate-400 mt-1">Proceed with caution</p>
      </div>

      <div className="bg-gradient-to-br from-[#223c8f] to-[#3657b8] border border-blue-800/25 rounded-2xl p-8 space-y-6">
        <div className="flex gap-4 items-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-rose-300">
              Proceed with Caution
            </h4>
            <p className="text-xs text-rose-300/80 mt-1">
              These actions will have permanent consequences. Please be certain
              before continuing.
            </p>
          </div>
        </div>

        {[
          {
            label: "Leave Organization",
            desc: "Revoke your access to this organization.",
            btn: "Leave Organization",
            style:
              "border border-rose-500/30 text-rose-300 hover:bg-rose-500/10",
          },
          {
            label: "Deactivate Account",
            desc: "Disable your account until you reactivate it.",
            btn: "Deactivate Account",
            style:
              "border border-rose-500/30 text-rose-300 hover:bg-rose-500/10",
          },
          {
            label: "Delete Organization (Admin only)",
            desc: "Permanently delete this organization and all data.",
            btn: "Delete Organization",
            style: "bg-rose-600 text-white hover:bg-rose-500",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex justify-between items-center py-4 ${i < 2 ? "border-b border-white/10" : ""}`}
          >
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
            <button
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${item.style}`}
            >
              {item.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Settings Page ─── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalProfile />;
      case "organization":
        return <OrganizationProfile />;
      case "social":
        return <ConnectedAccounts />;
      case "ai":
        return <AIIntegrations />;
      case "security":
        return <SecurityAccess />;
      case "billing":
        return <BillingPlan />;
      case "danger":
        return <DangerZone />;
      default:
        return <PersonalProfile />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your profile, organization, and integrations.
        </p>
      </div>

      <div className="flex gap-8">
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </div>
  );
}
