import { NextRequest, NextResponse } from "next/server";
export const runtime = 'nodejs';
import { Pool } from "pg";

function getPool() {
  const connectionString = process.env.AWS_RDS_URL as string;
  if (!connectionString) throw new Error("Missing AWS_RDS_URL env var");
  return new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
}

type InternalMroRow = {
  id: string;
  title: string | null;
  aircraft_reg_no: string | null;
  assigned_engineer: string | null;
  maintenance_date: string | null;
  status: string | null;
};

export async function GET() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(
      `select id, title, aircraft_reg_no, assigned_engineer, maintenance_date, status
       from internal_mro_jobs
       order by created_at desc
       limit 200`
    );
    const rows = (res.rows as InternalMroRow[]).map((j) => ({
      id: j.id,
      customer: j.assigned_engineer ?? undefined,
      part_number: j.aircraft_reg_no ?? undefined,
      description: j.title ?? undefined,
      date_delivered: j.maintenance_date ?? undefined,
      progress: (j.status ?? 'PENDING'),
      location: undefined,
      expected_release_date: undefined,
      remarks: undefined,
      category: 'MAIN',
    }));
    return NextResponse.json(rows);
  } finally {
    client.release();
    pool.end();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, aircraft_reg_no, assigned_engineer, maintenance_date, status } = body ?? {};
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(
      `insert into internal_mro_jobs(title, aircraft_reg_no, assigned_engineer, maintenance_date, status)
       values($1,$2,$3,$4,$5) returning id`,
      [title, aircraft_reg_no, assigned_engineer ?? null, maintenance_date ?? null, status]
    );
    return NextResponse.json({ id: res.rows[0].id });
  } finally {
    client.release();
    pool.end();
  }
}


