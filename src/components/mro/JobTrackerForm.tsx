"use client";

import { useState } from "react";
import type { JobTrackerItem, JobStatus } from "@/types/job-tracker";
import { upsertJobTracker } from "@/lib/api";

export interface JobTrackerFormProps {
  mode: "create" | "edit";
  initial?: Partial<JobTrackerItem> & { id?: string };
  onClose?: () => void;
  onSaved?: () => void;
}

const JOB_STATUSES: JobStatus[] = [
  "Pending",
  "In Progress",
  "Completed",
  "On Hold",
  "Cancelled",
];

export default function JobTrackerForm({ mode, initial, onClose, onSaved }: JobTrackerFormProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<JobTrackerItem>>({
    customer: initial?.customer ?? "",
    description: initial?.description ?? "",
    part_number: initial?.part_number ?? "",
    serial_number: initial?.serial_number ?? "",
    lpo_date: initial?.lpo_date ?? "",
    lpo_number: initial?.lpo_number ?? "",
    ro_number: initial?.ro_number ?? "",
    kq_repair_order_date: initial?.kq_repair_order_date ?? "",
    job_card_no: initial?.job_card_no ?? "",
    job_card_date: initial?.job_card_date ?? "",
    kq_works_order_wo_no: initial?.kq_works_order_wo_no ?? "",
    kq_works_order_date: initial?.kq_works_order_date ?? "",
    job_status: (initial?.job_status as JobStatus) ?? "Pending",
    job_status_date: initial?.job_status_date ?? "",
    job_card_shared_with_finance: initial?.job_card_shared_with_finance ?? "No",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<JobTrackerItem> & { id?: string } = {
        ...(initial?.id ? { id: initial.id } : {}),
        ...form,
      };
      await upsertJobTracker(payload);
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save job");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">Customer</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2" required
            value={form.customer as string} onChange={(e)=>setForm(f=>({...f, customer: e.target.value}))} />
        </div>
        <div>
          <label className="text-sm text-white/70">Description</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2" required
            value={form.description as string} onChange={(e)=>setForm(f=>({...f, description: e.target.value}))} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">Part Number</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.part_number as string} onChange={(e)=>setForm(f=>({...f, part_number: e.target.value}))} />
        </div>
        <div>
          <label className="text-sm text-white/70">Serial Number</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.serial_number as string} onChange={(e)=>setForm(f=>({...f, serial_number: e.target.value}))} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">LPO Date</label>
          <input type="date" className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={(form.lpo_date as string) || ""} onChange={(e)=>setForm(f=>({...f, lpo_date: e.target.value}))} />
        </div>
        <div>
          <label className="text-sm text-white/70">LPO Number</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.lpo_number as string} onChange={(e)=>setForm(f=>({...f, lpo_number: e.target.value}))} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">RO Number</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.ro_number as string} onChange={(e)=>setForm(f=>({...f, ro_number: e.target.value}))} />
        </div>
        <div>
          <label className="text-sm text-white/70">KQ Repair Order Date</label>
          <input type="date" className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={(form.kq_repair_order_date as string) || ""} onChange={(e)=>setForm(f=>({...f, kq_repair_order_date: e.target.value}))} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">Job Card No</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2" required
            value={form.job_card_no as string} onChange={(e)=>setForm(f=>({...f, job_card_no: e.target.value}))} />
        </div>
        <div>
          <label className="text-sm text-white/70">Job Card Date</label>
          <input type="date" className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={(form.job_card_date as string) || ""} onChange={(e)=>setForm(f=>({...f, job_card_date: e.target.value}))} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">KQ Works Order WO No</label>
          <input className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={form.kq_works_order_wo_no as string} onChange={(e)=>setForm(f=>({...f, kq_works_order_wo_no: e.target.value}))} />
        </div>
        <div>
          <label className="text-sm text-white/70">KQ Works Order Date</label>
          <input type="date" className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={(form.kq_works_order_date as string) || ""} onChange={(e)=>setForm(f=>({...f, kq_works_order_date: e.target.value}))} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/70">Job Status</label>
          <select className="mt-1 w-full bg-white text-black border border-gray-300 rounded-md px-3 py-2"
            value={form.job_status as string} onChange={(e)=>setForm(f=>({...f, job_status: e.target.value as JobStatus}))}>
            {JOB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/70">Job Status Date</label>
          <input type="date" className="mt-1 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2"
            value={(form.job_status_date as string) || ""} onChange={(e)=>setForm(f=>({...f, job_status_date: e.target.value}))} />
        </div>
      </div>

      <div>
        <label className="text-sm text-white/70">Shared with Finance</label>
        <select className="mt-1 w-full bg-white text-black border border-gray-300 rounded-md px-3 py-2"
          value={form.job_card_shared_with_finance as string}
          onChange={(e)=>setForm(f=>({...f, job_card_shared_with_finance: e.target.value as 'Yes' | 'No'}))}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
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



