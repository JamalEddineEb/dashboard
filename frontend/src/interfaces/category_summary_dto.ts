export interface CategorySummaryDTO {
  categoryId: number;
  categoryName: string;
  netAmount: number;
  incomeTotal: number;
  expenseTotal: number;
  transactionCount: number;
  averageAmount: number;
  incomePercentage: number;
  expensePercentage: number;
  type: 'income' | 'expense';
}
