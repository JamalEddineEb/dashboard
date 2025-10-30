package com.dashboard.dashboard.repositories;

import com.dashboard.dashboard.entities.Transaction;
import com.dashboard.dashboard.entities.UserEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<Transaction> {
    Optional<UserEntity> findByExternalId(String id);
}
