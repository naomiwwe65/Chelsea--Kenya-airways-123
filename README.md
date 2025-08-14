# Chelsea — Kenya Airways MRO Dashboard

A modern Next.js (TypeScript) dashboard for Kenya Airways MRO analytics, with an optional Python FastAPI microservice for additional data processing.

Live demo
- App (Vercel): https://chelsea-kenya-airways-123.vercel.app

Overview
- Frontend: Next.js (App Router) + TypeScript
- Styling/Components: Tailwind CSS + (project UI components)
- Auth: client-side route protection (see app/(protected) layout)
- API: Next.js API routes; optional Python FastAPI service for analytics

Repository structure (high-level)
- app/ … Next.js routes, layouts, pages
- components/ … shared UI components
- lib/ … utilities (API, hooks, etc.)
- public/ … static assets
- python-analysis/ … optional FastAPI microservice (health/compute)

Quick start (web)
1) Install dependencies
   - npm install
2) Run dev server
   - npm run dev
   - Open http://localhost:3000

Environment variables (web)
Create web/.env.local and fill values as needed. Example if using Supabase:
- NEXT_PUBLIC_SUPABASE_URL=your-url
- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

Restart the dev server after adding/updating env vars.

FastAPI microservice (optional)
Location: python-analysis/
- Create virtual env and install:
  - cd python-analysis
  - python -m venv .venv && source .venv/bin/activate (Windows: .venv\\Scripts\\activate)
  - pip install -r requirements.txt
- Run locally:
  - uvicorn main:app --reload --port 8000
- Endpoints:
  - GET /health -> { status: "ok" }
  - POST /compute -> run analytics task
- Deploy example: Render.com (create a new web service pointing to python-analysis with start command `uvicorn main:app --host 0.0.0.0 --port $PORT`)

Auth and protected routes
- The protected layout enforces client-side auth checks and redirects unauthenticated users to /auth/sign-in.
- On logout, tokens are cleared and router.replace is used for redirects.

Scripts
- npm run dev — start local dev server
- npm run build — build for production
- npm start — start production server
- npm run lint — lint project

Deployment
- Web: Vercel (recommended). Import the repo in Vercel, set required env vars, and deploy.
- Python: Render (or your preferred host) for the FastAPI microservice.

Notes
- If you run both services locally, remember to configure CORS and the web app’s API base URL to reach the Python service (e.g., http://localhost:8000).
- Keep env secrets out of the repository.

Contributing
- Issues and PRs are welcome. Please follow conventional commits for clarity.

