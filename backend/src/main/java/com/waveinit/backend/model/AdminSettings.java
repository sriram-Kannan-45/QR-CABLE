package com.waveinit.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_settings")
public class AdminSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "admin_id", unique = true, nullable = false)
    private String adminId = "123WAVE";

    @Column(name = "admin_password")
    private String adminPassword = "sriram123@";

    @Column(name = "upi_id")
    private String upiId = "titooram123@oksbi";

    @Column(name = "business_name")
    private String businessName = "WAVE INIT";

    @Column(name = "business_phone")
    private String businessPhone = "9876543210";

    @Column(name = "payment_message")
    private String paymentMessage = "Pay your bill using any UPI app";

    @Column(name = "reminder_days")
    private Integer reminderDays = 3;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }
    
    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }
    
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    
    public String getBusinessPhone() { return businessPhone; }
    public void setBusinessPhone(String businessPhone) { this.businessPhone = businessPhone; }
    
    public String getPaymentMessage() { return paymentMessage; }
    public void setPaymentMessage(String paymentMessage) { this.paymentMessage = paymentMessage; }
    
    public Integer getReminderDays() { return reminderDays; }
    public void setReminderDays(Integer reminderDays) { this.reminderDays = reminderDays; }
}
