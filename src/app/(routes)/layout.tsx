"use client";

import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!mounted) return;
      if (!user) {
        router.replace("/auth/sign-in");
      } else {
        setChecked(true);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-[100dvh] grid place-items-center">
        <div className="text-white/70">Loading…</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh]">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Header />
          <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}



