"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gem,
  Loader2,
  User,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement | null, options: unknown) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "578730608086-ad89unb7imdvm9k9e8l2tt35g7cp75os.apps.googleusercontent.com";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
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
          document.getElementById("google-signup-btn"),
          {
            theme: "filled_black",
            size: "large",
            width: "100%",
            shape: "pill",
            text: "signup_with",
          },
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: { credential: string }) => {
    setIsGoogleLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google sign-up failed");
      }

      localStorage.setItem("orean360_token", data.token);
      if (data.user) {
        localStorage.setItem("orean360_user", JSON.stringify(data.user));
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-up failed");
      setIsGoogleLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send code");
      }

      setIsCodeSent(true);
      setError(""); // clear error on success
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCodeSent) {
      handleSendCode();
      return;
    }
    
    if (!code) {
      setError("Verification code is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#eef0f3]">
      {/* Left Side: Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 bg-[#eef0f3]">
        <div className="w-full max-w-[380px] flex flex-col">
          {/* Icon Logo */}
          <div className="mb-8">
            <img
              src="/logo-icon.png"
              alt="Logo Icon"
              className="w-12 h-12 object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-[#1a2536] tracking-tight">
            Create an Account
          </h1>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4 mt-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1a2536] mb-1">
                  Registration Complete
                </h3>
                <p className="text-sm text-slate-500">
                  Redirecting to login...
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Google Sign-in */}
              <div id="google-signup-btn" style={{ display: "none" }}></div>
              <button
                type="button"
                disabled={isGoogleLoading}
                onClick={() => {
                  if (countdown !== null) return;
                  let timeLeft = 5;
                  setCountdown(timeLeft);
                  setGoogleMessage(`Since the webapp is still in testing, this only works if you are a developer (Redirecting in ${timeLeft}...)`);
                  
                  const timer = setInterval(() => {
                    timeLeft -= 1;
                    if (timeLeft > 0) {
                      setCountdown(timeLeft);
                      setGoogleMessage(`Since the webapp is still in testing, this only works if you are a developer (Redirecting in ${timeLeft}...)`);
                    } else {
                      clearInterval(timer);
                      setCountdown(null);
                      setGoogleMessage("");
                      const googleBtn = document.querySelector<HTMLDivElement>(
                        "#google-signup-btn div[role='button']",
                      );
                      if (googleBtn) {
                        googleBtn.click();
                      } else if (window.google) {
                        window.google.accounts.id.prompt();
                      }
                    }
                  }, 1000);
                }}
                className="w-full mt-8 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-[#eef0f3] text-slate-400 font-semibold text-[11px] uppercase tracking-wide">
                    or Sign up with Email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {googleMessage && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-xl flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-blue-500" />
                    {googleMessage}
                  </div>
                )}
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-500" />
                    {error}
                  </div>
                )}
                
                {isCodeSent && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 shrink-0 text-emerald-500" />
                    Verification code sent to your email!
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isCodeSent}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2536]/20 focus:border-[#1a2536] transition-all text-slate-800 placeholder-slate-400 text-sm disabled:opacity-50"
                    placeholder="mail@abc.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    disabled={isCodeSent}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2536]/20 focus:border-[#1a2536] transition-all text-slate-800 placeholder-slate-400 text-sm disabled:opacity-50"
                    placeholder="Create a password"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    disabled={isCodeSent}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2536]/20 focus:border-[#1a2536] transition-all text-slate-800 placeholder-slate-400 text-sm disabled:opacity-50"
                    placeholder="Confirm password"
                  />
                </div>

                {isCodeSent && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1.5 pt-2"
                  >
                    <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2536]/20 focus:border-[#1a2536] transition-all text-slate-800 placeholder-slate-400 text-sm text-center tracking-[0.5em] font-bold"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </motion.div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#1a2536] hover:bg-[#253552] text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-[#1a2536]/10 flex items-center justify-center relative overflow-hidden group mt-6 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="tracking-wide">
                      {isCodeSent ? "Verify & Register" : "Send Verification Code"}
                    </span>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center text-xs font-medium">
                <span className="text-slate-400">Already have an account? </span>
                <Link
                  href="/login"
                  className="text-[#1a2536] hover:text-[#253552] transition-colors font-bold"
                >
                  Sign in here
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side: Brand Panel */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src="/logo-side.png"
          alt="Orean Logo"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
