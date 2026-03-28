package com.waveinit.backend.repository;

import com.waveinit.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByCustomerId(String customerId);
    boolean existsByCustomerId(String customerId);
    List<Customer> findByStatus(String status);
}
