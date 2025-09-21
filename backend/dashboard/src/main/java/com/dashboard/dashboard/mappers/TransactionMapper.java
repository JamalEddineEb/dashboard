package com.dashboard.dashboard.mappers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.dashboard.dashboard.dtos.TransactionDTO;
import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.entities.TransactionCategory;
import com.dashboard.dashboard.services.TransactionCategoryService;

@Component
public class TransactionMapper {
    
    @Autowired
    private TransactionCategoryService categoryService;
    
    public Transaction toEntity(TransactionDTO dto) {
        TransactionCategory category = categoryService.getCategoryEntityById(dto.getCategoryId());
        
        return new Transaction(
            dto.getId(),
            dto.getName(),
            dto.getAmount(),
            dto.getPrice(),
            dto.getType(),
            dto.getDate(),
            category,
            dto.getDescription()
        );
    }
    
    public TransactionDTO toDTO(Transaction entity) {
        return new TransactionDTO(
            entity.getId(),
            entity.getName(),
            entity.getAmount(),
            entity.getPrice(),
            entity.getTotalValue(),
            entity.getType(),
            entity.getDate(),
            entity.getCategory().getId(),
            entity.getDescription()
        );
    }
}