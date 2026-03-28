package com.waveinit.backend.model;

import java.math.BigDecimal;

public class PaymentRequest {
    private String qrData;
    private Integer senderId;
    private Integer receiverId;

    public String getQrData() { return qrData; }
    public void setQrData(String qrData) { this.qrData = qrData; }
    
    public Integer getSenderId() { return senderId; }
    public void setSenderId(Integer senderId) { this.senderId = senderId; }
    
    public Integer getReceiverId() { return receiverId; }
    public void setReceiverId(Integer receiverId) { this.receiverId = receiverId; }
}
