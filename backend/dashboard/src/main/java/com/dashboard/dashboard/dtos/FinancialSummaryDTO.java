package com.dashboard.dashboard.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialSummaryDTO {
    private Double totalIncome;
    private Double totalExpenses;
    private Double currentBalance;
    private Double savingsRate;
    private Integer totalTransactions;
    private Integer incomeTransactions;
    private Integer expenseTransactions;
}
