"use client";

import { TrendingUp, AlertTriangle, ClipboardList, Package2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Part = { id: string; part_number?: string; name?: string; category: string | null; quantity: number; min_quantity: number };
type TrendRow = { day: string; used: number; ordered: number };
type CategoryRow = { category: string; part_count: number; total_quantity: number };
type LowStockPart = { id: string; part_number: string; name: string; quantity: number; min_quantity: number };
type Activity = { id: string; type: "Issue" | "Restock"; status: string; created_at: string };

export default function Home() {
  const [parts, setParts] = useState<Part[]>([]);
  const [trendRows, setTrendRows] = useState<TrendRow[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [activeMroJobsCount, setActiveMroJobsCount] = useState<number>(0);
  const [lowStockParts, setLowStockParts] = useState<LowStockPart[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const sb = getSupabase();
      const [{ data: p }, { data: trend }, { data: cats }, pendingRes, activeRes, { data: acts }] = await Promise.all([
        sb.from("parts").select("id,part_number,name,category,quantity,min_quantity"),
        sb
          .from("analytics_daily_trend")
          .select("day,used,ordered")
          .order("day", { ascending: true })
          .limit(120),
        sb
          .from("analytics_category_breakdown")
          .select("category,part_count,total_quantity")
          .order("part_count", { ascending: false }),
        sb.from("orders").select("id", { count: "exact" }).eq("status", "Pending").limit(1),
        sb.from("internal_mro_jobs").select("id", { count: "exact" }).eq("status", "In Progress").limit(1),
        sb
          .from("orders")
          .select("id,type,status,created_at")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      if (!mounted) return;
      setParts(p ?? []);
      setTrendRows(trend ?? []);
      setCategoryRows(cats ?? []);
      setPendingOrdersCount(typeof pendingRes.count === "number" ? pendingRes.count : 0);
      setActiveMroJobsCount(typeof activeRes.count === "number" ? activeRes.count : 0);
      const lows = (p ?? []).filter(x => x.quantity <= x.min_quantity).slice(0, 10) as LowStockPart[];
      setLowStockParts(lows);
      setActivities(acts ?? []);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const totalItems = useMemo(() => parts.length, [parts]);
  const lowStock = useMemo(() => parts.filter(p => p.quantity <= p.min_quantity).length, [parts]);
  const pendingOrders = pendingOrdersCount;

  const trendData = useMemo(() => {
    const last30 = trendRows.slice(-30);
    return last30.map(r => ({ date: r.day.slice(5), used: r.used, ordered: r.ordered }));
  }, [trendRows]);

  const categoryData = useMemo(() => {
    if (categoryRows.length > 0) return categoryRows.map(r => ({ name: r.category, value: r.part_count }));
    const map = new Map<string, number>();
    for (const p of parts) { const key = p.category ?? "Other"; map.set(key, (map.get(key) ?? 0) + 1); }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [categoryRows, parts]);

  const COLORS = ["#EC2227", "#228B22", "#4096ff", "#f59e0b", "#a855f7", "#14b8a6", "#ef4444"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Inventory Items", value: loading ? "-" : String(totalItems), change: "", icon: Package2 },
          { title: "Low Stock Items", value: loading ? "-" : String(lowStock), change: "", icon: AlertTriangle },
          { title: "Pending Orders", value: loading ? "-" : String(pendingOrders), change: "", icon: ClipboardList },
          { title: "Active MRO Tasks", value: loading ? "-" : String(activeMroJobsCount), change: "", icon: TrendingUp },
        ].map((c) => (
          <div key={c.title} className="card float">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70">{c.title}</p>
                <p className="text-2xl font-semibold mt-1">{c.value}</p>
                {c.change && <p className="text-xs mt-1 text-white/60">{c.change}</p>}
              </div>
              <c.icon className="text-white/70" size={22} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card min-h-[360px]">
          <p className="text-sm text-white/70 mb-2">Inventory Usage Trend (Last 30 days)</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="used" stroke="#EC2227" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ordered" stroke="#228B22" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card min-h-[360px]">
          <p className="text-sm text-white/70 mb-2">Parts by Category</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={categoryData} outerRadius={110}>
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card min-h-[280px]">
          <p className="text-sm text-white/70 mb-2">Recent Activities</p>
          {activities.length === 0 ? (
            <div className="text-white/60 text-sm">No recent activity.</div>
          ) : (
            <ul className="space-y-2">
              {activities.map((a) => (
                <li key={a.id} className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="text-sm">
                    <span className="text-white">Order #{a.id.slice(0,8)}</span> {a.status === 'Completed' ? 'completed' : a.status.toLowerCase()} ({a.type})
                  </div>
                  <div className="text-xs text-white/60">{new Date(a.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card min-h-[280px]">
          <p className="text-sm text-white/70 mb-2">Low Stock Items</p>
          {lowStockParts.length === 0 ? (
            <div className="text-white/60 text-sm">No items below minimum.</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-white/60">
                  <tr>
                    <th className="text-left p-2">Part No</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-left p-2">Min</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockParts.map((p) => (
                    <tr key={p.id} className="border-t border-white/10">
                      <td className="p-2">{p.part_number}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.quantity}</td>
                      <td className="p-2">{p.min_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Link className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20" href="/inventory">Go to Inventory</Link>
        <Link className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500" href="/orders">Create Order</Link>
      </div>
    </div>
  );
}




