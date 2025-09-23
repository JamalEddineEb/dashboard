package com.dashboard.dashboard.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorySummaryDTO {
    private Long categoryId;
    private String categoryName;
    private Double incomeTotal;
    private Double expenseTotal;
    private Double incomePercentage;
    private Double expensePercentage;
    private Double netAmount;
    private Integer transactionCount;
    private List<TransactionDTO> transactions;
}
