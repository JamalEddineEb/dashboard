package com.dashboard.dashboard.services;

import com.dashboard.dashboard.dtos.*;
import java.util.List;

public interface ReportService {
    FinancialSummaryDTO getFinancialSummary();
    List<CategorySummaryDTO> getCategorySummary();
    List<MonthlyReportDTO> getMonthlyReport(int year);
    IncomeExpenseComparisonDTO getIncomeExpenseComparison();
    List<CategorySummaryDTO> getTopSpendingCategories(int limit);
    List<CategorySummaryDTO> getTopIncomeCategories(int limit);
}
