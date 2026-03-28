package com.waveinit.backend.service;

import com.waveinit.backend.model.QRDataRequest;
import com.waveinit.backend.model.QRDataResponse;
import com.waveinit.backend.model.Transaction;
import com.waveinit.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;

@Service
public class QRService {

    private static final String SECRET_KEY = "QRCABLE2024SECRET";

    private final TransactionRepository transactionRepository;

    public QRService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public QRDataResponse generateQR(QRDataRequest request) {
        String transactionId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        String qrPayload = transactionId + "|" + 
                          request.getUserId() + "|" + 
                          request.getAmount() + "|" + 
                          (request.getDescription() != null ? request.getDescription() : "");
        
        String encryptedData = encrypt(qrPayload);

        Transaction transaction = new Transaction();
        transaction.setTransactionId(transactionId);
        transaction.setReceiverId(request.getUserId());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setQrData(encryptedData);
        transaction.setStatus(Transaction.TransactionStatus.PENDING);
        
        transactionRepository.save(transaction);

        return new QRDataResponse(encryptedData, transactionId, request.getAmount(), 
                                  request.getDescription(), request.getUserId());
    }

    public QRDataResponse scanQR(String qrData) {
        try {
            String decrypted = decrypt(qrData);
            String[] parts = decrypted.split("\\|");
            
            if (parts.length < 3) {
                throw new RuntimeException("Invalid QR data format");
            }

            String transactionId = parts[0];
            Integer userId = Integer.parseInt(parts[1]);
            BigDecimal amount = new BigDecimal(parts[2]);
            String description = parts.length > 3 ? parts[3] : "";

            return new QRDataResponse(qrData, transactionId, amount, description, userId);
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired QR code");
        }
    }

    private String encrypt(String data) {
        String combined = data + ":" + SECRET_KEY;
        return Base64.getEncoder().encodeToString(combined.getBytes(StandardCharsets.UTF_8));
    }

    private String decrypt(String encryptedData) {
        try {
            String decoded = new String(Base64.getDecoder().decode(encryptedData), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":");
            if (parts.length < 2) {
                throw new RuntimeException("Invalid data");
            }
            String data = decoded.substring(0, decoded.length() - (SECRET_KEY.length() + 1));
            return data;
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed");
        }
    }
}
