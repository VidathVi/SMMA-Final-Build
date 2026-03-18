import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary-500/20 blur-xl"></div>
        {/* Inner spinner */}
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          Loading Workspace
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Preparing your campaigns and workflows...
        </p>
      </div>
    </div>
  );
}
