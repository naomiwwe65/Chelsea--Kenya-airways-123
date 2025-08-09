"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useDebounce } from "@/hooks/use-debounce";

type Part = {
  id: string;
  part_number: string;
  name: string;
  category: string | null;
  quantity: number;
  min_quantity: number;
  status: string;
};

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const q = useDebounce(search, 250);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ part_number: "", name: "", category: "", quantity: 0, min_quantity: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data, error } = await getSupabase()
        .from("parts")
        .select("*")
        .ilike("name", `%${q}%`);
      if (!mounted) return;
      if (error) {
        console.error(error);
        setParts([]);
      } else {
        setParts(data ?? []);
      }
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [q]);

  const lowStockCount = useMemo(
    () => parts.filter((p) => p.quantity <= p.min_quantity).length,
    [parts]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-500">+ Add Part</button>
      </div>
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <input
            placeholder="Search by Part No or Name"
            className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-sm text-white/70">Low stock: {lowStockCount}</div>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="text-left p-2">Part No</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Qty</th>
                <th className="text-left p-2">Min Qty</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4" colSpan={6}>Loading...</td></tr>
              ) : parts.length === 0 ? (
                <tr><td className="p-4" colSpan={6}>No parts found</td></tr>
              ) : (
                parts.map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="p-2">{p.part_number}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.category ?? "-"}</td>
                    <td className="p-2">{p.quantity}</td>
                    <td className="p-2">{p.min_quantity}</td>
                    <td className="p-2">{p.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="card w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Add Part</h2>
            <div className="grid gap-3">
              <input className="bg-white/10 border border-white/20 rounded-md px-3 py-2" placeholder="Part No" value={form.part_number} onChange={(e)=>setForm({...form, part_number:e.target.value})}/>
              <input className="bg-white/10 border border-white/20 rounded-md px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
              <input className="bg-white/10 border border-white/20 rounded-md px-3 py-2" placeholder="Category" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}/>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="bg-white/10 border border-white/20 rounded-md px-3 py-2" placeholder="Quantity" value={form.quantity} onChange={(e)=>setForm({...form, quantity:Number(e.target.value)})}/>
                <input type="number" className="bg-white/10 border border-white/20 rounded-md px-3 py-2" placeholder="Min Qty" value={form.min_quantity} onChange={(e)=>setForm({...form, min_quantity:Number(e.target.value)})}/>
              </div>
              <div className="flex justify-end gap-2 mt-1">
                <button className="px-3 py-2 rounded-xl bg-white/10" onClick={()=>setShowModal(false)}>Cancel</button>
                <button className="px-3 py-2 rounded-xl bg-red-500/90 hover:bg-red-500" onClick={async ()=>{
                  const status = form.quantity <= form.min_quantity ? 'Low Stock' : 'In Stock';
                  await getSupabase().from('parts').insert([{...form, status}]);
                  setShowModal(false);
                  setSearch("");
                }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


