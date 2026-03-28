package com.waveinit.backend.service;

import com.waveinit.backend.model.PaymentRequest;
import com.waveinit.backend.model.PaymentResponse;
import com.waveinit.backend.model.QRDataResponse;
import com.waveinit.backend.model.Transaction;
import com.waveinit.backend.repository.TransactionRepository;
import com.waveinit.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final QRService qrService;

    public PaymentService(TransactionRepository transactionRepository, 
                          UserRepository userRepository, 
                          QRService qrService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.qrService = qrService;
    }

    public PaymentResponse processPayment(PaymentRequest request) {
        try {
            QRDataResponse qrData = qrService.scanQR(request.getQrData());
            
            Transaction transaction = transactionRepository
                    .findByTransactionId(qrData.getTransactionId())
                    .orElseThrow(() -> new RuntimeException("Transaction not found"));

            if (transaction.getStatus() == Transaction.TransactionStatus.SUCCESS) {
                return new PaymentResponse(
                    transaction.getTransactionId(),
                    transaction.getAmount(),
                    "FAILED",
                    "Transaction already completed"
                );
            }

            if (request.getSenderId().equals(request.getReceiverId())) {
                transaction.setStatus(Transaction.TransactionStatus.FAILED);
                transactionRepository.save(transaction);
                return new PaymentResponse(
                    transaction.getTransactionId(),
                    transaction.getAmount(),
                    "FAILED",
                    "Cannot pay yourself"
                );
            }

            transaction.setSenderId(request.getSenderId());
            transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
            transactionRepository.save(transaction);

            return new PaymentResponse(
                transaction.getTransactionId(),
                transaction.getAmount(),
                "SUCCESS",
                "Payment processed successfully"
            );

        } catch (Exception e) {
            return new PaymentResponse(
                null,
                null,
                "FAILED",
                e.getMessage()
            );
        }
    }

    public List<Transaction> getTransactionHistory(Integer userId) {
        return transactionRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId)
                .stream()
                .collect(Collectors.toList());
    }

    public Transaction getTransaction(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }
}
