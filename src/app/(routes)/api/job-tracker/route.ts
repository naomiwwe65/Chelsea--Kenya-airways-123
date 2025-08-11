import { NextRequest, NextResponse } from "next/server";
export const runtime = 'nodejs';
import { Pool } from "pg";

function getPool() {
  const connectionString = process.env.AWS_RDS_URL as string;
  if (!connectionString) throw new Error("Missing AWS_RDS_URL env var");
  return new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
}

export async function GET() {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(`select * from job_tracker order by created_at desc limit 500`);
    return NextResponse.json(res.rows as unknown[]);
  } finally {
    client.release();
    pool.end();
  }
}

export async function POST(req: NextRequest) {
  const body: Record<string, unknown> = await req.json();
  const keys = Object.keys(body);
  const placeholders = keys.map((_, i) => `$${i + 1}`);
  const values = keys.map((k) => body[k]);
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(
      `insert into job_tracker(${keys.join(',')}) values(${placeholders.join(',')}) returning id`,
      values
    );
    return NextResponse.json({ id: res.rows[0].id });
  } finally {
    client.release();
    pool.end();
  }
}


