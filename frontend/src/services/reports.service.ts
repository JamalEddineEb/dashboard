import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTOs matching backend
export interface FinancialSummaryDTO {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  totalTransactions: number;
  averageTransactionValue: number;
}

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

export interface MonthlyReportDTO {
  year: number;
  month: number;
  monthName: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}

export interface IncomeExpenseComparisonDTO {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
  incomePercentage: number;
  expensePercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  getFinancialSummary(): Observable<FinancialSummaryDTO> {
    return this.http.get<FinancialSummaryDTO>(`${this.apiUrl}/financial-summary`);
  }

  getCategorySummary(): Observable<CategorySummaryDTO[]> {
    return this.http.get<CategorySummaryDTO[]>(`${this.apiUrl}/category-summary`);
  }

  getMonthlyReport(year: number = 2024): Observable<MonthlyReportDTO[]> {
    return this.http.get<MonthlyReportDTO[]>(`${this.apiUrl}/monthly-report?year=${year}`);
  }

  getIncomeExpenseComparison(): Observable<IncomeExpenseComparisonDTO> {
    return this.http.get<IncomeExpenseComparisonDTO>(`${this.apiUrl}/income-expense-comparison`);
  }

  getTopSpendingCategories(limit: number = 5): Observable<CategorySummaryDTO[]> {
    return this.http.get<CategorySummaryDTO[]>(`${this.apiUrl}/top-spending?limit=${limit}`);
  }

  getTopIncomeCategories(limit: number = 5): Observable<CategorySummaryDTO[]> {
    return this.http.get<CategorySummaryDTO[]>(`${this.apiUrl}/top-income?limit=${limit}`);
  }

  getCategorySummaryById(categoryId: number): Observable<CategorySummaryDTO> {
    return this.http.get<CategorySummaryDTO>(`${this.apiUrl}/summary-by-category/${categoryId}`);
  }
}
