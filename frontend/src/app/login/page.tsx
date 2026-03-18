"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("orean360_token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      {/* Animated Deep Space Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] animate-[gradientFlow_15s_ease_infinite] bg-[length:200%_200%]"></div>
      
      {/* Glowing Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 20, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-white/5">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-6 overflow-hidden relative group">
              <div className="absolute inset-0 bg-blue-500/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              <Gem className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] relative z-10" />
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-400 mt-2">Sign in to your Orean<span className="text-blue-400">360</span> account</p>
          </div>

          {/* Form */}
          <div className="p-8 pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0 bg-rose-500/20 rounded-full" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border-white/10 rounded-xl bg-black/20 border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500 hover:bg-white/5 shadow-inner"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-300">Password</label>
                  <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors">Forgot?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border-white/10 rounded-xl bg-black/20 border focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500 hover:bg-white/5 shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center relative overflow-hidden group mt-4"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                ) : (
                  <span className="relative z-10 tracking-wide text-[15px]">Sign In</span>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <p className="text-sm font-medium text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-400 hover:text-white transition-colors font-bold drop-shadow-sm">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
