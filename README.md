# QR-CABLE: QR-Based Digital Payment System

A full-stack QR-based digital payment system built with React (frontend) and Spring Boot (backend).

## Features

- **User Authentication**: Sign up and login with email/password
- **QR Code Generation**: Generate payment QR codes with amount and description
- **QR Code Scanning**: Scan QR codes to extract payment details
- **Payment Processing**: Process payments securely
- **Transaction History**: View all past transactions with filtering
- **QR Encryption**: Basic encryption for QR data security

## Tech Stack

- **Frontend**: React.js, qrcode.react, html5-qrcode
- **Backend**: Java Spring Boot 3.2.5
- **Database**: MySQL
- **Authentication**: JWT-based token auth

## Project Structure

```
qr-payment-system/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/waveinit/backend/
│   │       ├── controller/     # REST API controllers
│   │       ├── model/          # Data models
│   │       ├── repository/     # JPA repositories
│   │       ├── service/        # Business logic
│   │       └── config/          # Security config
│   └── pom.xml
│
├── frontend/react-client/       # React frontend
│   ├── src/
│   │   ├── pages/              # Screen components
│   │   ├── App.js              # Main app with routes
│   │   └── index.js            # Entry point
│   └── package.json
│
└── README.md
```

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL Server
- Maven

## Database Setup

1. Create a MySQL database named `waveinit_db`:
```sql
CREATE DATABASE waveinit_db;
```

2. The application will automatically create the required tables on startup.

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/waveinit_db
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Run the backend:
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8081`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/react-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth header)

### QR Operations
- `POST /api/qr/generate` - Generate QR data
- `POST /api/qr/scan` - Decode QR data

### Payments
- `POST /api/payments/process` - Process a payment
- `GET /api/payments/history?userId={id}` - Get transaction history
- `GET /api/payments/{transactionId}` - Get specific transaction

## Usage

1. **Sign Up**: Create a new account on the signup page
2. **Login**: Login with your email and password
3. **Generate QR**: Go to "Generate QR" to create a payment QR code
4. **Scan QR**: Use "Scan QR" to scan and process payments
5. **View History**: Check all transactions in "History"

## Screenshots

- **Login/Signup**: Clean authentication interface
- **Home**: Dashboard with quick actions and recent transactions
- **Generate QR**: Form to create payment QR codes
- **Scan QR**: Camera scanner with manual input option
- **History**: Transaction list with filters

## Security Features

- Passwords are hashed using BCrypt
- JWT-based authentication
- Base64 encoded QR data with secret key
- Server-side input validation

## License

This project is for educational purposes.
