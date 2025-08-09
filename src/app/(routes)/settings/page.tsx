"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { saveAs } from "file-saver";
import { toast } from "sonner";

type Profile = { id: string; full_name: string | null; avatar_url: string | null };

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<'Dark' | 'Light'>('Dark');
  const [defaultMinQty, setDefaultMinQty] = useState<number>(3);
  const [notifyLowStock, setNotifyLowStock] = useState<boolean>(false);
  const [notifyOrders, setNotifyOrders] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [timezone, setTimezone] = useState<string>('');
  const [accent, setAccent] = useState<string>('#EC2227');
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [newPwd, setNewPwd] = useState("");

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { data } = await sb.from('profiles').select('id, full_name, avatar_url').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? '');
        setAvatarUrl(data.avatar_url);
      }
    })();
    // hydrate preferences from localStorage after mount
    if (typeof window !== 'undefined') {
      setTheme(localStorage.getItem('theme') === 'Light' ? 'Light' : 'Dark');
      setDefaultMinQty(Number(localStorage.getItem('defaultMinQty') ?? 3));
      setNotifyLowStock(localStorage.getItem('notifyLowStock') === '1');
      setNotifyOrders(localStorage.getItem('notifyOrders') === '1');
      setLanguage(localStorage.getItem('lang') ?? 'en');
      setTimezone(localStorage.getItem('tz') ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
      setAccent(localStorage.getItem('accent') ?? '#EC2227');
    }
  }, []);

  async function onSave() {
    setSaving(true);
    try {
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        await sb.from('profiles').upsert({ id: user.id, full_name: fullName, avatar_url: avatarUrl ?? null });
      }
      localStorage.setItem('theme', theme);
      localStorage.setItem('defaultMinQty', String(defaultMinQty));
      localStorage.setItem('notifyLowStock', notifyLowStock ? '1' : '0');
      localStorage.setItem('notifyOrders', notifyOrders ? '1' : '0');
      localStorage.setItem('lang', language);
      localStorage.setItem('tz', timezone);
      localStorage.setItem('accent', accent);
      toast.success('Settings saved');
    } finally {
      setSaving(false);
    }
  }

  async function onAvatarSelected(file: File) {
    const sb = getSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) { toast.error('Please sign in'); return; }
    const fileExt = file.name.split('.').pop();
    const path = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
    const { error: upErr } = await sb.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) { toast.error(upErr.message); return; }
    const { data } = sb.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    toast.success('Avatar updated');
  }

  async function onChangePassword() {
    if (!newPwd || newPwd.length < 8) { toast.error('Password should be at least 8 characters'); return; }
    setChangingPwd(true);
    try {
      const sb = getSupabase();
      const { error } = await sb.auth.updateUser({ password: newPwd });
      if (error) { toast.error(error.message); return; }
      setNewPwd("");
      toast.success('Password updated');
    } finally {
      setChangingPwd(false);
    }
  }

  function exportProfile() {
    const blob = new Blob([JSON.stringify({ profile, preferences: { theme, defaultMinQty, notifyLowStock, notifyOrders, language, timezone, accent } }, null, 2)], { type: 'application/json' });
    saveAs(blob, 'profile_export.json');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Profile</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20 bg-white/10">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-lg">{(fullName?.[0] ?? 'U').toUpperCase()}</div>
              )}
            </div>
            <div>
              <label className="block text-sm text-white/70">Upload new avatar</label>
              <input type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) onAvatarSelected(f); }} />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-white/70">Full Name</label>
            <input
              value={fullName}
              onChange={(e)=>setFullName(e.target.value)}
              className="mt-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 w-full"
              placeholder="Your name"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm text-white/70">Language</label>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="mt-1 bg-white/10 border border-white/20 rounded-md px-2 py-2 w-full">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="sw">Swahili</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/70">Timezone</label>
            <input value={timezone} onChange={(e)=>setTimezone(e.target.value)} className="mt-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 w-full" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Security</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm text-white/70">New Password</label>
            <input type="password" value={newPwd} onChange={(e)=>setNewPwd(e.target.value)} className="mt-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 w-full" placeholder="********" />
          </div>
          <div className="flex items-end">
            <button onClick={onChangePassword} disabled={changingPwd} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20">
              {changingPwd ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
        <p className="text-xs text-white/60 mt-2">Two-factor authentication coming soon.</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Notifications & Appearance</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={notifyLowStock} onChange={(e)=>setNotifyLowStock(e.target.checked)} />
              Email me low stock alerts
            </label>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={notifyOrders} onChange={(e)=>setNotifyOrders(e.target.checked)} />
              Email me order updates
            </label>
          </div>
          <div>
            <label className="block text-sm text-white/70">Theme</label>
            <select value={theme} onChange={(e)=>setTheme(e.target.value as 'Dark' | 'Light')} className="mt-1 bg-white/10 border border-white/20 rounded-md px-2 py-2 w-full">
              <option>Dark</option>
              <option>Light</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm text-white/70 mb-1">Accent color</label>
          <div className="flex gap-2">
            {['#EC2227','#228B22','#4096ff','#f59e0b','#a855f7','#14b8a6'].map(c => (
              <button key={c} onClick={()=>setAccent(c)} className={`w-7 h-7 rounded-full border ${accent===c?'ring-2 ring-white':''}`} style={{ background: c }} aria-label={`accent ${c}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Data & Privacy</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportProfile} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20">Export my data</button>
          <button onClick={()=>toast.info('Account deletion requires admin support in this demo.')} className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500">Delete account</button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onSave} disabled={saving} className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500">
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}


