package com.waveinit.backend.model;

public class LoginResponse {
    private String token;
    private Integer userId;
    private String loginType;
    private String customerId;
    private String name;
    private String mobile;
    private String address;
    private String planType;
    private Double planAmount;
    private Double pendingAmount;
    private String message;

    public LoginResponse() {}

    public LoginResponse(String message) {
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getLoginType() { return loginType; }
    public void setLoginType(String loginType) { this.loginType = loginType; }
    
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }
    
    public Double getPlanAmount() { return planAmount; }
    public void setPlanAmount(Double planAmount) { this.planAmount = planAmount; }
    
    public Double getPendingAmount() { return pendingAmount; }
    public void setPendingAmount(Double pendingAmount) { this.pendingAmount = pendingAmount; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
