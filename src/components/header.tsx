"use client";

import { CalendarDays, Download, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../lib/supabase";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [todayLabel, setTodayLabel] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { data } = await sb.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      if (data?.full_name) setFullName(data.full_name);
    })();
  }, []);

  // Compute today's label on client to avoid SSR/CSR locale/timezone mismatch
  useEffect(() => {
    setTodayLabel(new Date().toLocaleDateString());
  }, []);
  return (
    <header className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl border-b border-white/15">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white/70 flex-1 max-w-xl">
          <input
            placeholder="Search parts, orders, or MRO tasks..."
            className="bg-transparent outline-none w-full placeholder:text-white/50"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white/80">
            <CalendarDays size={16} />
            <span className="text-sm" suppressHydrationWarning>{todayLabel}</span>
          </div>
          <button
            onClick={() => toast.success("Report exported" )}
            className="px-3 py-2 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm flex items-center gap-2"
          >
            <Download size={16} /> Export Report
          </button>
          <div className="relative" ref={menuRef}>
            <button
              aria-label="Open user menu"
              onClick={() => setMenuOpen(v => !v)}
              className="w-9 h-9 rounded-full border border-white/20 overflow-hidden bg-white/10 hover:bg-white/15"
              title={fullName ?? 'Profile'}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-sm text-white/80">
                  {(fullName?.[0] ?? 'U').toUpperCase()}
                </div>
              )}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 min-w-48 glass p-2 rounded-xl shadow-xl border border-white/20">
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="text-sm font-medium">{fullName ?? 'User'}</div>
                  <div className="text-xs text-white/60">Profile</div>
                </div>
                <button
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                  onClick={() => { setMenuOpen(false); router.push('/settings'); }}
                >
                  Settings
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2"
                  onClick={async () => {
                    const sb = getSupabase();
                    await sb.auth.signOut();
                    setMenuOpen(false);
                    router.push('/auth/sign-in');
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


