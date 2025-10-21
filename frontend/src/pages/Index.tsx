import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { TransactionDetailsDialog } from "@/components/TransactionDetailsDialog";
import { Search, Bell, ChevronDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { useMonthlyReport, useFinancialSummary, useCategorySummary, useTopSpending, useTopIncome } from "@/hooks/useDashboard";
import { useTransactions } from "@/hooks/useTransactions";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const Index = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const currentYear = new Date().getFullYear();
  
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyReport(currentYear);
  const { data: financialSummary, isLoading: statsLoading } = useFinancialSummary();
  const { data: categorySummary, isLoading: categoryLoading } = useCategorySummary();
  const { data: topSpending, isLoading: spendingLoading } = useTopSpending(5);
  console.log(monthlyData);
  
  const { data: topIncome, isLoading: incomeLoading } = useTopIncome(5);
  const { data: recentTransactions, isLoading: transactionsLoading } = useTransactions();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold">Overview</h1>
          
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
            <h2 className="text-2xl font-bold">Financial Dashboard</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">📅 {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsLoading ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">Loading stats...</div>
            ) : financialSummary ? (
              <>
                <StatCard 
                  title="Current Balance"
                  amount={`$${financialSummary.currentBalance.toLocaleString()}`}
                  change={financialSummary.savingsRate}
                  compareText={`${financialSummary.savingsRate.toFixed(1)}% savings rate`}
                  showInfo
                />
                <StatCard 
                  title="Total Expenses"
                  amount={`$${financialSummary.totalExpenses.toLocaleString()}`}
                  change={0}
                  compareText={`${financialSummary.expenseTransactions} transactions`}
                  showInfo
                />
                <StatCard 
                  title="Total Income"
                  amount={`$${financialSummary.totalIncome.toLocaleString()}`}
                  change={0}
                  compareText={`${financialSummary.incomeTransactions} transactions`}
                  showInfo
                />
              </>
            ) : null}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Top Spending Categories</h3>
              </div>
              
              {spendingLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : topSpending && topSpending.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topSpending}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="categoryName" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="netAmount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No spending data</div>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Recent Transactions</h3>
              </div>
              
              {transactionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : recentTransactions && recentTransactions.length > 0 ? (
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div 
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedTransaction({
                        id: transaction.id,
                        name: transaction.name,
                        description: transaction.description,
                        date: transaction.date,
                        amount: transaction.amount,
                        price: transaction.price,
                        category: transaction.category,
                        type: transaction.type,
                        icon: transaction.type === 'income' ? '↑' : '↓',
                        iconBg: transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500',
                      })}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <span className="text-lg">
                            {transaction.type === 'income' ? '↑' : '↓'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.name}</p>
                          <p className="text-xs text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.price).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No transactions</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Monthly Income vs Expenses ({currentYear})</h3>
              </div>
              
              <div className="mb-4">
                {!statsLoading && financialSummary && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${financialSummary.currentBalance.toLocaleString()}</span>
                    <span className={`text-sm flex items-center gap-1 ${
                      financialSummary.currentBalance >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {financialSummary.currentBalance >= 0 ? '↑' : '↓'} {financialSummary.savingsRate.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              {monthlyLoading ? (
                <div className="text-center py-20 text-muted-foreground">Loading...</div>
              ) : monthlyData && monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="monthlyExpenses" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Expenses"
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="monthlyIncome" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Income"
                      dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-20 text-muted-foreground">No data available</div>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Expense Distribution by Category</h3>
              </div>

              {categoryLoading ? (
                <div className="text-center py-20 text-muted-foreground">Loading...</div>
              ) : categorySummary && categorySummary.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categorySummary.filter((cat: any) => cat.netAmount < 0).map(cat => ({
                          ...cat,
                          netAmount: Math.abs(cat.netAmount)
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        stroke="none"
                        dataKey="netAmount"
                        nameKey="categoryName"
                        label={({ categoryName, percent }: any) => `${categoryName} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categorySummary.filter((cat: any) => cat.netAmount < 0).map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ 
                          color: 'hsl(var(--foreground))' 
                        }}
                        formatter={(value: any) => `$${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                    {categorySummary.filter((cat: any) => cat.netAmount < 0).slice(0, 4).map((cat: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-xs text-muted-foreground truncate">{cat.categoryName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">No category data</div>
              )}
            </div>
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

export default Index;
