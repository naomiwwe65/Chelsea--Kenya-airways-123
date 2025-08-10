"use client";

import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/header";
import { useState } from "react";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-[100dvh]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
      <div className="flex">
        <aside className="hidden md:block sticky top-0 h-[100dvh] z-40 w-64 p-4 md:p-6 bg-white/10 border-r border-white/15 backdrop-blur-xl">
          <Sidebar />
        </aside>
        <aside
          className={`fixed md:hidden top-0 left-0 h-[100dvh] w-72 z-50 transform transition-transform duration-300 p-4 bg-white/10 border-r border-white/15 backdrop-blur-xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="dialog"
          aria-modal="true"
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </aside>
        <main className="flex-1 min-w-0">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}




