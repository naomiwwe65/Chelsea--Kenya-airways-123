import { getSupabase } from "@/lib/supabase";
import type { MROItem, Progress } from "@/types/mro";
import type { JobTrackerItem, JobStatus } from "@/types/job-tracker";

export async function fetchMROItems(): Promise<MROItem[]> {
  const sb = getSupabase();
  // Adapting to existing internal_mro_jobs table; map to MROItem shape
  const { data, error } = await sb
    .from("internal_mro_jobs")
    .select("id,title,aircraft_reg_no,assigned_engineer,maintenance_date,status")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return [];
  return (data ?? []).map((j: {
    id: string;
    title?: string;
    aircraft_reg_no?: string;
    assigned_engineer?: string | null;
    maintenance_date?: string | null;
    status?: string;
  }) => ({
    id: j.id,
    customer: j.assigned_engineer ?? undefined,
    part_number: j.aircraft_reg_no ?? undefined,
    description: j.title ?? undefined,
    date_delivered: j.maintenance_date ?? undefined,
    progress: ((j.status as string | undefined) ?? 'PENDING') as Progress,
    location: undefined,
    expected_release_date: undefined,
    remarks: undefined,
    category: 'MAIN',
  }));
}

export interface UpsertMROJobInput {
  title: string;
  aircraft_reg_no: string;
  assigned_engineer?: string | null;
  maintenance_date?: string | null; // ISO date (YYYY-MM-DD)
  status: 'In Progress' | 'Completed' | 'Delayed';
}

export async function createMROJob(input: UpsertMROJobInput) {
  const sb = getSupabase();
  const { data, error } = await sb.from('internal_mro_jobs').insert([input]).select('id').single();
  if (error) throw error;
  return data;
}

export async function updateMROJob(id: string, input: Partial<UpsertMROJobInput>) {
  const sb = getSupabase();
  const { data, error } = await sb.from('internal_mro_jobs').update(input).eq('id', id).select('id').single();
  if (error) throw error;
  return data;
}

export async function fetchJobTracker(): Promise<JobTrackerItem[]> {
  const sb = getSupabase();
  // Try ordering by created_at; if the column doesn't exist, fallback to unordered
  let query = sb.from('job_tracker').select('*').order('created_at', { ascending: false }).limit(500);
  let { data, error } = await query;
  if (error) {
    if (typeof window !== 'undefined') console.warn('fetchJobTracker order by created_at failed, retrying without order:', error.message);
    const retry = await sb.from('job_tracker').select('*').limit(500);
    if (retry.error) {
      if (typeof window !== 'undefined') console.warn('fetchJobTracker error:', retry.error.message);
      return [];
    }
    return retry.data as JobTrackerItem[];
  }
  return (data ?? []) as JobTrackerItem[];
}

export async function upsertJobTracker(item: Partial<JobTrackerItem> & { id?: string }) {
  const sb = getSupabase();
  if (item.id) {
    const { data, error } = await sb.from('job_tracker').update(item).eq('id', item.id).select('id').single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await sb.from('job_tracker').insert([item]).select('id').single();
    if (error) throw error;
    return data;
  }
}


