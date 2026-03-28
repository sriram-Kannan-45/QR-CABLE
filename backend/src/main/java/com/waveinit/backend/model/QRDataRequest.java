package com.waveinit.backend.model;

import java.math.BigDecimal;

public class QRDataRequest {
    private BigDecimal amount;
    private String description;
    private Integer userId;

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
