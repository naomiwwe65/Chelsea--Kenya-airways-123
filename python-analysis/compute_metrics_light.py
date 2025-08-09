"""
Lightweight analytics job without pandas (Windows-friendly).

Computes:
- Daily order trend for the last N days (Issue vs Restock counts)
- Category breakdown from parts (count and total quantity)

Env (.env next to this file):
  SUPABASE_URL=https://uznxhjvyfdwprsipanpn.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

Usage:
  python compute_metrics_light.py --days 90
"""

from __future__ import annotations

import argparse
import os
from collections import defaultdict
from datetime import date, datetime, timedelta
from typing import Dict, List

from dotenv import load_dotenv
from supabase import create_client, Client


def build_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    return create_client(url, key)


def fetch_table(sb: Client, name: str) -> List[dict]:
    out: List[dict] = []
    # simple paged fetch in case of large tables
    page = 0
    page_size = 1000
    while True:
        resp = (
            sb.table(name)
            .select("*")
            .range(page * page_size, page * page_size + page_size - 1)
            .execute()
        )
        rows = resp.data or []
        out.extend(rows)
        if len(rows) < page_size:
            break
        page += 1
    return out


def compute_trend(orders: List[dict], days: int) -> List[dict]:
    today = date.today()
    start = today - timedelta(days=days - 1)
    bucket: Dict[date, Dict[str, int]] = {}
    for i in range(days):
        d = start + timedelta(days=i)
        bucket[d] = {"day": d, "used": 0, "ordered": 0}

    for o in orders:
        ts = o.get("created_at")
        if not ts:
            continue
        try:
            d = datetime.fromisoformat(ts.replace("Z", "+00:00")).date()
        except Exception:
            continue
        if d < start or d > today:
            continue
        t = o.get("type")
        if t == "Issue":
            bucket[d]["used"] += 1
        elif t == "Restock":
            bucket[d]["ordered"] += 1

    # convert to supabase rows
    rows = []
    for i in range(days):
        d = start + timedelta(days=i)
        b = bucket[d]
        rows.append({"day": str(b["day"]), "used": b["used"], "ordered": b["ordered"]})
    return rows


def compute_category(parts: List[dict]) -> List[dict]:
    count: Dict[str, int] = defaultdict(int)
    total_qty: Dict[str, int] = defaultdict(int)
    for p in parts:
        cat = p.get("category") or "Other"
        count[cat] += 1
        total_qty[cat] += int(p.get("quantity") or 0)
    rows = []
    for cat in sorted(count.keys()):
        rows.append(
            {
                "category": cat,
                "part_count": count[cat],
                "total_quantity": total_qty[cat],
            }
        )
    return rows


def chunked(rows: List[dict], size: int = 500):
    for i in range(0, len(rows), size):
        yield rows[i : i + size]


def main():
    parser = argparse.ArgumentParser(description="Compute analytics without pandas")
    parser.add_argument("--days", type=int, default=90)
    args = parser.parse_args()

    sb = build_client()
    orders = fetch_table(sb, "orders")
    parts = fetch_table(sb, "parts")

    trend_rows = compute_trend(orders, max(1, args.days))
    cat_rows = compute_category(parts)

    for c in chunked(trend_rows):
        sb.table("analytics_daily_trend").upsert(c, on_conflict="day").execute()
    for c in chunked(cat_rows):
        sb.table("analytics_category_breakdown").upsert(c, on_conflict="category").execute()

    print(f"Analytics refreshed: {len(trend_rows)} days; {len(cat_rows)} categories")


if __name__ == "__main__":
    main()





