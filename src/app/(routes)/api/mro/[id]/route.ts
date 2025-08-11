import { NextRequest, NextResponse } from "next/server";
export const runtime = 'nodejs';
import { Pool } from "pg";

function getPool() {
  const connectionString = process.env.AWS_RDS_URL as string;
  if (!connectionString) throw new Error("Missing AWS_RDS_URL env var");
  return new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body: Record<string, unknown> = await _req.json();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(body)) {
    fields.push(`${k} = $${idx++}`);
    values.push(v);
  }
  values.push(id);
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(`update internal_mro_jobs set ${fields.join(', ')} where id = $${idx} returning id`, values);
    return NextResponse.json({ id });
  } finally {
    client.release();
    pool.end();
  }
}


