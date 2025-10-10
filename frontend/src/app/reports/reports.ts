import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { FinancialSummaryDTO } from '../../interfaces/financial_summary_dto';
import { CategorySummaryDTO } from '../../interfaces/category_summary_dto';
import { MonthlyReportDTO } from '../../interfaces/monthly_report_dto';
import { IncomeExpenseComparisonDTO } from '../../interfaces/income_expense_comparison_dto';

interface EnhancedCategoryStats extends CategorySummaryDTO {
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  // Financial Summary
  financialSummary: FinancialSummaryDTO | null = null;
  
  // Category Analysis
  allCategories: EnhancedCategoryStats[] = [];
  topSpendingCategories: EnhancedCategoryStats[] = [];
  topIncomeCategories: EnhancedCategoryStats[] = [];
  years: string[] = [];
  
  // Monthly Analysis
  monthlyReports: MonthlyReportDTO[] = [];
  selectedYear = new Date().getFullYear();
  
  // Income vs Expense Comparison
  incomeExpenseComparison: IncomeExpenseComparisonDTO | null = null;
  
  // Loading states
  isLoading = true;
  hasError = false;
  errorMessage = '';

  private colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8E8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadAllReports();
    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: 5}, (_, i) => (currentYear - i).toString());
   
    console.log(this.monthlyReports);
    // console.log(this.allCategories);
    
  }

  loadAllReports() {
    this.isLoading = true;
    this.hasError = false;

    forkJoin({
      financial: this.reportsService.getFinancialSummary(),
      categories: this.reportsService.getCategorySummary(),
      topSpending: this.reportsService.getTopSpendingCategories(5),
      topIncome: this.reportsService.getTopIncomeCategories(5),
      monthly: this.reportsService.getMonthlyReport(this.selectedYear),
      comparison: this.reportsService.getIncomeExpenseComparison()
    }).subscribe({
      next: (data) => {
        this.financialSummary = data.financial;
        this.allCategories = this.enhanceWithColors(data.categories);
        this.topSpendingCategories = this.enhanceWithColors(data.topSpending);
        this.topIncomeCategories = this.enhanceWithColors(data.topIncome);
        this.monthlyReports = data.monthly;
        this.incomeExpenseComparison = data.comparison;
        this.isLoading = false;
        
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.hasError = true;
        this.errorMessage = 'Failed to load reports. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    
    this.reportsService.getMonthlyReport(year).subscribe({
      next: (data) => this.monthlyReports = data,
      error: (error) => console.error('Error loading monthly report:', error)
    });
  }

  private enhanceWithColors(categories: CategorySummaryDTO[]): EnhancedCategoryStats[] {
    return categories.map((category, index) => ({
      ...category,
      color: this.colors[index % this.colors.length]
    }));
  }

  // Utility methods for templates
  getMonthlyChartMaxValue(): number {
    if (!this.monthlyReports.length) return 0;
    return Math.max(...this.monthlyReports.map(m => 
      Math.max(Math.abs(m.monthlyIncome), Math.abs(m.monthlyExpenses))
    ));
  }

  getIncomeGrowthTrend(): number {
    if (this.monthlyReports.length < 2) return 0;
    const current = this.monthlyReports[this.monthlyReports.length - 1]?.monthlyIncome || 0;
    const previous = this.monthlyReports[this.monthlyReports.length - 2]?.monthlyIncome || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  getExpenseGrowthTrend(): number {
    if (this.monthlyReports.length < 2) return 0;
    const current = this.monthlyReports[this.monthlyReports.length - 1]?.monthlyExpenses || 0;
    const previous = this.monthlyReports[this.monthlyReports.length - 2]?.monthlyExpenses || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
}
