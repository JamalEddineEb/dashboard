package com.dashboard.dashboard.services;

import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id).orElse(null);
    }

    @Override
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction updateTransaction(Long id, Transaction transaction) {
        Optional<Transaction> existing = transactionRepository.findById(id);
        if (existing.isPresent()) {
            Transaction t = existing.get();
            t.setName(transaction.getName());
            t.setAmount(transaction.getAmount());
            t.setType(transaction.getType());
            t.setDate(transaction.getDate());
            t.setCategory(transaction.getCategory());
            t.setDescription(transaction.getDescription());
            return transactionRepository.save(t);
        }
        return null;
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
