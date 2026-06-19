import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0f1c] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="relative flex items-center justify-center">
          {/* Outer glowing ring */}
          <div className="absolute h-24 w-24 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-gradient-to-tr from-blue-600/30 to-purple-600/30 blur-xl"></div>
          {/* Inner spinner */}
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
        </div>
        <div className="flex flex-col items-center text-center space-y-2">
          <h3 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center justify-center gap-2">
            Loading Workspace <Sparkles className="w-5 h-5 text-blue-400" />
          </h3>
          <p className="text-sm font-medium text-slate-400">
            Preparing your campaigns and workflows...
          </p>
        </div>
      </div>
    </div>
  );
}
