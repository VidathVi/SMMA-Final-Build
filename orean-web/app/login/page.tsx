"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gem, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
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
    handleGoogleCredential?: (response: { credential: string }) => void;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "578730608086-ad89unb7imdvm9k9e8l2tt35g7cp75os.apps.googleusercontent.com";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleMessage, setGoogleMessage] = useState("");

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
        throw new Error(data.message || "Google sign-in failed");
      }

      localStorage.setItem("orean360_token", data.token);
      if (data.user) {
        localStorage.setItem("orean360_user", JSON.stringify(data.user));
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#eef0f3]">
      {/* Left Side: Login Form */}
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
            Login to your Account
          </h1>

          {/* Google Sign-in */}
          <div id="google-signin-btn" style={{ display: "none" }}></div>
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={() => {
              setGoogleMessage("Since the webapp is still in testing, this only works if you are a developer");
              setTimeout(() => {
                setGoogleMessage("");
                const googleBtn = document.querySelector<HTMLDivElement>(
                  "#google-signin-btn div[role='button']",
                );
                if (googleBtn) {
                  googleBtn.click();
                } else if (window.google) {
                  window.google.accounts.id.prompt();
                }
              }, 5000);
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
                or Sign in with Email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {googleMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-xl flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-blue-500" />
                {googleMessage}
              </div>
            )}
            {error && (
              <div className="bg-rose-550/10 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-500" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2536]/20 focus:border-[#1a2536] transition-all text-slate-800 placeholder-slate-400 text-sm"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2536]/20 focus:border-[#1a2536] transition-all text-slate-800 placeholder-slate-400 text-sm"
                placeholder="••••••••••••"
              />
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-500 font-medium">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-[#1a2536] focus:ring-[#1a2536]"
                />
                <span>Remember Me</span>
              </label>
              <a
                href="#"
                className="font-bold text-[#1a2536] hover:text-[#253552] transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#1a2536] hover:bg-[#253552] text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-[#1a2536]/10 flex items-center justify-center relative overflow-hidden group mt-6 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="tracking-wide">Login</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs font-medium">
            <span className="text-slate-400">Not Registered Yet? </span>
            <Link
              href="/register"
              className="text-[#1a2536] hover:text-[#253552] transition-colors font-bold"
            >
              Create an account
            </Link>
          </div>
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
