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
