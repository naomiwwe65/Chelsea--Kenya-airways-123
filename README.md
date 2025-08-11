This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase setup

The app reads Supabase credentials from environment variables. Create `web/.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can copy `web/.env.local.example` and fill in your values. After changing env vars, restart the dev server.

Ensure the `job_tracker` table exists and your Row Level Security (RLS) policies allow read/write for your use case. For quick local testing you can temporarily allow public read:

```sql
-- Enable RLS if not enabled
alter table public.job_tracker enable row level security;

-- Public read policy (adjust for your auth model)
create policy "public read job_tracker"
  on public.job_tracker for select
  to anon, authenticated
  using (true);
```

Seed example row:

## AWS RDS + dual backend setup

This project can talk to either Supabase directly from the browser or to an AWS-backed Node API that connects to Amazon RDS Postgres. Choose at runtime via env var.

1) Create `web/.env.local` and set:

```
# Choose backend: "supabase" (default) or "aws"
NEXT_PUBLIC_BACKEND=aws

# Base URL for browser to call Next.js API routes
NEXT_PUBLIC_API_BASE_URL=/api

# RDS connection string (example)
AWS_RDS_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
```

2) Tables expected in RDS (same schema as Supabase):

```sql
-- internal_mro_jobs (subset of columns used by the UI)
create table if not exists internal_mro_jobs (
  id uuid default gen_random_uuid() primary key,
  title text,
  aircraft_reg_no text,
  assigned_engineer text,
  maintenance_date date,
  status text,
  created_at timestamptz default now()
);

-- job_tracker
create table if not exists job_tracker (
  id uuid default gen_random_uuid() primary key,
  customer text not null,
  description text not null,
  part_number text,
  serial_number text,
  lpo_date date,
  lpo_number text,
  ro_number text,
  kq_repair_order_date date,
  job_card_no text not null,
  job_card_date date,
  kq_works_order_wo_no text,
  kq_works_order_date date,
  job_status text not null,
  job_status_date date,
  job_card_shared_with_finance text not null,
  created_at timestamptz default now()
);
```

3) Run locally against RDS:

```
cd web
npm install
npm run dev
```

4) Deploy to AWS (one option):

- Host Next.js on AWS Elastic Beanstalk, ECS Fargate, or Amplify Hosting.
- Set `AWS_RDS_URL`, `NEXT_PUBLIC_BACKEND=aws`, and `NEXT_PUBLIC_API_BASE_URL=/api` in the app environment.
- Ensure outbound access from app to the RDS instance (VPC/subnets/security groups).

You can still keep Supabase for other features; switch back by setting `NEXT_PUBLIC_BACKEND=supabase`.

```sql
insert into public.job_tracker (
  customer, description, part_number, serial_number,
  lpo_date, lpo_number, ro_number, kq_repair_order_date,
  job_card_no, job_card_date, kq_works_order_wo_no, kq_works_order_date,
  job_status, job_status_date, job_card_shared_with_finance
) values (
  'Acme Airlines', 'Starter Generator Repair', 'SG-123', 'SN-999',
  null, 'LPO-001', 'RO-001', null,
  'JC-1001', current_date, 'WO-77', null,
  'Pending', current_date, 'No'
);
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
