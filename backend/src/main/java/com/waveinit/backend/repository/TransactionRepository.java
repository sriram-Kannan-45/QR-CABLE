package com.waveinit.backend.repository;

import com.waveinit.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(Integer senderId, Integer receiverId);
    Optional<Transaction> findByTransactionId(String transactionId);
}
