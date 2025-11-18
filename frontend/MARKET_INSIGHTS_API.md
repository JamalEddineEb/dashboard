# Market Insights API Specification

This document defines the backend API endpoints needed for the Market Insights feature.

## Environment Variable

Add to your `.env` file:
```
VITE_API_BASE_URL=/api
```

Or set to your custom backend URL if hosting separately.

---

## Endpoints to Implement

### 1. GET `/api/market/overview`

**Description**: Returns overall market status and major indices.

**Response Format**:
```json
{
  "indices": [
    {
      "symbol": "SPX",
      "name": "S&P 500",
      "price": 4567.89,
      "change": 23.45,
      "changePercent": 0.52,
      "volume": 2345678900
    },
    {
      "symbol": "DJI",
      "name": "Dow Jones",
      "price": 35432.12,
      "change": -45.32,
      "changePercent": -0.13,
      "volume": 1234567800
    }
  ],
  "status": {
    "status": "open",
    "exchange": "NYSE",
    "timestamp": "2025-10-31T14:30:00Z"
  },
  "totalMarketCap": 42100000000000,
  "totalVolume": 2300000000,
  "advancers": 1234,
  "decliners": 876
}
```

**Suggested Data Sources**:
- Finnhub: `/quote` endpoint for indices
- Alpha Vantage: Market overview data
- Yahoo Finance API

---

### 2. GET `/api/market/news`

**Query Parameters**:
- `limit` (optional, default: 20): Number of articles to return

**Description**: Returns latest market news articles with sentiment.

**Response Format**:
```json
{
  "articles": [
    {
      "id": "news-123",
      "headline": "Fed Signals Rate Cut in Q2 2025",
      "summary": "Federal Reserve officials indicated potential rate cuts...",
      "source": "Reuters",
      "url": "https://example.com/article",
      "publishedAt": "2025-10-31T10:30:00Z",
      "sentiment": "positive",
      "sentimentScore": 0.75,
      "image": "https://example.com/image.jpg",
      "category": "monetary-policy"
    }
  ]
}
```

**Sentiment Values**: `"positive"`, `"negative"`, or `"neutral"`

**Suggested Data Sources**:
- Finnhub: `/news` endpoint
- News API
- Alpha Vantage news sentiment

---

### 3. GET `/api/market/sentiment`

**Query Parameters**:
- `symbols` (required): Comma-separated stock symbols (e.g., `SPY,QQQ,DIA`)

**Description**: Returns social sentiment data for specified symbols.

**Response Format**:
```json
{
  "data": [
    {
      "symbol": "SPY",
      "bullishPercent": 65.5,
      "bearishPercent": 34.5,
      "totalMentions": 12345,
      "trend": "up"
    },
    {
      "symbol": "QQQ",
      "bullishPercent": 58.2,
      "bearishPercent": 41.8,
      "totalMentions": 8765,
      "trend": "stable"
    }
  ]
}
```

**Trend Values**: `"up"`, `"down"`, or `"stable"`

**Suggested Data Sources**:
- Finnhub: `/stock/social-sentiment` endpoint
- StockTwits API
- Reddit sentiment analysis

---

### 4. GET `/api/market/trending`

**Query Parameters**:
- `limit` (optional, default: 10): Number of stocks to return

**Description**: Returns most active/trending stocks.

**Response Format**:
```json
{
  "stocks": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 178.45,
      "changePercent": 2.34,
      "volume": 87654321,
      "marketCap": 2800000000000
    },
    {
      "symbol": "TSLA",
      "name": "Tesla, Inc.",
      "price": 245.67,
      "changePercent": -1.23,
      "volume": 76543210,
      "marketCap": 780000000000
    }
  ]
}
```

**Suggested Data Sources**:
- Finnhub: `/stock/symbol` + volume sorting
- Yahoo Finance trending tickers
- IEX Cloud: `/stock/market/list/mostactive`

---

## Implementation Notes

### CORS Configuration
Make sure your backend supports CORS for the frontend origin.

### Rate Limiting
- Cache responses appropriately
- Frontend automatically refetches every 1-5 minutes
- Consider rate limiting on backend to avoid API quota issues

### Error Handling
Return standard HTTP error codes:
- `200`: Success
- `400`: Bad request (invalid parameters)
- `429`: Too many requests (rate limited)
- `500`: Internal server error

### Authentication (Optional)
If you want to protect these endpoints:
- Add JWT verification
- Pass token via `Authorization: Bearer <token>` header
- Frontend will need to include the token in requests

---

## Finnhub Integration Example

If using Finnhub, here's a basic example:

```typescript
const FINNHUB_API_KEY = "your_api_key";

// Get stock quote
async function getQuote(symbol: string) {
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );
  return response.json();
}

// Get market news
async function getNews(category = "general") {
  const response = await fetch(
    `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_API_KEY}`
  );
  return response.json();
}

// Get social sentiment
async function getSentiment(symbol: string) {
  const response = await fetch(
    `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );
  return response.json();
}
```

---

## Workflow Integration Ideas

Once the basic endpoints are working, you can add:

1. **Price Alerts**: POST `/api/workflows/price-alert`
   - Set price thresholds
   - Trigger webhooks/emails when reached

2. **Daily Digest**: POST `/api/workflows/daily-digest`
   - Schedule daily market summaries
   - Send via email or webhook

3. **Sentiment Alerts**: POST `/api/workflows/sentiment-alert`
   - Monitor sentiment changes
   - Alert on significant shifts

4. **Custom Watchlists**: POST `/api/watchlist`
   - Save user's tracked symbols
   - Get personalized updates

---

## Testing

Test each endpoint individually:

```bash
# Test market overview
curl http://localhost:8080/api/market/overview

# Test news
curl http://localhost:8080/api/market/news?limit=5

# Test sentiment
curl http://localhost:8080/api/market/sentiment?symbols=SPY,QQQ

# Test trending
curl http://localhost:8080/api/market/trending?limit=10
```
