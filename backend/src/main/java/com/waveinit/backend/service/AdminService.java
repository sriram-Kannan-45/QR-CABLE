package com.waveinit.backend.service;

import com.waveinit.backend.model.*;
import com.waveinit.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    private final CustomerRepository customerRepository;
    private final AdminSettingsRepository adminSettingsRepository;
    private final TransactionRepository transactionRepository;

    public AdminService(CustomerRepository customerRepository, 
                       AdminSettingsRepository adminSettingsRepository,
                       TransactionRepository transactionRepository) {
        this.customerRepository = customerRepository;
        this.adminSettingsRepository = adminSettingsRepository;
        this.transactionRepository = transactionRepository;
    }

    public LoginResponse adminLogin(String userId, String password) {
        AdminSettings settings = adminSettingsRepository.findById(1).orElse(new AdminSettings());
        
        if (settings.getAdminId().equals(userId) && settings.getAdminPassword().equals(password)) {
            String token = generateToken("admin", userId);
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setUserId(0);
            response.setLoginType("admin");
            response.setName(settings.getBusinessName());
            return response;
        }
        
        return new LoginResponse("Invalid admin credentials");
    }

    public LoginResponse customerLogin(String customerId, String password) {
        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElse(null);
        
        if (customer == null) {
            return new LoginResponse("Customer not found");
        }
        
        // Password is customer ID itself for simplicity
        if (!customer.getCustomerId().equals(password)) {
            return new LoginResponse("Invalid password");
        }
        
        String token = generateToken("customer", customerId);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(customer.getId());
        response.setLoginType("customer");
        response.setCustomerId(customer.getCustomerId());
        response.setName(customer.getName());
        response.setMobile(customer.getMobile());
        response.setAddress(customer.getAddress());
        response.setPlanType(customer.getPlanType());
        response.setPlanAmount(customer.getPlanAmount().doubleValue());
        response.setPendingAmount(customer.getPendingAmount().doubleValue());
        return response;
    }

    public Customer addCustomer(CustomerRequest request) {
        if (customerRepository.existsByCustomerId(request.getCustomerId())) {
            throw new RuntimeException("Customer ID already exists");
        }
        
        Customer customer = new Customer();
        customer.setCustomerId(request.getCustomerId());
        customer.setName(request.getName());
        customer.setMobile(request.getMobile());
        customer.setAddress(request.getAddress());
        customer.setPlanType(request.getPlanType());
        customer.setPlanAmount(request.getPlanAmount());
        customer.setPendingAmount(request.getPlanAmount());
        customer.setStatus("ACTIVE");
        
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomer(String customerId) {
        return customerRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer updateCustomer(String customerId, CustomerRequest request) {
        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setName(request.getName());
        customer.setMobile(request.getMobile());
        customer.setAddress(request.getAddress());
        customer.setPlanType(request.getPlanType());
        customer.setPlanAmount(request.getPlanAmount());
        
        return customerRepository.save(customer);
    }

    public void deleteCustomer(String customerId) {
        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.delete(customer);
    }

    public void updatePendingAmount(String customerId, Double amount) {
        Customer customer = customerRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        double newPending = customer.getPendingAmount().doubleValue() - amount;
        customer.setPendingAmount(java.math.BigDecimal.valueOf(newPending < 0 ? 0 : newPending));
        customerRepository.save(customer);
    }

    public AdminSettings getAdminSettings() {
        return adminSettingsRepository.findById(1).orElse(new AdminSettings());
    }

    public AdminSettings updateAdminSettings(AdminSettings settings) {
        settings.setId(1);
        return adminSettingsRepository.save(settings);
    }

    public String getUpiId() {
        AdminSettings settings = adminSettingsRepository.findById(1).orElse(new AdminSettings());
        return settings.getUpiId();
    }

    public Long getTotalCustomers() {
        return customerRepository.count();
    }

    public Long getActiveCustomers() {
        return customerRepository.findByStatus("ACTIVE").stream().count();
    }

    public Double getTotalPendingAmount() {
        return customerRepository.findAll().stream()
                .mapToDouble(c -> c.getPendingAmount().doubleValue())
                .sum();
    }

    private String generateToken(String type, String id) {
        String payload = type + ":" + id + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(payload.getBytes());
    }
}
