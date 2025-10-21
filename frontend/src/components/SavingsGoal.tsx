import { cn } from "@/lib/utils";

interface SavingsGoalProps {
  title: string;
  target: number;
  current: number;
  color: "blue" | "yellow";
}

export function SavingsGoal({ title, target, current, color }: SavingsGoalProps) {
  const percentage = Math.round((current / target) * 100);
  
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-sm mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground">
            Target: {target.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <span className={cn(
          "text-xs font-semibold px-2 py-1 rounded",
          color === "blue" ? "bg-primary/10 text-primary" : "bg-yellow-500/10 text-yellow-600"
        )}>
          {percentage}%
        </span>
      </div>
      
      <div className="space-y-1">
        <p className="text-lg font-bold">
          {current.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              color === "blue" ? "bg-primary" : "bg-yellow-500"
            )}
            style={{ width: `${percentage}%` }}
          />
          <div 
            className={cn(
              "absolute inset-y-0 left-0 opacity-20",
              color === "blue" ? "bg-primary" : "bg-yellow-500"
            )}
            style={{ 
              width: '100%',
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
