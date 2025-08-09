"use client";

import { useState } from "react";
import { createMROJob, updateMROJob, type UpsertMROJobInput } from "@/lib/api";

export interface MROJobFormProps {
  mode: 'create' | 'edit';
  initial?: {
    id?: string;
    title?: string;
    aircraft_reg_no?: string;
    assigned_engineer?: string | null;
    maintenance_date?: string | null;
    status?: 'In Progress' | 'Completed' | 'Delayed';
  };
  onClose?: () => void;
  onSaved?: () => void;
}

export default function MROJobForm({ mode, initial, onClose, onSaved }: MROJobFormProps) {
  const [form, setForm] = useState<UpsertMROJobInput>({
    title: initial?.title ?? "",
    aircraft_reg_no: initial?.aircraft_reg_no ?? "",
    assigned_engineer: initial?.assigned_engineer ?? "",
    maintenance_date: initial?.maintenance_date ?? "",
    status: initial?.status ?? 'In Progress',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (mode === 'create') {
        await createMROJob(form);
      } else if (mode === 'edit' && initial?.id) {
        await updateMROJob(initial.id, form);
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert('Failed to save MRO job');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">Job Title</label>
          <input
            className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.title}
            onChange={(e)=>setForm({...form, title: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Aircraft Reg No</label>
          <input
            className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.aircraft_reg_no}
            onChange={(e)=>setForm({...form, aircraft_reg_no: e.target.value})}
            required
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">Assigned Engineer</label>
          <input
            className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.assigned_engineer ?? ''}
            onChange={(e)=>setForm({...form, assigned_engineer: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Maintenance Date</label>
          <input
            type="date"
            className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.maintenance_date ?? ''}
            onChange={(e)=>setForm({...form, maintenance_date: e.target.value})}
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-white/70">Status</label>
        <select
          className="mt-1 w-full bg-white text-black border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={form.status}
          onChange={(e)=>setForm({...form, status: e.target.value as UpsertMROJobInput['status']})}
        >
          <option>In Progress</option>
          <option>Completed</option>
          <option>Delayed</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" className="px-3 py-2 rounded-xl bg-white/10" onClick={onClose} disabled={saving}>Cancel</button>
        <button type="submit" className="px-3 py-2 rounded-xl bg-red-500/90 hover:bg-red-500" disabled={saving}>
          {saving ? 'Saving...' : (mode === 'create' ? 'Create Job' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
}


