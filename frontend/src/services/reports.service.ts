import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinancialSummaryDTO } from '../interfaces/financial_summary_dto';
import { CategorySummaryDTO } from '../interfaces/category_summary_dto';
import { MonthlyReportDTO } from '../interfaces/monthly_report_dto';
import { IncomeExpenseComparisonDTO } from '../interfaces/income_expense_comparison_dto';




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
