# QR-CABLE: QR-Based Digital Payment System

## Project Overview

**Project Name:** QR-CABLE  
**Type:** Full-stack Web Application (QR Payment System)  
**Core Functionality:** A digital payment system that generates QR codes containing payment details, allows scanning to extract data, processes payments securely, and maintains transaction history.  
**Target Users:** Cable/Internet service providers and their customers

## Technology Stack

- **Frontend:** React.js with Vite
- **Backend:** Java Spring Boot 3.2.5
- **Database:** MySQL
- **QR Generation:** qrcode.react (frontend), ZXing (backend)
- **QR Scanning:** html5-qrcode

## UI/UX Specification

### Color Palette
- Primary: `#1E3A5F` (Deep Navy Blue)
- Secondary: `#3B82F6` (Bright Blue)
- Accent: `#10B981` (Emerald Green - for success)
- Error: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Background: `#F8FAFC` (Light Gray)
- Card Background: `#FFFFFF` (White)
- Text Primary: `#1E293B` (Dark Slate)
- Text Secondary: `#64748B` (Slate Gray)

### Typography
- Font Family: 'Inter', system-ui, sans-serif
- Headings: Bold, 24px-32px
- Body: Regular, 14px-16px
- Small: 12px

### Layout Structure
- Responsive design with mobile-first approach
- Navigation bar at top with logo and menu
- Main content area with centered card layout
- Bottom navigation for mobile

### Screens

#### 1. Login Screen
- Email and password fields
- Login button
- Link to signup
- Error message display

#### 2. Signup Screen
- Name, email, phone, password fields
- Signup button
- Link to login

#### 3. Home Screen
- Welcome message with user name
- Quick action buttons:
  - Generate QR (primary)
  - Scan QR (secondary)
  - History (secondary)
- Recent transactions preview (last 3)

#### 4. Generate QR Screen
- Form fields:
  - Amount (required, number)
  - Description (optional, text)
- Generate QR button
- Display QR code with payment details
- Copy QR data option
- Share option

#### 5. Scan QR Screen
- Camera viewfinder for scanning
- Manual input option
- Extracted payment details display
- Confirm and Pay button

#### 6. Transaction History Screen
- Filter by date range
- List of all transactions
- Each item shows:
  - Transaction ID
  - Amount
  - Status (Success/Failed/Pending)
  - Timestamp
  - Other party (sender/receiver)
- Status badges with colors

#### 7. Payment Confirmation Modal
- Payment details summary
- Confirm/Cancel buttons
- Processing spinner

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    sender_id INT,
    receiver_id INT,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    qr_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### QR Operations
- `POST /api/qr/generate` - Generate QR data from payment details
- `POST /api/qr/scan` - Decode and validate QR data

### Payments
- `POST /api/payments/process` - Process a payment
- `GET /api/payments/history` - Get user transaction history
- `GET /api/payments/{id}` - Get specific transaction

## Security Features

1. **QR Encryption:** QR data is base64 encoded with a secret key
2. **Password Hashing:** BCrypt for password storage
3. **JWT Authentication:** Token-based auth
4. **Input Validation:** Server-side validation for all inputs
5. **Transaction ID:** UUID-based unique transaction IDs

## Project Structure

```
qr-payment-system/
├── backend/
│   ├── src/main/java/com/waveinit/backend/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── PaymentController.java
│   │   │   └── QRController.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Transaction.java
│   │   │   └── AuthRequest.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── TransactionRepository.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── PaymentService.java
│   │   │   └── QRService.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   └── BackendApplication.java
│   └── pom.xml
│
├── frontend/react-client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── GenerateQR.jsx
│   │   │   ├── ScanQR.jsx
│   │   │   └── History.jsx
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
└── SPEC.md
```

## Acceptance Criteria

### Core Features
- [ ] User can register with name, email, phone, password
- [ ] User can login with email and password
- [ ] User can generate QR code with amount and description
- [ ] User can scan QR code to extract payment data
- [ ] User can process payment after scanning QR
- [ ] User can view transaction history
- [ ] All transactions are stored in database

### UI/UX
- [ ] Clean, modern interface with specified color palette
- [ ] Responsive design works on mobile and desktop
- [ ] Loading states displayed during API calls
- [ ] Error messages shown for failed operations
- [ ] Success messages shown for completed operations

### Technical
- [ ] Backend validates all inputs
- [ ] Proper error handling with appropriate HTTP status codes
- [ ] JWT authentication protects private endpoints
- [ ] QR data is encoded for basic security
- [ ] Unique transaction IDs prevent duplicates
