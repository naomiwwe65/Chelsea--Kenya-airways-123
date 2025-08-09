"""
Analytics backfill and refresh job for Kenya Airways MRO dashboard.

This script aggregates:
- Daily order trend (Issue vs Restock counts per day)
- Parts category breakdown (counts and total quantity)

Results are upserted into:
- analytics_daily_trend(day, used, ordered)
- analytics_category_breakdown(category, part_count, total_quantity)

Usage
-----
1) Create a virtualenv (recommended):
   python -m venv .venv
   .venv\\Scripts\\activate   # Windows
   # or: source .venv/bin/activate

2) Install deps:
   pip install -r requirements.txt

3) Configure environment variables in a .env file (copy .env.example):
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...

4) Run:
   python compute_metrics.py --days 90

Note: This script requires the Supabase service role key (server-side only).
Never expose it to the browser or client code.
"""

from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Dict, Iterable, List

import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client


# -----------------------------
# Environment & Client
# -----------------------------

def build_client() -> Client:
    """Create a Supabase client using server-side credentials from .env."""
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
        )
    return create_client(url, key)


# -----------------------------
# Fetching
# -----------------------------

def fetch_orders(sb: Client) -> pd.DataFrame:
    resp = sb.table("orders").select("*").execute()
    data = resp.data or []
    return pd.DataFrame(data)


def fetch_parts(sb: Client) -> pd.DataFrame:
    resp = sb.table("parts").select("*").execute()
    data = resp.data or []
    return pd.DataFrame(data)


# -----------------------------
# Aggregations
# -----------------------------

def build_trend(df_orders: pd.DataFrame, days: int = 30) -> pd.DataFrame:
    """Return a dataframe with columns: day, used, ordered for last N days."""
    end = date.today()
    idx = pd.date_range(end - timedelta(days=days - 1), end, freq="D")
    base = pd.DataFrame({"day": idx.date})

    if df_orders.empty:
        base["used"] = 0
        base["ordered"] = 0
        return base

    d = df_orders.copy()
    d["day"] = pd.to_datetime(d["created_at"]).dt.date
    d["used"] = (d["type"] == "Issue").astype(int)
    d["ordered"] = (d["type"] == "Restock").astype(int)
    agg = d.groupby("day")["used", "ordered"].sum().reset_index()
    # pandas chained warning is fine here; alternative is .agg with dict
    out = base.merge(agg, on="day", how="left").fillna(0)
    out["used"] = out["used"].astype(int)
    out["ordered"] = out["ordered"].astype(int)
    return out


def build_category(parts: pd.DataFrame) -> pd.DataFrame:
    """Return a dataframe with: category, part_count, total_quantity."""
    if parts.empty:
        return pd.DataFrame(columns=["category", "part_count", "total_quantity"])
    p = parts.copy()
    p["category"] = p["category"].fillna("Other")
    grp = (
        p.groupby("category")
        .agg(part_count=("id", "count"), total_quantity=("quantity", "sum"))
        .reset_index()
    )
    return grp


# -----------------------------
# Persistence
# -----------------------------

def chunked(iterable: List[dict], size: int) -> Iterable[List[dict]]:
    for i in range(0, len(iterable), size):
        yield iterable[i : i + size]


def upsert_daily_trend(sb: Client, df: pd.DataFrame) -> None:
    payload = [
        {"day": str(r.day), "used": int(r.used), "ordered": int(r.ordered)}
        for r in df.itertuples(index=False)
    ]
    for chunk in chunked(payload, 500):
        sb.table("analytics_daily_trend").upsert(chunk, on_conflict="day").execute()


def upsert_category(sb: Client, df: pd.DataFrame) -> None:
    payload = [
        {
            "category": str(r.category),
            "part_count": int(r.part_count),
            "total_quantity": int(r.total_quantity),
        }
        for r in df.itertuples(index=False)
    ]
    for chunk in chunked(payload, 500):
        sb.table("analytics_category_breakdown").upsert(
            chunk, on_conflict="category"
        ).execute()


# -----------------------------
# CLI
# -----------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Compute and persist analytics metrics")
    parser.add_argument("--days", type=int, default=90, help="Number of days for trend (default 90)")
    args = parser.parse_args()

    sb = build_client()
    orders = fetch_orders(sb)
    parts = fetch_parts(sb)

    trend = build_trend(orders, days=max(1, int(args.days)))
    cat = build_category(parts)

    upsert_daily_trend(sb, trend)
    upsert_category(sb, cat)
    print(
        f"Analytics refreshed: {len(trend)} days; {len(cat)} categories"
    )


if __name__ == "__main__":
    main()





