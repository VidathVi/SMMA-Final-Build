"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gem, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    google?: any;
    handleGoogleCredential?: (response: any) => void;
  }
}

const GOOGLE_CLIENT_ID = "578730608086-ad89unb7imdvm9k9e8l2tt35g7cp75os.apps.googleusercontent.com";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            theme: "filled_black",
            size: "large",
            width: "100%",
            shape: "pill",
            text: "continue_with",
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }

      localStorage.setItem("orean360_token", data.token);
      if (data.user) {
        localStorage.setItem("orean360_user", JSON.stringify(data.user));
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("orean360_token", data.token);
      if (data.user) {
        localStorage.setItem("orean360_user", JSON.stringify(data.user));
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0f172a]/80 text-slate-500 uppercase tracking-widest font-medium">or continue with</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div className="space-y-3">
              {/* Google GSI rendered button (hidden) + Custom styled button */}
              <div id="google-signin-btn" style={{ display: "none" }}></div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={isGoogleLoading}
                onClick={() => {
                  const googleBtn = document.querySelector<HTMLDivElement>("#google-signin-btn div[role='button']");
                  if (googleBtn) {
                    googleBtn.click();
                  } else if (window.google) {
                    window.google.accounts.id.prompt();
                  }
                }}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-red-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                ) : (
                  <>
                    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="relative z-10">Continue with Google</span>
                  </>
                )}
              </motion.button>
            </div>

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
