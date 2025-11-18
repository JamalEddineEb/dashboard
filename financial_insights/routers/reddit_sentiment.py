from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import os
import re
import asyncio
from concurrent.futures import ThreadPoolExecutor
import asyncpraw
from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
import tensorflow as tf

FINBERT_MODEL = "yiyanghkust/finbert-tone"
_tokenizer = AutoTokenizer.from_pretrained(FINBERT_MODEL)
_model = TFAutoModelForSequenceClassification.from_pretrained(FINBERT_MODEL)

router = APIRouter()


class SentimentItem(BaseModel):
    symbol: str
    totalMentions: int
    bullishPercent: float
    bearishPercent: float
    trend: str
    topEntities: List[List[Any]] 

class SentimentResponse(BaseModel):
    data: List[SentimentItem]

def finbert_label(text: str) -> str:
    # Tokenize (TensorFlow backend)
    inputs = _tokenizer(
        text,
        return_tensors="tf",
        truncation=True,
        max_length=512
    )
    # Forward pass
    outputs = _model(inputs)
    logits = outputs.logits[0]
    # Softmax (TensorFlow)
    probs = tf.nn.softmax(logits).numpy()
    # Labels mapping from FinBERT
    labels = ["neutral", "bullish", "bearish"]
    idx = int(tf.argmax(probs))
    return labels[idx]

def extract_entities(text: str):
    # Placeholder simple NER: uppercase tokens 2–5 chars (tickers)
    return re.findall(r"\b[A-Z]{2,5}\b", text)

# --- External APIs ---
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_SECRET = os.getenv("REDDIT_SECRET")
USER_AGENT = "market-insights-app/1.0"

if not (REDDIT_CLIENT_ID and REDDIT_SECRET):
    raise RuntimeError("Missing REDDIT_CLIENT_ID/REDDIT_SECRET")

reddit = asyncpraw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_SECRET,
    user_agent=USER_AGENT,
)

_executor = ThreadPoolExecutor(max_workers=4)

SUBREDDITS = ["investing", "wallstreetbets"]
MAX_REDDIT_PER_SUB = 30
MAX_TWITTER = 50

async def fetch_reddit_mentions(symbol: str) -> Dict[str, Any]:
    total = bullish = bearish = 0
    entities: Dict[str, int] = {}
    
    for sub_name in SUBREDDITS:
        sub = await reddit.subreddit(sub_name)
        async for submission in sub.search(symbol, limit=MAX_REDDIT_PER_SUB):
            text = f"{submission.title or ''} {submission.selftext or ''}".strip()
            if not text or symbol.lower() not in text.lower():
                continue
            
            total += 1
            label = finbert_label(text)
            if label == "bullish":
                bullish += 1
            elif label == "bearish":
                bearish += 1
            
            for ent in extract_entities(text):
                entities[ent] = entities.get(ent, 0) + 1
    
    return {"total": total, "bullish": bullish, "bearish": bearish, "entities": entities}

@router.get("/market/sentiment", response_model=SentimentResponse)
async def combined_insights(symbols: str = Query(..., description="Comma-separated ticker symbols")):
    symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    if not symbol_list:
        raise HTTPException(status_code=400, detail="No valid symbols provided")
    
    results: List[Dict[str, Any]] = []
    
    for symbol in symbol_list:
        # Fixed: Await the async function call
        reddit_data = await fetch_reddit_mentions(symbol)
        
        total = reddit_data["total"]
        bull = reddit_data["bullish"]
        bear = reddit_data["bearish"]
        
        bull_pct = round((bull / total) * 100, 1) if total else 0.0
        bear_pct = round((bear / total) * 100, 1) if total else 0.0
        trend = "up" if bull_pct > bear_pct else "down" if bear_pct > bull_pct else "stable"
        
        results.append({
            "symbol": symbol,
            "totalMentions": total,
            "bullishPercent": bull_pct,
            "bearishPercent": bear_pct,
            "trend": trend,
            "topEntities": sorted(reddit_data["entities"].items(), key=lambda x: x[1], reverse=True)[:5],
        })
    
    return {"data":results}