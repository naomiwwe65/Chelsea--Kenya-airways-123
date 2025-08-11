import { getSupabase } from "@/lib/supabase";
import type { MROItem, Progress } from "@/types/mro";
import type { JobTrackerItem } from "@/types/job-tracker";

const USE_AWS_API = (process.env.NEXT_PUBLIC_BACKEND ?? "supabase").toLowerCase() === "aws";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function fetchMROItems(): Promise<MROItem[]> {
  if (USE_AWS_API) {
    return apiFetch<MROItem[]>("/mro");
  }
  const sb = getSupabase();
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
  if (USE_AWS_API) {
    return apiFetch<{ id: string }>("/mro", { method: "POST", body: JSON.stringify(input) });
  }
  const sb = getSupabase();
  const { data, error } = await sb.from('internal_mro_jobs').insert([input]).select('id').single();
  if (error) throw error;
  return data;
}

export async function updateMROJob(id: string, input: Partial<UpsertMROJobInput>) {
  if (USE_AWS_API) {
    return apiFetch<{ id: string }>(`/mro/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  }
  const sb = getSupabase();
  const { data, error } = await sb.from('internal_mro_jobs').update(input).eq('id', id).select('id').single();
  if (error) throw error;
  return data;
}

export async function fetchJobTracker(): Promise<JobTrackerItem[]> {
  if (USE_AWS_API) {
    return apiFetch<JobTrackerItem[]>("/job-tracker");
  }
  const sb = getSupabase();
  const query = sb.from('job_tracker').select('*').order('created_at', { ascending: false }).limit(500);
  const { data, error } = await query;
  if (error) {
    const retry = await sb.from('job_tracker').select('*').limit(500);
    if (retry.error) {
      return [];
    }
    return retry.data as JobTrackerItem[];
  }
  return (data ?? []) as JobTrackerItem[];
}

export async function upsertJobTracker(item: Partial<JobTrackerItem> & { id?: string }) {
  if (USE_AWS_API) {
    if (item.id) {
      return apiFetch<{ id: string }>(`/job-tracker/${item.id}`, { method: "PATCH", body: JSON.stringify(item) });
    }
    return apiFetch<{ id: string }>(`/job-tracker`, { method: "POST", body: JSON.stringify(item) });
  }
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


