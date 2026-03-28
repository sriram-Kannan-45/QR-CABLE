package com.waveinit.backend.controller;

import com.waveinit.backend.model.Customer;
import com.waveinit.backend.repository.CustomerRepository;
import com.waveinit.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    private final PaymentService paymentService;
    private final CustomerRepository customerRepository;

    public PaymentController(PaymentService paymentService, CustomerRepository customerRepository) {
        this.paymentService = paymentService;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/methods")
    public ResponseEntity<?> getPaymentMethods(@RequestParam String customerId) {
        try {
            Customer customer = customerRepository.findByCustomerId(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            String transactionId = "TXN" + System.currentTimeMillis();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactionId", transactionId);
            response.put("customerId", customer.getCustomerId());
            response.put("name", customer.getName());
            response.put("pendingAmount", customer.getPendingAmount());
            response.put("methods", new String[]{"UPI", "CARD", "NETBANKING"});

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "ERROR");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiatePayment(@RequestBody Map<String, Object> request) {
        try {
            String transactionId = (String) request.get("transactionId");
            String paymentMethod = (String) request.get("paymentMethod");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactionId", transactionId);
            response.put("paymentMethod", paymentMethod);
            response.put("message", "Payment initiated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String otp = request.get("otp");
            String transactionId = request.get("transactionId");

            Map<String, Object> response = new HashMap<>();
            
            if ("123456".equals(otp)) {
                response.put("success", true);
                response.put("message", "OTP verified successfully");
            } else {
                response.put("success", false);
                response.put("message", "Invalid OTP");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/confirm-upi")
    public ResponseEntity<Map<String, Object>> confirmUpi(@RequestBody Map<String, String> request) {
        try {
            String transactionId = request.get("transactionId");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment confirmed successfully");
            response.put("transactionId", transactionId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/netbanking-result")
    public ResponseEntity<Map<String, Object>> netbankingResult(@RequestBody Map<String, Object> request) {
        try {
            String transactionId = (String) request.get("transactionId");
            String status = (String) request.get("status");

            Map<String, Object> response = new HashMap<>();
            response.put("success", "SUCCESS".equals(status));
            response.put("message", "SUCCESS".equals(status) ? "Payment successful" : "Payment failed");
            response.put("transactionId", transactionId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Payment API is working!");
        return ResponseEntity.ok(response);
    }
}
