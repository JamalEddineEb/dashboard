package com.dashboard.dashboard.specifications;

import org.springframework.data.jpa.domain.Specification;

import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.enums.TransactionType;

public class TransactionSpecifications {
    public static Specification<Transaction> byCategory(Long categoryId) {
        return (root, query, cb) ->
                categoryId == null ? null :
                cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Transaction> byType(TransactionType type) {
        return (root, query, cb) ->
                type == null ? null :
                cb.equal(root.get("type"), type);
    }
}
