package com.dashboard.dashboard.mappers;

import org.springframework.stereotype.Component;

import com.dashboard.dashboard.dtos.TransactionCategoryDTO;
import com.dashboard.dashboard.entities.TransactionCategory;

@Component
public class TransactionCategoryMapper {
    
    public TransactionCategory toEntity(TransactionCategoryDTO dto) {
        return new TransactionCategory(
            dto.getId(),
            dto.getName(),
            dto.getType()
        );
    }

    public TransactionCategoryDTO toDTO(TransactionCategory entity) {
        return new TransactionCategoryDTO(
            entity.getId(),
            entity.getName(),
            entity.getType()
        );
    }
}
