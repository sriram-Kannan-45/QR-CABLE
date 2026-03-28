package com.waveinit.backend.model;

import java.math.BigDecimal;

public class CustomerRequest {
    private String customerId;
    private String name;
    private String mobile;
    private String address;
    private String planType;
    private BigDecimal planAmount;

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
    
    public BigDecimal getPlanAmount() { return planAmount; }
    public void setPlanAmount(BigDecimal planAmount) { this.planAmount = planAmount; }
}
