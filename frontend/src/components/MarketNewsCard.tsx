import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { NewsArticle } from "@/hooks/useMarketInsights";
import { formatDistanceToNow } from "date-fns";

interface MarketNewsCardProps {
  article: NewsArticle;
}

export function MarketNewsCard({ article }: MarketNewsCardProps) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "negative":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base leading-tight mb-2">
              {article.headline}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">{article.source}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
            </div>
          </div>
          {article.sentiment && (
            <Badge variant="outline" className={getSentimentColor(article.sentiment)}>
              {article.sentiment}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-3 line-clamp-2">
          {article.summary}
        </CardDescription>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Read more
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
