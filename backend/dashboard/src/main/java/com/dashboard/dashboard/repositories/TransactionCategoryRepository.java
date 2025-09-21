package com.dashboard.dashboard.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dashboard.dashboard.entities.TransactionCategory;

@Repository
public interface TransactionCategoryRepository extends JpaRepository<TransactionCategory, Long> {

} 
