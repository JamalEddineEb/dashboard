package com.dashboard.dashboard.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncomeExpenseComparisonDTO {
    private Double totalIncome;
    private Double totalExpenses;
    private Double difference;
    private Double savingsPercentage;
    private List<MonthlyReportDTO> monthlyTrends;
    private List<CategorySummaryDTO> topIncomeCategories;
    private List<CategorySummaryDTO> topExpenseCategories;
}
