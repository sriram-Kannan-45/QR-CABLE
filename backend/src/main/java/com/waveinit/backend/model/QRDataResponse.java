package com.waveinit.backend.model;

import java.math.BigDecimal;

public class QRDataResponse {
    private String qrData;
    private String transactionId;
    private BigDecimal amount;
    private String description;
    private Integer userId;

    public QRDataResponse() {}

    public QRDataResponse(String qrData, String transactionId, BigDecimal amount, String description, Integer userId) {
        this.qrData = qrData;
        this.transactionId = transactionId;
        this.amount = amount;
        this.description = description;
        this.userId = userId;
    }

    public String getQrData() { return qrData; }
    public void setQrData(String qrData) { this.qrData = qrData; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
