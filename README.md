# Chelsea — Kenya Airways MRO Dashboard

A modern, production-ready dashboard for Kenya Airways MRO (Maintenance, Repair, and Overhaul) analytics.

Built with:
- Next.js (App Router) + TypeScript
- Tailwind CSS (custom UI components)
- Optional Python FastAPI microservice for analytics (python-analysis/)
- Deploy-friendly for Vercel (web) and Render/other hosts (Python)

Live demo
- App (Vercel): https://chelsea-kenya-airways-123.vercel.app

Table of contents
- Overview
- Features
- Architecture
- Tech stack
- Project structure
- Screenshots
- Architecture diagram (Mermaid)
- Getting started
- Configuration (env)
- Python microservice (optional)
- API endpoints (examples)
- Quick-start dataset example
- Scripts
- Deployment
- Security & auth
- Troubleshooting
- Roadmap & contributions
- License

Overview
Chelsea is a dashboard that helps visualize MRO data and operational KPIs with secure, responsive UI and an optional Python service for heavier analytics.

Features
- Modern UI with responsive layouts (mobile drawer sidebar, protected sections)
- Light/dark friendly charts and visuals
- Client-side route protection and redirects for unauthenticated users
- Modular architecture: web app + optional Python analytics service
- Ready for cloud deploy (Vercel + Render) with environment-based configuration

Architecture
- Web (Next.js): UI, routing, light API routes, auth checks
- Python (FastAPI, optional): /health and /compute endpoints for analytics
- Communication: Web calls Python service via HTTP (configure base URL)

Tech stack
- Web: Next.js, TypeScript, Tailwind CSS
- Python: FastAPI, Uvicorn (dev)
- Node: 18+

Project structure (high-level)
- app/ … Next.js routes, layouts, pages
- components/ … shared UI components
- lib/ … utilities (API, hooks, etc.)
- public/ … static assets
- public/screenshots/ … screenshots used in README
- public/data/ … sample/local data
- python-analysis/ … optional FastAPI microservice (health/compute)

Screenshots
Add your screenshots to public/screenshots and ensure the paths below exist. GitHub will render them inline.

- Dashboard (light)
  ![Dashboard light](public/screenshots/dashboard-light.png)
- Dashboard (dark)
  ![Dashboard dark](public/screenshots/dashboard-dark.png)
- Mobile view
  ![Mobile view](public/screenshots/mobile.png)

Architecture diagram (Mermaid)
This diagram shows the simplified flow between the user, the web app, and the optional Python service.

```mermaid
flowchart LR
  U[User]
  W[Next.js Web App\n(UI + Routes + Auth)]
  P[(Python FastAPI\n/health, /compute)]
  E[External APIs/DBs]

  U -->|HTTPS| W
  W <-->|Fetch| E
  W <-->|HTTP JSON| P
  P -->|Compute results| W
```

Getting started (web)
1) Install dependencies
   - npm install
2) Run dev server
   - npm run dev
   - Open http://localhost:3000
3) Build & run production locally
   - npm run build && npm start

Configuration (env)
Create web/.env.local and fill values as needed. Example (Supabase shown as example):
- NEXT_PUBLIC_SUPABASE_URL=your-url
- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
- NEXT_PUBLIC_PY_SERVICE_URL=http://localhost:8000 (if using Python service locally)

Restart the dev server after changing any env vars.

Python microservice (optional)
Location: python-analysis/
- Create and activate virtual env
  - cd python-analysis
  - python -m venv .venv && source .venv/bin/activate (Windows: .venv\\Scripts\\activate)
- Install deps
  - pip install -r requirements.txt
- Run locally
  - uvicorn main:app --reload --port 8000
- Configure CORS if calling from the web app
- Example environment (if needed):
  - ALLOWED_ORIGINS=http://localhost:3000,https://chelsea-kenya-airways-123.vercel.app

API endpoints (examples)
Web (Next.js)
- Light API routes can live under /app/api (adjust per project needs)

Python (FastAPI)
- GET /health -> { "status": "ok" }
- POST /compute -> runs analytics task

Example compute request (curl)
```bash
curl -X POST "$NEXT_PUBLIC_PY_SERVICE_URL/compute" \
  -H 'Content-Type: application/json' \
  -d '{
        "work_orders": [
          {"id": "WO-1001", "tail": "5Y-KQA", "priority": "HIGH", "status": "OPEN", "hours": 6.5, "cost": 2100.50},
          {"id": "WO-1002", "tail": "5Y-KQZ", "priority": "MEDIUM", "status": "CLOSED", "hours": 2.25, "cost": 640.00}
        ],
        "since": "2025-08-01"
      }'
```

Example compute response
```json
{
  "summary": {
    "total_work_orders": 2,
    "open": 1,
    "closed": 1,
    "total_hours": 8.75,
    "total_cost": 2740.5
  },
  "trend": [
    {"date": "2025-08-01", "count": 1},
    {"date": "2025-08-02", "count": 1}
  ]
}
```

Quick-start dataset example
- Place a sample CSV at public/data/mro_work_orders.sample.csv
- Use it for quick local testing or to seed analytics requests

Sample CSV (public/data/mro_work_orders.sample.csv)
```csv
work_order_id,tail_number,status,priority,open_date,close_date,part_number,serial_number,labor_hours,material_cost
WO-1001,5Y-KQA,OPEN,HIGH,2025-08-01T08:10:00Z,,PN-7738,SN-99001,6.5,2100.50
WO-1002,5Y-KQZ,CLOSED,MEDIUM,2025-08-02T09:15:00Z,2025-08-02T14:00:00Z,PN-1120,SN-77818,2.25,640.00
WO-1003,5Y-KQJ,OPEN,LOW,2025-08-03T07:55:00Z,,PN-5512,SN-66110,1.75,120.00
```

Optional: you can POST parsed rows of this CSV to the /compute endpoint as shown above.

Scripts
- npm run dev — start local dev server
- npm run build — build for production
- npm start — start production server
- npm run lint — lint project

Deployment
Web (Vercel)
- Import the repository into Vercel
- Set required env vars (see Configuration)
- Deploy (automatic on push to main if configured)

Python (Render or similar)
- Create a new web service pointing to python-analysis/
- Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
- Set ALLOWED_ORIGINS and any other env vars

Security & auth
- Protected routes use client-side auth checks and redirect unauthenticated users to /auth/sign-in
- On logout, tokens are cleared and router.replace is used for redirects
- Keep secrets in env vars; never commit secrets to the repo

Troubleshooting
- 404 at / on Vercel: ensure root route or redirect is defined
- CORS errors when calling Python: set ALLOWED_ORIGINS and use NEXT_PUBLIC_PY_SERVICE_URL
- Lint/build errors: run npm run lint and fix reported issues
- Type errors: ensure Node 18+ and correct TypeScript config

Roadmap & contributions
- Add richer analytics and charts
- Add testing (unit/e2e) and CI
- Issues and PRs are welcome. Please use conventional commits.

License
- Not specified yet. Add a LICENSE file (e.g., MIT) to define usage.
