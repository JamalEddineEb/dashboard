package com.dashboard.dashboard.services;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dashboard.dashboard.dtos.TransactionCategoryDTO;
import com.dashboard.dashboard.entities.TransactionCategory;
import com.dashboard.dashboard.mappers.TransactionCategoryMapper;
import com.dashboard.dashboard.repositories.TransactionCategoryRepository;

@Service
public class TransactionCategoryServiceImpl implements TransactionCategoryService {
    @Autowired
    private TransactionCategoryRepository transactionCategoryRepository;

    @Autowired
    private TransactionCategoryMapper transactionCategoryMapper;


    @Override
    public List<TransactionCategoryDTO> getAllCategories() {
        return transactionCategoryRepository.findAll()
        .stream()
        .map(transactionCategoryMapper::toDTO)
        .collect(Collectors.toList());
    }
    @Override
    public TransactionCategoryDTO getCategoryById(Long id) {
        return transactionCategoryRepository.findById(id)
                .map(transactionCategoryMapper::toDTO)
                .orElse(null);
    }
    @Override
    public TransactionCategoryDTO createCategory(TransactionCategoryDTO categoryDTO) {
        TransactionCategory saved = transactionCategoryRepository.save(transactionCategoryMapper.toEntity(categoryDTO));
        return transactionCategoryMapper.toDTO(saved);
    }
    @Override
    public TransactionCategoryDTO updateCategory(Long id, TransactionCategoryDTO categoryDTO) {
        Optional<TransactionCategory> existing = transactionCategoryRepository.findById(id);
        if (existing.isPresent()) {
            TransactionCategory t = existing.get();
            t.setName(categoryDTO.getName());
        }
        return null;
    }
    @Override
    public TransactionCategory getCategoryEntityById(Long id) {
        return transactionCategoryRepository.findById(id).orElse(null);
    }
    @Override
    public void deleteCategory(Long id) {
        transactionCategoryRepository.deleteById(id);
    }

   

}
