# Python Analytics Jobs

This folder contains a small analytics job to compute and persist metrics for the dashboard.

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




