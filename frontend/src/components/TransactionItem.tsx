import { cn } from "@/lib/utils";

interface TransactionItemProps {
  name: string;
  description: string;
  date: string;
  amount: number;
  price: number;
  icon: string;
  iconBg: string;
  onClick?: () => void;
}

export function TransactionItem({ name, date, amount, icon, iconBg, onClick }: TransactionItemProps) {
  const isPositive = amount > 0;

  return (
    <div 
      className="flex items-center gap-4 py-3 cursor-pointer hover:bg-secondary/50 rounded-lg px-2 -mx-2 transition-colors" 
      onClick={onClick}
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
      <div className="text-right min-w-[100px]">
        <p className={cn(
          "font-semibold",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? "+" : ""}{amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
      </div>
    </div>
  );
}
