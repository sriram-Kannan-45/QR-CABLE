package com.waveinit.backend.controller;

import com.waveinit.backend.model.QRDataRequest;
import com.waveinit.backend.model.QRDataResponse;
import com.waveinit.backend.service.QRService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin
public class QRController {

    private final QRService qrService;

    public QRController(QRService qrService) {
        this.qrService = qrService;
    }

    @PostMapping("/generate")
    public ResponseEntity<QRDataResponse> generateQR(@RequestBody QRDataRequest request) {
        try {
            if (request.getAmount() == null || request.getAmount().doubleValue() <= 0) {
                return ResponseEntity.badRequest().body(new QRDataResponse(null, null, null, "Amount must be greater than 0", null));
            }
            if (request.getUserId() == null) {
                return ResponseEntity.badRequest().body(new QRDataResponse(null, null, null, "User ID is required", null));
            }
            QRDataResponse response = qrService.generateQR(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new QRDataResponse(null, null, null, e.getMessage(), null));
        }
    }

    @PostMapping("/scan")
    public ResponseEntity<QRDataResponse> scanQR(@RequestBody String qrData) {
        try {
            QRDataResponse response = qrService.scanQR(qrData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new QRDataResponse(null, null, null, e.getMessage(), null));
        }
    }
}
