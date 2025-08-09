"use client";

import { useEffect, useMemo, useState } from 'react';
import { Search, Activity, AlertTriangle, Settings, Clock, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/UI/table';
import type { JobTrackerItem, JobStatus } from '@/types/job-tracker';
import { fetchJobTracker } from '@/lib/api';
import dynamic from 'next/dynamic';
const JobTrackerForm = dynamic(() => import('@/components/mro/JobTrackerForm'), { ssr: false });

export default function MROJobTrackerTable() {
  const [jobs, setJobs] = useState<JobTrackerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState<null | { mode: 'create' | 'edit'; item?: JobTrackerItem }>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      let data: JobTrackerItem[] = [];
      try {
        data = await fetchJobTracker();
      } catch (err) {
        console.error('Failed to load job tracker:', err);
      }
      if (!mounted) return;
      setJobs(data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
            <Activity className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'On Hold':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            On Hold
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
    }
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return jobs.filter(job => {
      const matchesSearch =
        (job.customer ?? '').toLowerCase().includes(q) ||
        (job.description ?? '').toLowerCase().includes(q) ||
        (job.part_number ?? '').toLowerCase().includes(q) ||
        (job.job_card_no ?? '').toLowerCase().includes(q);
      const matchesStatus = !statusFilter || job.job_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-red-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-red-500"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button onClick={()=>setOpenForm({ mode: 'create' })} className="px-3 py-2 rounded-xl bg-red-500/90 hover:bg-red-500">Add Job</button>
      </div>
      <div className="card border border-white/15 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8"><Activity className="w-8 h-8 text-white/60 animate-spin" /></div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-white/60">No jobs found. Add your first job to get started.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Order Info</TableHead>
                  <TableHead>Job Card</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Finance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="font-medium text-white">{job.customer}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-white">{job.description}</div>
                        <div className="text-xs text-white/60">PN: {job.part_number} | SN: {job.serial_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-white/70 text-xs">
                        <div>LPO: {job.lpo_number} ({job.lpo_date || '-'})</div>
                        <div>RO: {job.ro_number} ({job.kq_repair_order_date || '-'})</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-white">{job.job_card_no}</div>
                        <div className="text-xs text-white/60">{job.job_card_date || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(job.job_status)}
                        <div className="text-xs text-white/60">{job.job_status_date || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${job.job_card_shared_with_finance === 'Yes' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {job.job_card_shared_with_finance}
                      </span>
                      <div>
                        <button onClick={()=>setOpenForm({ mode: 'edit', item: job })} className="mt-2 px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15 border border-white/20">Edit</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      {openForm && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto flex items-center justify-center">
          <div className="card w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{openForm.mode === 'create' ? 'Create Job Tracker' : 'Edit Job Tracker'}</h2>
              <button className="px-2 py-1 rounded bg-white/10" onClick={()=>setOpenForm(null)}>Close</button>
            </div>
            <JobTrackerForm
              mode={openForm.mode}
              initial={openForm.item}
              onClose={()=>setOpenForm(null)}
              onSaved={()=>{ setOpenForm(null); location.reload(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}


