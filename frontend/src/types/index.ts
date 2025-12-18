export interface Transaction {
  id: string;
  name: string;
  type: "income" | "expense";
  amount: number;
  price: number;
  totalValue?: number;
  category?: string;
  categoryId?: string;
  description: string;
  date: string;
}

export interface CategorySummary {
  categoryName: string;
  netAmount: number;
}

export interface Category {
  id: string;
  name: string;
}
