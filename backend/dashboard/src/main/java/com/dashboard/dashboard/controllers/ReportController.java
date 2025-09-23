package com.dashboard.dashboard.controllers;

import com.dashboard.dashboard.dtos.*;
import com.dashboard.dashboard.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/financial-summary")
    public ResponseEntity<FinancialSummaryDTO> getFinancialSummary() {
        FinancialSummaryDTO summary = reportService.getFinancialSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummaryDTO>> getCategorySummary() {
        List<CategorySummaryDTO> categorySummary = reportService.getCategorySummary();
        return ResponseEntity.ok(categorySummary);
    }

    @GetMapping("/monthly-report")
    public ResponseEntity<List<MonthlyReportDTO>> getMonthlyReport(@RequestParam(defaultValue = "2024") int year) {
        List<MonthlyReportDTO> monthlyReport = reportService.getMonthlyReport(year);
        return ResponseEntity.ok(monthlyReport);
    }

    @GetMapping("/income-expense-comparison")
    public ResponseEntity<IncomeExpenseComparisonDTO> getIncomeExpenseComparison() {
        IncomeExpenseComparisonDTO comparison = reportService.getIncomeExpenseComparison();
        return ResponseEntity.ok(comparison);
    }

    @GetMapping("/top-spending")
    public ResponseEntity<List<CategorySummaryDTO>> getTopSpendingCategories(
            @RequestParam(defaultValue = "5") int limit) {
        List<CategorySummaryDTO> topSpending = reportService.getTopSpendingCategories(limit);
        return ResponseEntity.ok(topSpending);
    }

    @GetMapping("/top-income")
    public ResponseEntity<List<CategorySummaryDTO>> getTopIncomeCategories(
            @RequestParam(defaultValue = "5") int limit) {
        List<CategorySummaryDTO> topIncome = reportService.getTopIncomeCategories(limit);
        return ResponseEntity.ok(topIncome);
    }

    @GetMapping("/summary-by-category/{categoryId}")
    public ResponseEntity<CategorySummaryDTO> getCategorySummaryById(@PathVariable Long categoryId) {
        List<CategorySummaryDTO> allCategories = reportService.getCategorySummary();
        CategorySummaryDTO category = allCategories.stream()
            .filter(cat -> cat.getCategoryId().equals(categoryId))
            .findFirst()
            .orElse(null);
        
        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
