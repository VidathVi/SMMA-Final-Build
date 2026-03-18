"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Loader2, User, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#1e1b4b] animate-[gradientFlow_15s_ease_infinite] bg-[length:200%_200%]"></div>
      
      {/* Glowing Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 22, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-white/5">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-6 overflow-hidden relative group">
              <div className="absolute inset-0 bg-purple-500/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              <User className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)] relative z-10" />
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">Create Account</h1>
            <p className="text-sm text-slate-400 mt-2">Join the future of Orean<span className="text-blue-400">360</span></p>
          </div>

          {/* Form */}
          <div className="p-8 pt-6">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Registration Complete</h3>
                  <p className="text-sm text-slate-400">Redirecting to login...</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                
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
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border-white/10 rounded-xl bg-black/20 border focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500 hover:bg-white/5 shadow-inner"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border-white/10 rounded-xl bg-black/20 border focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500 hover:bg-white/5 shadow-inner"
                      placeholder="Create a password"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border-white/10 rounded-xl bg-black/20 border focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500 hover:bg-white/5 shadow-inner"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center relative overflow-hidden group mt-6"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                  ) : (
                    <span className="relative z-10 tracking-wide text-[15px]">Sign Up</span>
                  )}
                </motion.button>
              </form>
            )}

            {!success && (
              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-sm font-medium text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-400 hover:text-white transition-colors font-bold drop-shadow-sm">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
