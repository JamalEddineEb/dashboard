package com.dashboard.dashboard.services;

import java.util.List;

import com.dashboard.dashboard.dtos.TransactionCategoryDTO;
import com.dashboard.dashboard.entities.TransactionCategory;

public interface TransactionCategoryService {
    List<TransactionCategoryDTO> getAllCategories();
    TransactionCategoryDTO getCategoryById(Long id);
    TransactionCategoryDTO createCategory(TransactionCategoryDTO CategoryDTO);
    TransactionCategoryDTO updateCategory(Long id, TransactionCategoryDTO CategoryDTO);
    TransactionCategory getCategoryEntityById(Long id);
    void deleteCategory(Long id);
    
}