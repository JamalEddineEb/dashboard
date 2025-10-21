import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  amount: string;
  change?: number;
  compareText?: string;
  date?: string;
  showInfo?: boolean;
}

export function StatCard({ title, amount, change, compareText, date, showInfo }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-muted-foreground font-medium">{title}</h3>
          {showInfo && <Info className="w-4 h-4 text-muted-foreground" />}
        </div>
        {date && (
          <button className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
            📅 {date} ▾
          </button>
        )}
      </div>
      
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-3xl font-bold">{amount}</span>
        {change !== undefined && (
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            isPositive && "text-success",
            isNegative && "text-destructive"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      
      {compareText && (
        <p className="text-xs text-muted-foreground">{compareText}</p>
      )}
    </div>
  );
}
