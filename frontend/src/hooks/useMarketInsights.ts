import { useQuery } from "@tanstack/react-query";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export interface MarketStatus {
  status: "open" | "closed" | "pre-market" | "after-hours";
  exchange: string;
  timestamp: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: "positive" | "negative" | "neutral";
  sentimentScore?: number;
  image?: string;
  category: string;
}

export interface SentimentData {
  symbol: string;
  bullishPercent: number;
  bearishPercent: number;
  totalMentions: number;
  trend: "up" | "down" | "stable";
}

export interface TrendingStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface MarketOverview {
  indices: MarketIndex[];
  status: MarketStatus;
  totalMarketCap: number;
  totalVolume: number;
  advancers: number;
  decliners: number;
}

// ============================================
// API ENDPOINTS TO IMPLEMENT
// ============================================
// 
// GET /api/market/overview
// Response: MarketOverview
//
// GET /api/market/news?limit=20
// Response: { articles: NewsArticle[] }
//
// GET /api/market/sentiment?symbols=SPY,QQQ
// Response: { data: SentimentData[] }
//
// GET /api/market/trending?limit=10
// Response: { stocks: TrendingStock[] }
//
// ============================================

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// ============================================
// CUSTOM HOOKS
// ============================================

export function useMarketOverview() {
  return useQuery<MarketOverview>({
    queryKey: ["market", "overview"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/market/overview`);
      if (!response.ok) throw new Error("Failed to fetch market overview");
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

export function useMarketNews(limit = 20) {
  return useQuery<{ articles: NewsArticle[] }>({
    queryKey: ["market", "news", limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/market/news?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch market news");
      return response.json();
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000,
  });
}

export function useMarketSentiment(symbols: string[] = ["SPY", "QQQ", "DIA"]) {
  return useQuery<{ data: SentimentData[] }>({
    queryKey: ["market", "sentiment", symbols],
    queryFn: async () => {
      const symbolsParam = symbols.join(",");
      const response = await fetch(`${API_BASE}/market/sentiment?symbols=${symbolsParam}`);
      if (!response.ok) throw new Error("Failed to fetch market sentiment");
      return response.json();
    },
    refetchInterval: 300000,
    staleTime: 120000,
  });
}

export function useTrendingStocks(limit = 10) {
  return useQuery<{ stocks: TrendingStock[] }>({
    queryKey: ["market", "trending", limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/market/trending?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch trending stocks");
      return response.json();
    },
    refetchInterval: 300000,
    staleTime: 120000,
  });
}

// Utility function to format large numbers
export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}

// Utility function to format volume
export function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toString();
}
