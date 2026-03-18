"use client";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#020617] to-[#020024]">
      <div className="relative flex items-center justify-center ">

        <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-[#3B82F6] border-r-[#22D3EE] animate-spin shadow-[0_0_12px_rgba(34,211,238,0.6)]" />

        <div className="absolute w-19 h-19 rounded-full border-4 border-transparent border-b-[#6EE7B7] border-l-[#3B82F6] animate-spin reverse-spin" />

        <div className="absolute text-cyan-400 text-lg font-bold">  </div>

         
      </div>
    </div>
  );
};

export default LoadingScreen;


