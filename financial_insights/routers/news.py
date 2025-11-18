import httpx
from datetime import datetime
from typing import List
from pydantic import BaseModel
import uvicorn
from fastapi import APIRouter
import os
from dotenv import load_dotenv

load_dotenv() 

API_KEY = os.getenv("FINNHUB_API_KEY")
FINNHUB_NEWS_URL = "https://finnhub.io/api/v1/news"

router = APIRouter()

class Article(BaseModel):
    id: str
    headline: str
    summary: str
    source: str
    url: str
    publishedAt: str
    sentiment: str
    sentimentScore: float
    image: str = None
    category: str = None

class NewsResponse(BaseModel):
    articles: List[Article]

# Dummy sentiment analyzer for demo
def analyze_sentiment(text: str):
    # A very simple placeholder; replace with real model or API
    text_lower = text.lower()
    if "rate cut" in text_lower or "positive" in text_lower:
        return "positive", 0.75
    elif "crisis" in text_lower or "negative" in text_lower:
        return "negative", 0.75
    else:
        return "neutral", 0.5

@router.get("/market/news", response_model=NewsResponse)
async def get_market_news(category: str = "top news"):
    headers = {"X-Finnhub-Token": API_KEY}
    params = {"category": category}
    async with httpx.AsyncClient() as client:
        response = await client.get(FINNHUB_NEWS_URL, headers=headers, params=params)
        raw_news = response.json()

    
    articles = []
    for i, item in enumerate(raw_news):
        # Convert timestamp to ISO8601
        pub_date = datetime.fromtimestamp(item.get("datetime")).isoformat() + "Z" if item.get("datetime") else None
        sentiment, score = analyze_sentiment(item.get("headline", "") + " " + item.get("summary", ""))
        article = Article(
            id=f"news-{item.get('id', i)}",
            headline=item.get("headline"),
            summary=item.get("summary"),
            source=item.get("source"),
            url=item.get("url"),
            publishedAt=pub_date,
            sentiment=sentiment,
            sentimentScore=score,
            image=item.get("image"),
            category=item.get("category")
        )
        articles.append(article)

    return NewsResponse(articles=articles)


