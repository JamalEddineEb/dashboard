package com.dashboard.dashboard.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyReportDTO {
    private String month;
    private Integer year;
    private Double monthlyIncome;
    private Double monthlyExpenses;
    private Double monthlyBalance;
    private Double runningBalance;
    private Integer transactionCount;
}
