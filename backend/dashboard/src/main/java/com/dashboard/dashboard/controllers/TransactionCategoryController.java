package com.dashboard.dashboard.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dashboard.dashboard.dtos.TransactionCategoryDTO;
import com.dashboard.dashboard.services.TransactionCategoryService;

@RestController
@RequestMapping("api/transaction_categories")
public class TransactionCategoryController {

    @Autowired
    TransactionCategoryService transactionCategoryService;

    @GetMapping
    public List<TransactionCategoryDTO> getAllTransactionCategories(){
        return transactionCategoryService.getAllCategories();
    }

    @PostMapping
    public TransactionCategoryDTO createCategory(@RequestBody TransactionCategoryDTO transactionCategoryDTO){
        return transactionCategoryService.createCategory(transactionCategoryDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        transactionCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

}
