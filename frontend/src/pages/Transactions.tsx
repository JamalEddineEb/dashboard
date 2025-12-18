import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TransactionDetailsDialog } from "@/components/TransactionDetailsDialog";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Calendar,
  DollarSign,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTransactions, useAddTransaction } from "@/hooks/useTransactions";
import { useFinancialSummary } from "@/hooks/useDashboard";
import { useCategories } from "@/hooks/useCategories";

const Transactions = () => {
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all",
  );
  const [filterCategory, setFilterCategory] = useState<string>("");

  const { data: transactions = [], isLoading } = useTransactions(
    filterCategory,
    filterType,
  );
  const {
    data: financialSummary = { totalIncome: 0, totalExpenses: 0 },
    isLoading: financialSummaryLoading,
  } = useFinancialSummary();

  const addTransaction = useAddTransaction();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    name: "",
    amount: "",
    totalValue: "",
    price: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.name) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addTransaction.mutateAsync({
        type: formData.type,
        name: formData.name,
        amount: parseFloat(formData.amount),
        price: parseFloat(formData.price),
        categoryId: formData.category,
        description: formData.description,
        date: formData.date,
      });

      console.log("New transaction added");
      toast.success(
        `${formData.type === "income" ? "Income" : "Expense"} added successfully!`,
      );

      // Reset form
      setFormData({
        name: "",
        type: "expense",
        amount: "",
        totalValue: "",
        price: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });

      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to add transaction. Please try again.");
    }
  };

  const totalIncome = financialSummary.totalIncome;

  const totalExpense = financialSummary.totalExpenses;
  const getCategoryInfo = (categoryValue: string) => {
    return (
      categories.find((c) => c.id === categoryValue) ||
      categories[categories.length - 1]
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold">Transaction</h1>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src="https://i.pravatar.cc/150?img=68"
                alt="Jerry Warren"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-sm font-semibold">Jerry Warren</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">All Transactions</h2>
              <p className="text-sm text-muted-foreground">
                Manage your income and expenses
              </p>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>
                    Record your income or expense transaction
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, type: "expense" })
                        }
                        className={cn(
                          "flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all",
                          formData.type === "expense"
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        <TrendingDown className="w-4 h-4" />
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, type: "income" })
                        }
                        className={cn(
                          "flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all",
                          formData.type === "income"
                            ? "border-success bg-success/10 text-success"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        <TrendingUp className="w-4 h-4" />
                        Income
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-9"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-9"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            <span className="flex items-center gap-2">
                              {cat.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-9"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Transaction
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-success/10 border-2 border-success/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-success">
                  Total Income
                </span>
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
              <p className="text-3xl font-bold text-success">
                $
                {totalIncome.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="bg-destructive/10 border-2 border-destructive/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-destructive">
                  Total Expenses
                </span>
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
              </div>
              <p className="text-3xl font-bold text-destructive">
                $
                {totalExpense.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Filter by Type
                </Label>
                <Select
                  value={filterType}
                  onValueChange={(value: any) => setFilterType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income Only</SelectItem>
                    <SelectItem value="expense">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Filter by Category
                </Label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No transactions found
                    </p>
                  </div>
                ) : (
                  transactions.map((transaction) => {
                    const categoryInfo = getCategoryInfo(
                      transaction.categoryId,
                    );
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                            transaction.type === "income"
                              ? "bg-success/10"
                              : "bg-destructive/10",
                          )}
                        ></div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">
                            {transaction.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {categoryInfo.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={cn(
                              "text-lg font-bold",
                              transaction.type === "income"
                                ? "text-success"
                                : "text-destructive",
                            )}
                          >
                            {transaction.type === "income" ? "+" : "-"}$
                            {transaction.totalValue.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedTransaction && (
        <TransactionDetailsDialog
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;
