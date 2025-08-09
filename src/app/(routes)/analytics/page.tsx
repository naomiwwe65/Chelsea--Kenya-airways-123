"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

type TrendRow = { day: string; used: number; ordered: number };
type CategoryRow = { category: string; part_count: number; total_quantity: number };

export default function AnalyticsPage() {
  const [trend, setTrend] = useState<TrendRow[]>([]);
  const [cats, setCats] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const sb = getSupabase();
      const [{ data: t, error: et }, { data: c, error: ec }] = await Promise.all([
        sb.from("analytics_daily_trend").select("day,used,ordered").order("day", { ascending: true }).limit(120),
        sb.from("analytics_category_breakdown").select("category,part_count,total_quantity").order("part_count", { ascending: false }),
      ]);
      if (!mounted) return;
      if (!et) setTrend(t ?? []);
      if (!ec) setCats(c ?? []);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const trendData = useMemo(() => trend.slice(-60).map(r => ({ date: r.day.slice(5), used: r.used, ordered: r.ordered })), [trend]);
  const pieData = useMemo(() => cats.map(r => ({ name: r.category, value: r.part_count })), [cats]);
  const COLORS = ["#EC2227", "#228B22", "#4096ff", "#f59e0b", "#a855f7", "#14b8a6", "#ef4444"]; 

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card min-h-[360px]">
          <p className="text-sm text-white/70 mb-2">Orders Trend (Used vs Restocked)</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="used" name="Used (Issue)" stroke="#EC2227" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ordered" name="Restocked" stroke="#228B22" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {(!loading && trendData.length === 0) && <div className="mt-2 text-white/60 text-sm">No trend data yet.</div>}
        </div>
        <div className="card min-h-[360px]">
          <p className="text-sm text-white/70 mb-2">Parts by Category</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={pieData} outerRadius={110}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {(!loading && pieData.length === 0) && <div className="mt-2 text-white/60 text-sm">No category data yet.</div>}
        </div>
      </div>
    </div>
  );
}


