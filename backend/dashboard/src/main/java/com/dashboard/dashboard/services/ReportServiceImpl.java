package com.dashboard.dashboard.services;

import com.dashboard.dashboard.dtos.*;
import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.enums.TransactionType;
import com.dashboard.dashboard.mappers.TransactionMapper;
import com.dashboard.dashboard.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionMapper transactionMapper;

    @Override
    public FinancialSummaryDTO getFinancialSummary() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        Double totalIncome = allTransactions.stream()
            .filter(t -> TransactionType.INCOME.equals(t.getType()))
            .mapToDouble(t -> t.getAmount() * t.getPrice())
            .sum();
            
        Double totalExpenses = allTransactions.stream()
            .filter(t -> TransactionType.EXPENSE.equals(t.getType()))
            .mapToDouble(t -> t.getAmount() * t.getPrice())
            .sum();
            
        Double currentBalance = totalIncome - totalExpenses;
        Double savingsRate = totalIncome > 0 ? (currentBalance / totalIncome) * 100 : 0.0;
        
        Integer incomeTransactions = (int) allTransactions.stream()
            .filter(t -> TransactionType.INCOME.equals(t.getType()))
            .count();
            
        Integer expenseTransactions = (int) allTransactions.stream()
            .filter(t -> TransactionType.EXPENSE.equals(t.getType()))
            .count();

        return new FinancialSummaryDTO(
            totalIncome,
            totalExpenses,
            currentBalance,
            savingsRate,
            allTransactions.size(),
            incomeTransactions,
            expenseTransactions
        );
    }

    @Override
    public List<CategorySummaryDTO> getCategorySummary() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        Map<String, List<Transaction>> groupedByCategory = allTransactions.stream()
            .collect(Collectors.groupingBy(t -> t.getCategory().getName()));

        Double allCategoriesSpendingTotal = allTransactions.stream()
                        .filter(t -> TransactionType.EXPENSE.equals(t.getType()))
                        .mapToDouble(t->t.getTotalValue())
                        .sum();

        Double allCategoriesIncomeTotal = allTransactions.stream()
                        .filter(t -> TransactionType.INCOME.equals(t.getType()))
                        .mapToDouble(t->t.getTotalValue())
                        .sum();
            
        return groupedByCategory.entrySet().stream()
            .map(entry -> {
                String categoryName = entry.getKey();
                List<Transaction> transactions = entry.getValue();
                
                Double incomeTotal = transactions.stream()
                    .filter(t -> TransactionType.INCOME.equals(t.getType()))
                    .mapToDouble(t -> t.getTotalValue())
                    .sum();
                    
                Double expenseTotal = transactions.stream()
                    .filter(t -> TransactionType.EXPENSE.equals(t.getType()))
                    .mapToDouble(t -> t.getTotalValue())
                    .sum();

                Double expensePercentage =  expenseTotal / allCategoriesSpendingTotal;

                Double incomePercentage =  incomeTotal / allCategoriesIncomeTotal;
                    
                Double netAmount = incomeTotal - expenseTotal;
                
                List<TransactionDTO> transactionDTOs = transactions.stream()
                    .map(transactionMapper::toDTO)
                    .collect(Collectors.toList());
                
                return new CategorySummaryDTO(
                    transactions.get(0).getCategory().getId(),
                    categoryName,
                    incomeTotal,
                    expenseTotal,
                    incomePercentage,
                    expensePercentage,
                    netAmount,
                    transactions.size(),
                    transactionDTOs
                );
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<MonthlyReportDTO> getMonthlyReport(int year) {
        List<Transaction> yearTransactions = transactionRepository.findAll().stream()
            .filter(t -> t.getDate().getYear() == year)
            .collect(Collectors.toList());
            
        Map<Integer, List<Transaction>> groupedByMonth = yearTransactions.stream()
            .collect(Collectors.groupingBy(t -> t.getDate().getMonthValue()));
            
        Double runningBalance = 0.0;
        List<MonthlyReportDTO> monthlyReports = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            List<Transaction> monthTransactions = groupedByMonth.getOrDefault(month, new ArrayList<>());
            
            Double monthlyIncome = monthTransactions.stream()
                .filter(t -> TransactionType.INCOME.equals(t.getType()))
                .mapToDouble(t -> t.getAmount() * t.getPrice())
                .sum();
                
            Double monthlyExpenses = monthTransactions.stream()
                .filter(t -> TransactionType.EXPENSE.equals(t.getType()))
                .mapToDouble(t -> t.getAmount() * t.getPrice())
                .sum();
                
            Double monthlyBalance = monthlyIncome - monthlyExpenses;
            runningBalance += monthlyBalance;
            
            String monthName = LocalDate.of(year, month, 1)
                .getMonth()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                
            monthlyReports.add(new MonthlyReportDTO(
                monthName,
                year,
                monthlyIncome,
                monthlyExpenses,
                monthlyBalance,
                runningBalance,
                monthTransactions.size()
            ));
        }
        
        return monthlyReports;
    }

    @Override
    public IncomeExpenseComparisonDTO getIncomeExpenseComparison() {
        FinancialSummaryDTO summary = getFinancialSummary();
        List<MonthlyReportDTO> monthlyTrends = getMonthlyReport(LocalDate.now().getYear());
        List<CategorySummaryDTO> topIncome = getTopIncomeCategories(5);
        List<CategorySummaryDTO> topExpense = getTopSpendingCategories(5);
        
        return new IncomeExpenseComparisonDTO(
            summary.getTotalIncome(),
            summary.getTotalExpenses(),
            summary.getCurrentBalance(),
            summary.getSavingsRate(),
            monthlyTrends,
            topIncome,
            topExpense
        );
    }

    @Override
    public List<CategorySummaryDTO> getTopSpendingCategories(int limit) {
        return getCategorySummary().stream()
            .sorted((a, b) -> Double.compare(b.getExpenseTotal(), a.getExpenseTotal()))
            .limit(limit)
            .collect(Collectors.toList());
    }

    @Override
    public List<CategorySummaryDTO> getTopIncomeCategories(int limit) {
        return getCategorySummary().stream()
            .sorted((a, b) -> Double.compare(b.getIncomeTotal(), a.getIncomeTotal()))
            .limit(limit)
            .collect(Collectors.toList());
    }
}
