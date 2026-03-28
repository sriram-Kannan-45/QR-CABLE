# WAVE INIT - Technical Specification Document

---

## 1. Executive Summary

WAVE INIT is a comprehensive digital payment solution designed for cable TV and WiFi broadband service providers. The system enables seamless bill collection through multiple digital payment channels including UPI, debit/credit cards, and net banking.

---

## 2. Problem Statement

### 2.1 Background
Traditional cable and WiFi service providers face significant challenges in collecting monthly bills from customers. The current manual processes are:
- Time-consuming and labor-intensive
- Prone to human errors
- Inconvenient for customers
- Costly to maintain

### 2.2 Key Problems Identified
1. **Manual Collection Bottleneck**: Field executives spend excessive time collecting payments physically
2. **Payment Tracking Failures**: No centralized system to track pending payments
3. **Limited Payment Options**: Customers cannot pay digitally through their preferred methods
4. **Data Management Issues**: Customer and transaction records maintained manually
5. **Delayed Reconciliation**: Payment status updates take days to reflect in system

---

## 3. Proposed Solution

WAVE INIT provides a complete digital payment infrastructure that:
- Enables customers to pay through UPI, Cards, and Net Banking
- Provides QR code-based payments for quick transactions
- Offers real-time payment verification
- Maintains centralized customer and transaction database

---

## 4. Functional Requirements

### 4.1 Admin Module
| Feature | Description |
|---------|-------------|
| Dashboard | View total customers, active customers, pending amount |
| Customer Management | Add, edit, delete customer records |
| Customer Details | Name, mobile, address, plan type, plan amount |
| Payment Tracking | Monitor pending payments per customer |

### 4.2 Customer Module
| Feature | Description |
|---------|-------------|
| Login | Customer ID-based authentication |
| View Bill | Check pending amount and plan details |
| Payment | Pay through UPI/Card/Net Banking |
| Payment Methods | GPay, PhonePe, Paytm, BHIM, Card, Net Banking |
| QR Payment | Scan QR code to pay |

### 4.3 Payment Features
- **UPI Payments**: Direct transfer via UPI apps
- **Card Payments**: Debit/Credit card with OTP verification
- **Net Banking**: Bank selection and payment processing
- **QR Code**: Dynamic QR generation for each transaction

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time: < 3 seconds
- Payment processing: Real-time
- Support concurrent users: Multiple

### 5.2 Security
- Password encryption
- Session management
- API authentication
- Input validation

### 5.3 Usability
- Mobile-first responsive design
- Intuitive user interface
- Multiple language support ready

### 5.4 Reliability
- 99.9% uptime target
- Data backup capability
- Error handling and logging

---

## 6. Technical Architecture

### 6.1 Technology Stack

**Frontend:**
- React.js 18+
- CSS3 with responsive design
- QRCode React library

**Backend:**
- Spring Boot 3.x
- Java 17
- MySQL Database
- RESTful API

**Deployment:**
- Frontend: Development Server (Port 4000)
- Backend: Embedded Server (Port 5555)
- Mobile Access: Local Network IP

### 6.2 Database Schema

**Customers Table:**
```
- id (Primary Key)
- customerId (Unique)
- name
- mobile
- address
- planType (CABLE/WIFI/COMBO)
- planAmount
- pendingAmount
- createdAt
```

**Transactions Table:**
```
- id (Primary Key)
- transactionId (Unique)
- customerId (Foreign Key)
- amount
- paymentMethod
- status (PENDING/SUCCESS/FAILED)
- createdAt
```

---

## 7. API Endpoints

### 7.1 Admin Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/admin/customers | GET | List all customers |
| /api/admin/customers | POST | Add new customer |
| /api/admin/customers/{id} | PUT | Update customer |
| /api/admin/customers/{id} | DELETE | Delete customer |
| /api/admin/dashboard | GET | Get dashboard stats |

### 7.2 Payment Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/payment/methods | GET | Get payment methods |
| /api/payment/initiate | POST | Initiate payment |
| /api/payment/verify-otp | POST | Verify card OTP |
| /api/payment/confirm-upi | POST | Confirm UPI payment |
| /api/payment/netbanking-result | POST | Net banking result |

### 7.3 Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/login | POST | Admin/Customer login |
| /api/register | POST | Customer registration |

---

## 8. User Interface Design

### 8.1 Design Principles
- **Mobile-First**: Designed primarily for mobile users
- **Clean & Modern**: Minimalist design with clear CTAs
- **Responsive**: Works seamlessly on all screen sizes
- **Accessible**: Easy navigation and readability

### 8.2 Color Scheme
- **Primary**: #1E3A5F (Deep Blue)
- **Secondary**: #3B82F6 (Bright Blue)
- **Accent**: #F59E0B (Amber)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)
- **Background**: Gradient (#0f172a → #1e3a5f → #3b82f6)

### 8.3 Key UI Components
- **Login Page**: WI monogram logo, gradient background
- **Customer Dashboard**: Account info, pending amount, Pay Now button
- **Payment Modal**: Step-by-step payment flow
- **Admin Dashboard**: Stats cards, customer table/mobile cards

---

## 9. Payment Integration Details

### 9.1 UPI Integration
- **Protocol**: UPI Deep Link
- **Merchant ID**: titooram123@oksbi
- **Supported Apps**:
  - Google Pay
  - PhonePe
  - Paytm
  - BHIM
- **QR Code**: Generated using qrcode.react library

### 9.2 Card Payment
- Card number validation (16 digits)
- Expiry date validation (MM/YY format)
- CVV validation (3-4 digits)
- OTP simulation for demo

### 9.3 Net Banking
- Bank selection interface
- Simulated payment processing
- Success/Failure handling

---

## 10. System Configuration

### 10.1 Network Settings
| Setting | Value |
|---------|-------|
| Backend Port | 5555 |
| Frontend Port | 4000 |
| Network Binding | 0.0.0.0 (All interfaces) |
| Mobile Access | http://192.168.137.145:5555 |

### 10.2 Security Configuration
- CORS: Enabled for all origins
- Session: LocalStorage-based
- Password: Plain text (demo purposes)

### 10.3 Default Credentials
| Role | ID | Password |
|------|-----|----------|
| Admin | 123WAVE | sriram123@ |
| Customer | CUST001 | CUST001 |

---

## 11. Project Structure

```
qr-payment-system/
├── backend/
│   ├── src/main/java/com/waveinit/backend/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── pom.xml
├── frontend/
│   └── react-client/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Login.jsx
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── CustomerDashboard.jsx
│       │   │   └── ...
│       │   ├── config.js
│       │   └── index.css
│       └── package.json
├── docs/
│   ├── PROBLEM_STATEMENT.md
│   └── SYSTEM_SPECIFICATION.md
└── README.md
```

---

## 12. Future Enhancements

1. **SMS Notifications**: Payment reminders to customers
2. **Email Receipts**: Send payment confirmation via email
3. **Payment Reports**: Detailed transaction reports
4. **Multi-admin Support**: Multiple admin accounts
5. **Invoice Generation**: Auto-generate monthly invoices
6. **Recurring Payments**: Auto-debit functionality
7. **Wallet Integration**: In-app wallet for advance payments

---

## 13. Conclusion

WAVE INIT provides a complete solution for digital payment collection in the cable and WiFi service industry. With its mobile-first approach, multiple payment options, and comprehensive admin dashboard, it addresses all the key challenges in traditional bill collection methods.

---

**Document Version**: 1.0  
**Last Updated**: March 2026  
**Prepared By**: WAVE INIT Development Team
