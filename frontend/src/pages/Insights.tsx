import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, DollarSign, Newspaper, BarChart3, Loader2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarketNewsCard } from "@/components/MarketNewsCard";
import {
  useMarketOverview,
  useMarketNews,
  useMarketSentiment,
  useTrendingStocks,
  formatMarketCap,
  formatVolume,
} from "@/hooks/useMarketInsights";

export default function Insights() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useMarketOverview();
  const { data: news, isLoading: newsLoading } = useMarketNews(20);
  const { data: sentiment, isLoading: sentimentLoading } = useMarketSentiment();
  const { data: trending, isLoading: trendingLoading } = useTrendingStocks(10);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Market Insights</h1>
            <p className="text-muted-foreground">
              Stay informed with real-time market data and trends
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="news">Market News</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6">
              {overviewLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : overviewError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load market data. Please implement the backend endpoint: GET /api/market/overview
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {/* Market Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold capitalize">
                          {overview?.status.status || "Loading..."}
                        </div>
                        <p className="text-xs text-muted-foreground">{overview?.status.exchange}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {overview?.totalMarketCap ? formatMarketCap(overview.totalMarketCap) : "$0"}
                        </div>
                        <p className="text-xs text-muted-foreground">Total value</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {overview?.totalVolume ? formatVolume(overview.totalVolume) : "0"}
                        </div>
                        <p className="text-xs text-muted-foreground">Shares traded</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Breadth</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                          {overview?.advancers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Advancers / <span className="text-red-500">{overview?.decliners || 0} Decliners</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Major Indices */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Major Indices</CardTitle>
                      <CardDescription>Real-time market index performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {overview?.indices.map((index) => (
                          <div key={index.symbol} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{index.name}</div>
                              <div className="text-sm text-muted-foreground">{index.symbol}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{index.price.toLocaleString()}</div>
                              <div className={`text-sm flex items-center gap-1 justify-end ${
                                index.change >= 0 ? "text-green-500" : "text-red-500"
                              }`}>
                                {index.change >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {index.changePercent >= 0 ? "+" : ""}
                                {index.changePercent.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* NEWS TAB */}
            <TabsContent value="news" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    Market News
                  </CardTitle>
                  <CardDescription>Latest financial news and updates</CardDescription>
                </CardHeader>
              </Card>

              {newsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : news?.articles && news.articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.articles.map((article) => (
                    <MarketNewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No news available. Implement backend endpoint: GET /api/market/news?limit=20
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* SENTIMENT TAB */}
            <TabsContent value="sentiment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Market Sentiment
                  </CardTitle>
                  <CardDescription>Analyze market sentiment and investor confidence</CardDescription>
                </CardHeader>
              </Card>

              {sentimentLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sentiment?.data && sentiment.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sentiment.data.map((item) => (
                    <Card key={item.symbol}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          {item.symbol}
                          <Badge variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"}>
                            {item.trend}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{item.totalMentions.toLocaleString()} mentions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-green-500">Bullish</span>
                            <span className="font-medium">{item.bullishPercent}%</span>
                          </div>
                          <Progress value={item.bullishPercent} className="h-2 bg-muted" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-red-500">Bearish</span>
                            <span className="font-medium">{item.bearishPercent}%</span>
                          </div>
                          <Progress value={item.bearishPercent} className="h-2 bg-muted" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No sentiment data available. Implement backend endpoint: GET /api/market/sentiment?symbols=SPY,QQQ
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* TRENDS TAB */}
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trending Stocks
                  </CardTitle>
                  <CardDescription>Most active and trending stocks</CardDescription>
                </CardHeader>
              </Card>

              {trendingLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : trending?.stocks && trending.stocks.length > 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {trending.stocks.map((stock, index) => (
                        <div key={stock.symbol} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="text-2xl font-bold text-muted-foreground w-8">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">{stock.symbol}</div>
                            <div className="text-sm text-muted-foreground">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${stock.price.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatMarketCap(stock.marketCap)}
                            </div>
                          </div>
                          <div className={`text-right min-w-[80px] ${
                            stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                          }`}>
                            <div className="font-bold flex items-center gap-1 justify-end">
                              {stock.changePercent >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </div>
                            <div className="text-xs">
                              Vol: {formatVolume(stock.volume)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No trending data available. Implement backend endpoint: GET /api/market/trending?limit=10
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
