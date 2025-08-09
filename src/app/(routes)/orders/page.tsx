"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

type Order = {
  id: string;
  part_id: string;
  quantity: number;
  type: "Issue" | "Restock";
  status: "Pending" | "Completed" | "Cancelled";
  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{ part_id: string; quantity: number; type: "Issue" | "Restock" }>({ part_id: "", quantity: 1, type: "Issue" });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await getSupabase().from("orders").select("*").order("created_at", { ascending: false });
      if (!mounted) return;
      setOrders(error ? [] : data ?? []);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500">+ Create Order</button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-white/60">
            <tr>
              <th className="text-left p-2">Order ID</th>
              <th className="text-left p-2">Part</th>
              <th className="text-left p-2">Quantity</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Created</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4" colSpan={7}>Loading...</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-white/10">
                  <td className="p-2">{o.id.slice(0, 8)}</td>
                  <td className="p-2">{o.part_id}</td>
                  <td className="p-2">{o.quantity}</td>
                  <td className="p-2">{o.type}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <select
                      defaultValue={o.status}
                      className="bg-white/10 border border-white/20 rounded-md px-2 py-1"
                      onChange={async (e) => {
                        await getSupabase().from("orders").update({ status: e.target.value }).eq("id", o.id);
                        setOrders((prev) => prev.map((x) => x.id === o.id ? { ...x, status: e.target.value as Order["status"] } : x));
                      }}
                    >
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="card w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Create Order</h2>
            <div className="grid gap-3">
              <input className="bg-white/10 border border-white/20 rounded-md px-3 py-2" placeholder="Part ID (use existing)" value={form.part_id} onChange={(e)=>setForm({...form, part_id:e.target.value})}/>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="bg-white/10 border border-white/20 rounded-md px-3 py-2" placeholder="Quantity" value={form.quantity} onChange={(e)=>setForm({...form, quantity:Number(e.target.value)})}/>
                <select
                  className="bg-white/10 border border-white/20 rounded-md px-3 py-2"
                  value={form.type}
                  onChange={(e)=>setForm({...form, type: (e.target.value as 'Issue' | 'Restock')})}
                >
                  <option>Issue</option>
                  <option>Restock</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-1">
                <button className="px-3 py-2 rounded-xl bg-white/10" onClick={()=>setShowModal(false)}>Cancel</button>
                <button className="px-3 py-2 rounded-xl bg-red-500/90 hover:bg-red-500" onClick={async ()=>{
                  await getSupabase().from('orders').insert([{...form, status: 'Pending'}]);
                  setShowModal(false);
                  // refresh
                  const { data } = await getSupabase().from('orders').select('*').order('created_at', { ascending:false });
                  setOrders(data ?? []);
                }}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


