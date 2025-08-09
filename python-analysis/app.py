from __future__ import annotations

from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse

from compute_metrics_light import (
    build_client,
    fetch_table,
    compute_trend,
    compute_category,
    chunked,
)

app = FastAPI(title="Kenya MRO Analytics API", version="1.0.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/compute")
def compute(days: int = Query(90, ge=1, le=365)) -> JSONResponse:
    """Compute analytics and upsert into Supabase.

    - days: number of days for the trend (1-365)
    """
    sb = build_client()
    orders = fetch_table(sb, "orders")
    parts = fetch_table(sb, "parts")

    trend_rows = compute_trend(orders, days)
    cat_rows = compute_category(parts)

    for c in chunked(trend_rows):
        sb.table("analytics_daily_trend").upsert(c, on_conflict="day").execute()
    for c in chunked(cat_rows):
        sb.table("analytics_category_breakdown").upsert(c, on_conflict="category").execute()

    return JSONResponse(
        {
            "result": "ok",
            "days": days,
            "trend_rows": len(trend_rows),
            "category_rows": len(cat_rows),
        }
    )


