# Python Analytics Jobs

This folder contains a small analytics job to compute and persist metrics for the dashboard.

## Deploying to Render (Web Service)

- Root Directory: `python-analysis`
- Language: Python 3
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

Environment Variables (in Render):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Endpoints after deploy:
- `GET /health` – health check
- `POST /compute?days=90` – compute metrics and upsert to Supabase

## Setup

1) Create a virtual environment
```
python -m venv .venv
# Windows
.venv\\Scripts\\activate
# macOS/Linux
# source .venv/bin/activate
```

2) Install requirements
```
pip install -r requirements.txt
```

3) Configure environment
- Create a `.env` file next to `compute_metrics.py` with:
```
SUPABASE_URL=https://uznxhjvyfdwprsipanpn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

4) Run
```
python compute_metrics.py --days 90
```

The script upserts into `analytics_daily_trend` and `analytics_category_breakdown` tables.




