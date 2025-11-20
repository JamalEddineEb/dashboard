from fastapi import APIRouter, Query, HTTPException
from typing import List
import os
import finnhub
from pydantic import BaseModel

router = APIRouter()

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
if not FINNHUB_API_KEY:
    raise RuntimeError("Missing FINNHUB_API_KEY")

client = finnhub.Client(api_key=FINNHUB_API_KEY)

# --- Pydantic models ---
class Stock(BaseModel):
    symbol: str
    name: str
    price: float
    changePercent: float
    volume: int = 0
    marketCap: float = 0.0

class TrendingStocksResponse(BaseModel):
    stocks: List[Stock]

# --- Predefined popular US stocks ---
POPULAR_STOCKS = [
    "AAPL", "MSFT", "TSLA", "AMZN", "GOOGL", "META",
    "NVDA", "SPY", "QQQ", "DIA", "NFLX", "INTC"
]

@router.get("/market/trending", response_model=TrendingStocksResponse)
async def get_trending_stocks(limit: int = Query(5, description="Number of top gainers/losers to return")):
    data = []

    try:
        for symbol in POPULAR_STOCKS:
            quote = client.quote(symbol)
            profile = client.company_profile2(symbol=symbol)

            data.append({
                "symbol": symbol,
                "name": profile.get("name", symbol),
                "price": quote.get("c", 0.0),
                "changePercent": quote.get("dp", 0.0),
                "volume": quote.get("v", 0),
                "marketCap": profile.get("marketCapitalization", 0.0)
            })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Finnhub API error: {e}")

    # Sort top gainers and losers
    gainers = sorted(data, key=lambda x: x["changePercent"], reverse=True)[:limit]

    # Convert to Pydantic models
    return TrendingStocksResponse(
        stocks=[Stock(**s) for s in gainers],
    )
