package com.dashboard.dashboard.repositories;

import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.entities.TransactionCategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findByCategory(TransactionCategory categoryId);
}
