package com.dashboard.dashboard.services;

import com.dashboard.dashboard.dtos.TransactionDTO;
import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.entities.TransactionCategory;
import com.dashboard.dashboard.mappers.TransactionMapper;
import com.dashboard.dashboard.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private TransactionCategoryService transactionCategoryService;
    @Autowired
    private TransactionMapper transactionMapper;

    @Override
    public List<TransactionDTO> getAllTransactions() {
        List<TransactionDTO> transactions = transactionRepository.findAll().stream()
                                        .map(transactionMapper::toDTO)
                                        .collect(Collectors.toList());
        Collections.reverse(transactions);
        return transactions;
    }

    @Override
    public TransactionDTO getTransactionById(Long id) {
        return transactionRepository.findById(id)
            .map(transactionMapper::toDTO)
            .orElse(null);
    }

    @Override
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Transaction saved = transactionRepository.save(transactionMapper.toEntity(transactionDTO));
        return transactionMapper.toDTO(saved);
    }

    @Override
    public TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        Optional<Transaction> existing = transactionRepository.findById(id);
        if (existing.isPresent()) {
            Transaction t = existing.get();
            t.setName(transactionDTO.getName());
            t.setAmount(transactionDTO.getAmount());
            t.setType(transactionDTO.getType());
            t.setDate(transactionDTO.getDate());
            TransactionCategory category = transactionCategoryService.getCategoryEntityById(transactionDTO.getCategoryId());
            t.setCategory(category);
            t.setDescription(transactionDTO.getDescription());
            Transaction updated = transactionRepository.save(t);
            return transactionMapper.toDTO(updated);
        }
        return null;
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
