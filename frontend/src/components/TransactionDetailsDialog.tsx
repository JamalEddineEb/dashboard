import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, DollarSign, Tag, FileText, Trash2 } from "lucide-react";
import { useDeleteTransaction } from "@/hooks/useTransactions";
import { toast } from "@/hooks/use-toast";

interface TransactionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    name: string;
    description: string;
    date: string;
    amount: number;
    price: number;
    category?: string;
    type?: "income" | "expense";
    icon?: string;
    iconBg?: string;
  };
}

export function TransactionDetailsDialog({ isOpen, onClose, transaction }: TransactionDetailsDialogProps) {
  const isPositive = transaction.type === "income" || transaction.amount > 0;
  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(transaction.id);
      toast({
        title: "Transaction deleted",
        description: "The transaction has been successfully deleted.",
      });
      onClose();
    } catch (error) {
      console.log(error);
      
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Icon and Amount */}
          <div className="flex flex-col items-center gap-3 pb-6 border-b border-border">
            {transaction.icon && transaction.iconBg && (
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl", transaction.iconBg)}>
                {transaction.icon}
              </div>
            )}
            <div className="text-center">
              <p className={cn(
                "text-3xl font-bold",
                isPositive ? "text-success" : "text-destructive"
              )}>
                {isPositive ? "+" : ""}{transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isPositive ? "Income" : "Expense"}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{transaction.name}</p>
              </div>
            </div>

            {transaction.description && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="font-medium">{transaction.description}</p>
                </div>
              </div>
            )}

            {transaction.category && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="font-medium">{transaction.category}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-medium">{new Date(transaction.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</p>
              </div>
            </div>

            {transaction.price && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Price per unit</p>
                  <p className="font-medium">${transaction.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={deleteTransaction.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteTransaction.isPending ? "Deleting..." : "Delete Transaction"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
