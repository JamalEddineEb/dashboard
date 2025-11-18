from fastapi import FastAPI
from routers import news, reddit_sentiment, overview
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:4200", 
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news.router, prefix="/api", tags=["market"])
app.include_router(reddit_sentiment.router, prefix="/api", tags=["user"])
app.include_router(overview.router, prefix="/api", tags=["user"])


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
