# dashboard

A full-stack personal finance and market insights dashboard.

This repository contains three main pieces:

- `frontend/` — Vite + React (TypeScript) UI that renders the dashboard.
- `backend/dashboard/` — Java / Spring Boot service (Maven project) for backend APIs and data services.
- `financial_insights/` — FastAPI Python service that fetches market news, Reddit sentiment, and market overview data.

This README documents what each part does and how to run them locally (Linux / fish shell).

**Quick architecture**: The React frontend calls the Python `financial_insights` API (default port `8000`) for market insights; the Java backend contains additional server-side functionality (default Spring Boot port `8080`) and may be used for authentication, persistence, or other services.

**Required env vars (example)**
- `FINNHUB_API_KEY` — for market news (used by `financial_insights/routers/news.py`).
- `REDDIT_CLIENT_ID` and `REDDIT_SECRET` — for Reddit access (used by `financial_insights/routers/reddit_sentiment.py`).
- `ALPHA_VANTAGE_API_KEY` — optional, used by `financial_insights/routers/overview.py` if present.

If you don't set these keys some endpoints fallback to sample or limited behavior, but full features require them.

**Service ports**
- Frontend (Vite): 5173 (default for Vite)
- `financial_insights` (FastAPI / uvicorn): 8000
- Backend (Spring Boot): 8080

## Run the services (development)

Below are minimal steps to get each component running. Commands assume Linux and the fish shell.

1) Financial insights (Python FastAPI)

- Create a `.env` in `financial_insights/` with the environment variables above (example below).

Example `.env` (place in `financial_insights/`):

```
FINNHUB_API_KEY=your_finnhub_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_SECRET=your_reddit_secret
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
```

- Create and activate a virtualenv, then install dependencies. Note: `reddit_sentiment` pulls heavy ML packages (Transformers + TensorFlow + model weights): install those only if you need that endpoint.

```fish
cd financial_insights
python3 -m venv .venv
# For fish shells many venvs provide an activate.fish script
if test -f .venv/bin/activate.fish
	source .venv/bin/activate.fish
else
	source .venv/bin/activate
end
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn httpx python-dotenv pydantic asyncpraw yfinance
# Optional heavy deps for reddit_sentiment:
# python -m pip install transformers tensorflow
```

- Start the API server:

```fish
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API example endpoints (from `financial_insights/routers`):
- `GET /api/market/news` — market news (Finnhub)
- `GET /api/market/sentiment?symbols=AAPL,TSLA` — reddit sentiment (FinBERT + Reddit)
- `GET /api/market/overview` — market overview (yfinance / Alpha Vantage fallbacks)

2) Frontend (Vite + React)

```fish
cd frontend
npm install
npm run dev
```

Open the app in your browser at `http://localhost:5173` (or as printed by Vite).

3) Backend (Java / Spring Boot)

The backend is a Maven-based Spring Boot project located in `backend/dashboard/`.

```fish
cd backend/dashboard
./mvnw spring-boot:run
# Or build and run jar
./mvnw package
java -jar target/*.jar
```

The Spring Boot app typically runs on port `8080` unless configured otherwise in `src/main/resources/application.properties`.

## Notes, limitations & troubleshooting
- The `financial_insights/reddit_sentiment.py` endpoint uses a FinBERT model + `transformers` + `tensorflow`. Installing and loading the model can be slow and uses significant RAM. If you don't need it, skip installing those deps.
- If you hit API rate limits for Finnhub or Alpha Vantage, you may see incomplete data — consider adding caching or using paid tiers for production.
- The frontend expects the insights API to be available; you may need to configure CORS or change base URLs if running services on different hosts/ports.

