package com.dashboard.dashboard.services;

import com.dashboard.dashboard.dtos.TransactionDTO;
import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.entities.TransactionCategory;
import com.dashboard.dashboard.enums.TransactionType;
import com.dashboard.dashboard.mappers.TransactionMapper;
import com.dashboard.dashboard.repositories.TransactionRepository;
import com.dashboard.dashboard.specifications.TransactionSpecifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    public List<TransactionDTO> getTransactions(Long categoryId, String type) {
        Specification<Transaction> spec = Specification.unrestricted();
        if (categoryId != null) {
            spec = spec.and(TransactionSpecifications.byCategory(categoryId));
        }
        if (type != null) {
            spec = spec.and(TransactionSpecifications.byType(TransactionType.valueOf(type.toUpperCase())));
        }

        List<TransactionDTO> transactions = transactionRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "id"))
                                        .stream()
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

    @Override
    public List<TransactionDTO> getTransactionsByCategory(Long transactionCategoryId) {
        TransactionCategory category = transactionCategoryService.getCategoryEntityById(transactionCategoryId);
        List<TransactionDTO> transactions = transactionRepository.findByCategory(category).stream()
                                        .map(transactionMapper::toDTO)
                                        .collect(Collectors.toList());
        Collections.reverse(transactions);
        return transactions;
    }
}
