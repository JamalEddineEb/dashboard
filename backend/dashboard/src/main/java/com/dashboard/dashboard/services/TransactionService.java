package com.dashboard.dashboard.services;

import com.dashboard.dashboard.dtos.TransactionDTO;
import com.dashboard.dashboard.entities.TransactionCategory;

import java.util.List;

public interface TransactionService {
    List<TransactionDTO> getTransactions(Long categoryId, String type);
    List<TransactionDTO> getTransactionsByCategory(Long transactionCategoryId);
    TransactionDTO getTransactionById(Long id);
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
    TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO);
    void deleteTransaction(Long id);
}
