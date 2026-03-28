package com.waveinit.backend.controller;

import com.waveinit.backend.model.*;
import com.waveinit.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String password = request.get("password");
            String loginType = request.get("loginType");

            LoginResponse response;
            
            if ("admin".equals(loginType)) {
                response = adminService.adminLogin(userId, password);
            } else {
                response = adminService.customerLogin(userId, password);
            }
            
            if (response.getToken() != null) {
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", "Login failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/admin/customers")
    public ResponseEntity<Customer> addCustomer(@RequestBody CustomerRequest request) {
        try {
            Customer customer = adminService.addCustomer(request);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @GetMapping("/admin/customers/{customerId}")
    public ResponseEntity<Customer> getCustomer(@PathVariable String customerId) {
        try {
            return ResponseEntity.ok(adminService.getCustomer(customerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/admin/customers/{customerId}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable String customerId, @RequestBody CustomerRequest request) {
        try {
            return ResponseEntity.ok(adminService.updateCustomer(customerId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/admin/customers/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String customerId) {
        try {
            adminService.deleteCustomer(customerId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(Map.of(
            "totalCustomers", adminService.getTotalCustomers(),
            "activeCustomers", adminService.getActiveCustomers(),
            "totalPending", adminService.getTotalPendingAmount()
        ));
    }

    @GetMapping("/admin/settings")
    public ResponseEntity<AdminSettings> getAdminSettings() {
        return ResponseEntity.ok(adminService.getAdminSettings());
    }

    @PutMapping("/admin/settings")
    public ResponseEntity<AdminSettings> updateAdminSettings(@RequestBody AdminSettings settings) {
        return ResponseEntity.ok(adminService.updateAdminSettings(settings));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Customer> getCustomerInfo(@PathVariable String customerId) {
        try {
            return ResponseEntity.ok(adminService.getCustomer(customerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
