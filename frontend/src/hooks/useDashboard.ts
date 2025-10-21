import { useQuery } from "@tanstack/react-query";
import { useTransactions } from "./useTransactions";

export interface CashflowData {
  month: string;
  income: number;
  expense: number;
}

export interface QuickTransferUser {
  name: string;
  role?: string;
  avatar?: string;
  img: string;
  active?: boolean;
}

export interface RecentTransaction {
  name: string;
  date: string;
  amount: number;
  price: number;
  description: string;
  icon: string;
  iconBg: string;
}

export interface SavingsGoal {
  title: string;
  target: number;
  current: number;
  bgColor: string;
}

export interface DashboardStats {
  balance: number;
  monthlySpent: number;
  monthlyIncome: number;
}

export interface FinancialSummary {
  totalIncome: number,
  totalExpenses: number,
  currentBalance: number,
  savingsRate: number,
  totalTransactions: number,
  incomeTransactions: number,
  expenseTransactions: number
}

const API_BASE_URL = "http://localhost:8080/api/reports";

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ["financial-summary", useTransactions()],
    queryFn: async (): Promise<FinancialSummary> => {
      const response = await fetch(`${API_BASE_URL}/financial-summary`);
      if (!response.ok) throw new Error("Failed to fetch cashflow data");
      return response.json();
    },
  });
};

export const useMonthlyReport = (year: number = new Date().getFullYear()) => {
  return useQuery({
    queryKey: ["monthly-report", year],
    queryFn: async (): Promise<CashflowData[]> => {
      const response = await fetch(`${API_BASE_URL}/monthly-report?year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch monthly report");
      return response.json();
    },
  });
};

export const useCategorySummary = () => {
  return useQuery({
    queryKey: ["category-summary"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/category-summary`);
      if (!response.ok) throw new Error("Failed to fetch category summary");
      return response.json();
    },
  });
};

export const useTopSpending = (limit: number = 5) => {
  return useQuery({
    queryKey: ["top-spending", limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/top-spending?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch top spending");
      return response.json();
    },
  });
};

export const useTopIncome = (limit: number = 5) => {
  return useQuery({
    queryKey: ["top-income", limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/top-income?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch top income");
      return response.json();
    },
  });
};

export const useIncomeExpenseComparison = () => {
  return useQuery({
    queryKey: ["income-expense-comparison"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/income-expense-comparison`);
      if (!response.ok) throw new Error("Failed to fetch income expense comparison");
      return response.json();
    },
  });
};

export const useCategorySummaryById = (categoryId: string) => {
  return useQuery({
    queryKey: ["category-summary", categoryId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/summary-by-category/${categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch category summary");
      return response.json();
    },
    enabled: !!categoryId,
  });
};
