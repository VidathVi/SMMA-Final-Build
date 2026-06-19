export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-[#020617] via-[#0A0A3C] to-[#020024] bg-[length:300%_300%] animate-gradient">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 relative z-0 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
