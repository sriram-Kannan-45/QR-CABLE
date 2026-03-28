import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import API_BASE_URL from "../config";
import gpayIcon from "../images/gpay.png";
const MERCHANT_UPI_ID = "titooram123@oksbi";
const MERCHANT_NAME = "WAVE INIT";

function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState("select-method");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [cardErrors, setCardErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [upiLaunched, setUpiLaunched] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const navigate = useNavigate();

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("User data from localStorage:", userData);
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log("Parsed user:", parsed);
      console.log("Pending amount:", parsed.pendingAmount);
      if (parsed.loginType !== "customer") {
        navigate("/");
      } else {
        setUser(parsed);
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handlePayNow = async () => {
    console.log("=== Pay Now clicked ===");
    console.log("User object:", user);
    
    setLoading(true);
    setMessage("");
    
    // Get customerId - prefer customerId string (like "CUST001"), fallback to id
    const customerIdValue = user?.customerId || user?.id;
    console.log("Customer ID to use:", customerIdValue);
    console.log("Pending Amount:", user?.pendingAmount);
    
    if (!customerIdValue) {
      setMessage("User not found. Please login again.");
      setMessageType("error");
      setLoading(false);
      return;
    }
    
    try {
      const url = `${API_BASE_URL}/payment/methods?customerId=${customerIdValue}`;
      console.log("Calling API:", url);
      
      const response = await fetch(url);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);
        
        if (data.error) {
          setMessage(data.message || data.error);
          setMessageType("error");
        } else {
          setPaymentMethods(data);
          setTransactionId(data.transactionId);
          setShowPaymentModal(true);
          setPaymentStep("select-method");
          setSelectedMethod("");
          console.log("Payment modal opened successfully!");
        }
      } else {
        const errorData = await response.json();
        console.error("API Error response:", errorData);
        setMessage(errorData.message || errorData.error || "Error loading payment options");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Fetch Error (catch):", err);
      setMessage("Cannot connect to server. Make sure backend is running on port 5555.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (method) => {
    setLoading(true);
    console.log("Initiating payment with method:", method);
    console.log("User data:", user);
    
    const customerIdValue = user.customerId || user.id;
    const amount = parseFloat(user.pendingAmount);
    
    try {
      const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerIdValue,
          amount: amount,
          paymentMethod: method,
          transactionId: transactionId,
        }),
      });
      const data = await response.json();
      console.log("Initiate response:", data);
      
      if (data.success) {
        if (method === "CARD") {
          setPaymentStep("card-form");
        } else if (method === "NETBANKING") {
          setPaymentStep("netbanking");
        } else if (method === "UPI") {
          setPaymentStep("upi-apps");
        }
      } else {
        setMessage(data.message || "Error initiating payment");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Initiate payment error:", err);
      setMessage("Error initiating payment");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const validateCard = () => {
    const errors = {};
    const cardNum = cardDetails.number.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cardNum)) {
      errors.number = "Enter valid 16-digit card number";
    }
    if (!/^[A-Za-z\s]{2,}$/.test(cardDetails.name)) {
      errors.name = "Enter valid cardholder name";
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = "Enter valid expiry (MM/YY)";
    }
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      errors.cvv = "Enter valid CVV";
    }
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (validateCard()) {
      setPaymentStep("otp");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payment/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, otp }),
      });
      const data = await response.json();
      if (data.success) {
        updateUserPendingAmount();
        setPaymentStep("success");
      } else {
        setMessage(data.message || "Payment failed");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Payment verification failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = (app) => {
    const upiLink = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${user.pendingAmount}&cu=INR&tn=${transactionId}`;
    setUpiLaunched(true);
    setPaymentStep("upi-waiting");
    window.location.href = upiLink;
  };

  const handleQRSelect = () => {
    setUpiLaunched(true);
    setPaymentStep("upi-waiting");
  };

  const handleUPIPaymentConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payment/confirm-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });
      const data = await response.json();
      if (data.success) {
        updateUserPendingAmount();
        setPaymentStep("success");
      } else {
        setMessage(data.message || "Payment verification failed");
        setMessageType("error");
        setPaymentStep("failure");
      }
    } catch (err) {
      setMessage("Payment verification failed");
      setMessageType("error");
      setPaymentStep("failure");
    } finally {
      setLoading(false);
    }
  };

  const handleNetBankingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentStep("bank-processing");
    }, 1500);
  };

  const confirmNetBanking = async (status) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/payment/netbanking-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, status, bankName: selectedBank }),
      });
      const data = await response.json();
      if (data.success) {
        updateUserPendingAmount();
        setPaymentStep("success");
      } else {
        setPaymentStep("failure");
      }
    } catch (err) {
      setPaymentStep("failure");
    } finally {
      setLoading(false);
    }
  };

  const updateUserPendingAmount = () => {
    const paidAmount = user.pendingAmount;
    const newPending = Math.max(0, (user.pendingAmount || 0) - paidAmount);
    const updatedUser = { ...user, pendingAmount: newPending };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentStep("select-method");
    setSelectedMethod("");
    setCardDetails({ number: "", name: "", expiry: "", cvv: "" });
    setCardErrors({});
    setOtp("");
    setSelectedBank("");
    setUpiLaunched(false);
    setMessage("");
    setShowQR(false);
  };

  const getUPIDeepLink = () => {
    return `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${user.pendingAmount}&cu=INR&tn=${transactionId}`;
  };

  const isMobileScreen = window.innerWidth <= 480;

  const styles = {
    container: { minHeight: "100vh", height: "100vh", overflow: "hidden", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #3b82f6 100%)" },
    header: {
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
      padding: "18px",
      borderRadius: "0 0 20px 20px",
      color: "white",
    },
    headerTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    logo: { display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", fontSize: "18px", background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    logoIcon: { width: "32px", height: "32px" },
    logoutBtn: {
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.2)",
      padding: "6px 14px",
      borderRadius: "20px",
      color: "white",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "13px",
    },
    welcomeSection: { marginTop: "15px" },
    welcomeTitle: { fontSize: "24px", fontWeight: "800", marginBottom: "5px" },
    customerId: { fontSize: "13px", opacity: 0.85, background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "15px", display: "inline-block" },
    content: { padding: "15px", maxWidth: "500px", margin: "0 auto", overflowY: "auto", maxHeight: "calc(100vh - 180px)" },
    card: {
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      padding: "20px",
      borderRadius: "20px",
      marginBottom: "15px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
      border: "1px solid rgba(255,255,255,0.3)",
    },
    sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "15px" },
    infoRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" },
    infoLabel: { color: "#64748b", fontSize: "13px", fontWeight: "500" },
    infoValue: { fontWeight: "600", color: "#1e293b", fontSize: "14px" },
    pendingValue: { color: "#dc2626", fontSize: "18px" },
    payButton: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #f59e0b, #ef4444)",
      border: "none",
      borderRadius: "14px",
      color: "white",
      fontWeight: "700",
      fontSize: "16px",
      cursor: "pointer",
      boxShadow: "0 6px 20px rgba(245, 158, 11, 0.35)",
    },
    modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: isMobileScreen ? "10px" : "15px" },
    modalContent: { 
      background: "white", 
      padding: isMobileScreen ? "16px" : "24px", 
      borderRadius: isMobileScreen ? "16px" : "20px", 
      width: "100%", 
      maxWidth: isMobileScreen ? "340px" : "380px", 
      maxHeight: "90vh", 
      overflowY: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    modalScrollContent: {
      overflowY: "auto",
      flex: 1,
      paddingRight: "5px",
    },
    modalTitle: { fontSize: isMobileScreen ? "18px" : "20px", fontWeight: "700", marginBottom: "6px", textAlign: "center" },
    modalSubtitle: { fontSize: "13px", color: "#64748b", textAlign: "center", marginBottom: isMobileScreen ? "10px" : "15px" },
    amountDisplay: { fontSize: isMobileScreen ? "28px" : "36px", fontWeight: "800", textAlign: "center", color: "#3b82f6", marginBottom: isMobileScreen ? "10px" : "15px" },
    methodGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" },
    methodBtn: { padding: "15px", border: "2px solid #e2e8f0", borderRadius: "14px", background: "white", cursor: "pointer", textAlign: "center", transition: "all 0.2s" },
    methodBtnSelected: { borderColor: "#3b82f6", background: "#eff6ff" },
    methodIcon: { fontSize: "24px", marginBottom: "6px" },
    methodName: { fontWeight: "600", fontSize: "12px" },
    continueBtn: { width: "100%", padding: "14px", background: "#3b82f6", border: "none", borderRadius: "12px", color: "white", fontWeight: "700", fontSize: "15px", cursor: "pointer", marginTop: isMobileScreen ? "10px" : "15px", flexShrink: 0 },
    cancelBtn: { width: "100%", padding: "14px", background: "#f1f5f9", border: "none", borderRadius: "12px", color: "#64748b", fontWeight: "600", fontSize: "14px", cursor: "pointer", marginTop: "8px", flexShrink: 0 },
    input: { width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #e2e8f0", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box" },
    inputError: { borderColor: "#ef4444" },
    errorText: { color: "#ef4444", fontSize: "11px", marginTop: "-6px", marginBottom: "8px" },
    label: { fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px", display: "block" },
    upiAppBtn: { 
      padding: isMobileScreen ? "10px" : "12px", 
      border: "2px solid #e2e8f0", 
      borderRadius: "10px", 
      background: "white", 
      cursor: "pointer", 
      marginBottom: "8px", 
      display: "flex", 
      alignItems: "center", 
      transition: "all 0.2s",
    },
    bankBtn: { padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: "10px", background: "white", cursor: "pointer", marginBottom: "6px", width: "100%", textAlign: "left", fontSize: "13px" },
    bankBtnSelected: { borderColor: "#3b82f6", background: "#eff6ff" },
    successIcon: { fontSize: "60px", textAlign: "center", marginBottom: "15px" },
    failureIcon: { fontSize: "60px", textAlign: "center", marginBottom: "15px" },
    messageBox: { padding: "10px", borderRadius: "10px", textAlign: "center", marginBottom: "12px", fontSize: "13px" },
    upiInfoBox: { background: "#f0fdf4", border: "2px solid #22c55e", borderRadius: "10px", padding: isMobileScreen ? "10px" : "12px", marginBottom: isMobileScreen ? "10px" : "15px", textAlign: "center" },
    upiIdText: { fontSize: "12px", color: "#166534", fontWeight: "600" },
    qrContainer: { textAlign: "center", margin: isMobileScreen ? "10px 0" : "15px 0", padding: isMobileScreen ? "10px" : "15px", background: "#f8fafc", borderRadius: "12px" },
    waitingContainer: { textAlign: "center", padding: isMobileScreen ? "15px 0" : "30px 0" },
    spinner: { width: "50px", height: "50px", border: "4px solid #e2e8f0", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" },
  };

  const upiApps = [
    { 
      name: "Google Pay", 
      color: "#007AFD",
      icon: (
        <img 
          src={gpayIcon} 
          alt="GPay" 
          style={{ width: "28px", height: "28px", objectFit: "contain" }} 
        />
      )
    },
    { 
      name: "PhonePe", 
      color: "#6739B7",
      icon: (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <circle cx="24" cy="24" r="22" fill="#6739B7"/>
          <path fill="#fff" d="M14 24c0-5.5 4.5-10 10-10s10 4.5 10 10c0 3-1.3 5.7-3.5 7.7L24 35l-6.5-3.3C15.3 29.7 14 27 14 24z"/>
          <circle cx="19" cy="24" r="3" fill="#6739B7"/>
          <circle cx="29" cy="24" r="3" fill="#6739B7"/>
        </svg>
      )
    },
    { 
      name: "Paytm", 
      color: "#00BDB2",
      icon: (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <rect width="48" height="48" rx="8" fill="#00BDB2"/>
          <path fill="#fff" d="M14 14h20v6l8 12-8 12h-6l4-6h-8l-4-6H14V14z"/>
          <circle cx="32" cy="24" r="3" fill="#00BDB2"/>
        </svg>
      )
    },
    { 
      name: "BHIM", 
      color: "#7B1FA2",
      icon: (
        <svg viewBox="0 0 48 48" width="32" height="32">
          <rect width="48" height="48" rx="6" fill="#7B1FA2"/>
          <path fill="#fff" d="M12 34V14h4v20h-4zm6-16v16h4V18h-4zm6 0v16h4V18h-4zm6 0v16h4V18h-4z"/>
          <circle cx="38" cy="26" r="4" fill="#FFA000"/>
        </svg>
      )
    },
  ];

  if (!user) return null;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .upi-app-btn {
          transition: all 0.2s ease;
        }
        .upi-app-btn:hover {
          border-color: #3b82f6 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .upi-app-btn:active {
          transform: translateY(0);
        }
        .qr-section {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <svg style={styles.logoIcon} viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="dashLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea"/>
                  <stop offset="100%" stopColor="#764ba2"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#dashLogoGrad)" opacity="0.2"/>
              <path d="M25 65 C30 55, 40 45, 50 45 C60 45, 70 55, 75 65" stroke="#667eea" strokeWidth="6" strokeLinecap="round" fill="none"/>
              <path d="M45 30 L55 30 L50 55 Z" fill="url(#dashLogoGrad)"/>
            </svg>
            WAVE INIT
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeTitle}>Hello, {user.name}</div>
          <div style={styles.customerId}>ID: {user.id} | {user.mobile}</div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.sectionTitle}>My Account</div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Mobile</span>
            <span style={styles.infoValue}>{user.mobile || "Not set"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Plan Type</span>
            <span style={styles.infoValue}>{user.planType || "N/A"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Monthly Plan</span>
            <span style={styles.infoValue}>₹{user.planAmount}</span>
          </div>
          <div style={{ ...styles.infoRow, borderBottom: "none", marginTop: "10px", background: "#fef2f2", padding: "15px", borderRadius: "12px" }}>
            <span style={{ ...styles.infoLabel, color: "#dc2626", fontWeight: "700", fontSize: "16px" }}>Pending Amount</span>
            <span style={{ ...styles.pendingValue, fontSize: "28px" }}>₹{user.pendingAmount || 0}</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>Pay Your Bill</div>
          {message && (
            <div style={{ ...styles.messageBox, background: messageType === "success" ? "#d1fae5" : "#fee2e2", color: messageType === "success" ? "#059669" : "#dc2626" }}>
              {message}
            </div>
          )}
          <button 
            style={{...styles.payButton, opacity: loading ? 0.7 : 1}} 
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? "Loading..." : "Pay Now"}
          </button>
        </div>

        <div style={{ textAlign: "center", color: "white", opacity: 0.7, fontSize: "13px", marginTop: "20px" }}>
          Powered by <strong>WAVE INIT</strong> • Fast & Secure Payments
        </div>
      </div>

      {showPaymentModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalScrollContent}>
            {paymentStep === "select-method" && (
              <>
                <div style={styles.modalTitle}>Select Payment Method</div>
                <div style={styles.modalSubtitle}>Pay ₹{user.pendingAmount} to WAVE INIT</div>
                <div style={styles.amountDisplay}>₹{user.pendingAmount}</div>
                <div style={styles.methodGrid}>
                  <button style={{...styles.methodBtn, ...(selectedMethod === "UPI" ? styles.methodBtnSelected : {})}} onClick={() => setSelectedMethod("UPI")}>
                    <div style={styles.methodIcon}>📱</div>
                    <div style={styles.methodName}>UPI</div>
                  </button>
                  <button style={{...styles.methodBtn, ...(selectedMethod === "CARD" ? styles.methodBtnSelected : {})}} onClick={() => setSelectedMethod("CARD")}>
                    <div style={styles.methodIcon}>💳</div>
                    <div style={styles.methodName}>Debit/Credit Card</div>
                  </button>
                  <button style={{...styles.methodBtn, ...(selectedMethod === "NETBANKING" ? styles.methodBtnSelected : {})}} onClick={() => setSelectedMethod("NETBANKING")}>
                    <div style={styles.methodIcon}>🏦</div>
                    <div style={styles.methodName}>Net Banking</div>
                  </button>
                </div>
                <button style={{...styles.continueBtn, opacity: selectedMethod ? 1 : 0.5}} onClick={() => initiatePayment(selectedMethod)} disabled={!selectedMethod || loading}>
                  {loading ? "Processing..." : "Continue"}
                </button>
                <button style={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              </>
            )}

            {paymentStep === "upi-apps" && (
              <>
                <div style={styles.modalTitle}>Pay via UPI</div>
                <div style={styles.modalSubtitle}>Choose payment option</div>
                
                <div style={styles.upiInfoBox}>
                  <div style={{ fontSize: "12px", color: "#166534", marginBottom: "5px" }}>Paying to</div>
                  <div style={styles.upiIdText}>{MERCHANT_UPI_ID}</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#15803d", marginTop: "8px" }}>₹{user.pendingAmount}</div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "10px", textAlign: "left" }}>Open UPI App (Mobile)</div>
                  {upiApps.map((app) => (
                    <button 
                      key={app.name} 
                      className="upi-app-btn"
                      style={styles.upiAppBtn} 
                      onClick={() => handleUPIPayment(app)}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "12px", flexShrink: 0, background: app.color }}>
                        {app.icon}
                      </div>
                      <span style={{ fontWeight: "600", flex: 1, fontSize: "14px", color: "#1e293b" }}>{app.name}</span>
                      <span style={{ color: "#22c55e", fontSize: "18px" }}>→</span>
                    </button>
                  ))}
                </div>

                {isMobile && (
                  <div style={{ ...styles.cancelBtn, background: "#fef3c7", color: "#92400e", marginBottom: "10px" }}>
                    This will open {MERCHANT_NAME} in your UPI app
                  </div>
                )}

                {!showQR ? (
                  <button 
                    style={{...styles.cancelBtn, background: "#f0fdf4", border: "2px solid #22c55e", color: "#166534", marginBottom: "10px"}} 
                    onClick={() => setShowQR(true)}
                  >
                    Show QR Code
                  </button>
                ) : (
                  <div className="qr-section" style={{ marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Scan QR Code</div>
                      <button 
                        onClick={() => setShowQR(false)}
                        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "12px" }}
                      >
                        Hide
                      </button>
                    </div>
                    <div style={styles.qrContainer}>
                      <div style={{ background: "white", padding: "15px", borderRadius: "12px", display: "inline-block", marginBottom: "10px" }}>
                        <QRCodeSVG value={getUPIDeepLink()} size={isMobileScreen ? 140 : 160} level={"H"} />
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Scan with any UPI app</div>
                    </div>
                  </div>
                )}

                {showQR && (
                  <button style={{...styles.continueBtn, background: "#10b981", marginTop: "10px"}} onClick={handleQRSelect}>
                    I've Scanned QR & Paid
                  </button>
                )}
                <button style={styles.cancelBtn} onClick={() => { setShowQR(false); setPaymentStep("select-method"); }}>Back</button>
              </>
            )}

            {paymentStep === "upi-waiting" && (
              <>
                <div style={styles.modalTitle}>Waiting for Payment</div>
                <div style={styles.waitingContainer}>
                  <div style={styles.spinner}></div>
                  <div style={{ fontSize: "16px", color: "#374151", marginBottom: "10px" }}>
                    {isMobile ? "Opening UPI app..." : "Waiting for payment..."}
                  </div>
                  <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                    Amount: <strong>₹{user.pendingAmount}</strong>
                  </div>
                  <div style={styles.upiInfoBox}>
                    <div style={styles.upiIdText}>{MERCHANT_UPI_ID}</div>
                  </div>
                  {!isMobile && (
                    <div style={styles.qrContainer}>
                      <div style={{ background: "white", padding: "15px", borderRadius: "12px", display: "inline-block", marginBottom: "10px" }}>
                        <QRCodeSVG value={getUPIDeepLink()} size={140} level={"H"} />
                      </div>
                    </div>
                  )}
                </div>
                <button style={{...styles.continueBtn, background: "#10b981"}} onClick={handleUPIPaymentConfirm} disabled={loading}>
                  {loading ? "Verifying..." : "I Have Completed Payment"}
                </button>
                <button style={styles.cancelBtn} onClick={() => { setUpiLaunched(false); setPaymentStep("upi-apps"); }}>Back</button>
              </>
            )}

            {paymentStep === "card-form" && (
              <>
                <div style={styles.modalTitle}>Card Payment</div>
                <div style={styles.modalSubtitle}>Enter your card details</div>
                <form onSubmit={handleCardSubmit}>
                  <label style={styles.label}>Card Number</label>
                  <input style={{...styles.input, ...(cardErrors.number ? styles.inputError : {})}} type="text" placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, "").slice(0, 16)})} maxLength={16} />
                  {cardErrors.number && <div style={styles.errorText}>{cardErrors.number}</div>}
                  
                  <label style={styles.label}>Cardholder Name</label>
                  <input style={{...styles.input, ...(cardErrors.name ? styles.inputError : {})}} type="text" placeholder="John Doe" value={cardDetails.name} onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})} />
                  {cardErrors.name && <div style={styles.errorText}>{cardErrors.name}</div>}
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={styles.label}>Expiry</label>
                      <input style={{...styles.input, ...(cardErrors.expiry ? styles.inputError : {})}} type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} maxLength={5} />
                      {cardErrors.expiry && <div style={styles.errorText}>{cardErrors.expiry}</div>}
                    </div>
                    <div>
                      <label style={styles.label}>CVV</label>
                      <input style={{...styles.input, ...(cardErrors.cvv ? styles.inputError : {})}} type="password" placeholder="123" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 4)})} maxLength={4} />
                      {cardErrors.cvv && <div style={styles.errorText}>{cardErrors.cvv}</div>}
                    </div>
                  </div>
                  <button type="submit" style={styles.continueBtn}>Continue to OTP</button>
                </form>
                <button style={styles.cancelBtn} onClick={() => setPaymentStep("select-method")}>Back</button>
              </>
            )}

            {paymentStep === "otp" && (
              <>
                <div style={styles.modalTitle}>Enter OTP</div>
                <div style={styles.modalSubtitle}>Enter 6-digit OTP sent to your mobile</div>
                <form onSubmit={handleOTPSubmit}>
                  <input style={{...styles.input, textAlign: "center", fontSize: "24px", letterSpacing: "8px"}} type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} />
                  <div style={{ textAlign: "center", color: "#64748b", fontSize: "12px", marginBottom: "15px" }}>Test OTP: 123456</div>
                  <button type="submit" style={styles.continueBtn} disabled={otp.length !== 6 || loading}>
                    {loading ? "Verifying..." : "Verify & Pay"}
                  </button>
                </form>
                <button style={styles.cancelBtn} onClick={() => setPaymentStep("card-form")}>Back</button>
              </>
            )}

            {paymentStep === "netbanking" && (
              <>
                <div style={styles.modalTitle}>Net Banking</div>
                <div style={styles.modalSubtitle}>Select your bank</div>
                {[
                  { code: "SBI", name: "State Bank of India" },
                  { code: "HDFC", name: "HDFC Bank" },
                  { code: "ICICI", name: "ICICI Bank" },
                  { code: "AXIS", name: "Axis Bank" },
                  { code: "PNB", name: "Punjab National Bank" },
                  { code: "BOB", name: "Bank of Baroda" },
                ].map((bank) => (
                  <button key={bank.code} style={{...styles.bankBtn, ...(selectedBank === bank.code ? styles.bankBtnSelected : {})}} onClick={() => setSelectedBank(bank.code)}>
                    {bank.name}
                  </button>
                ))}
                <button style={{...styles.continueBtn, opacity: selectedBank ? 1 : 0.5}} onClick={handleNetBankingSubmit} disabled={!selectedBank || loading}>
                  {loading ? "Processing..." : "Proceed to Bank"}
                </button>
                <button style={styles.cancelBtn} onClick={() => setPaymentStep("select-method")}>Back</button>
              </>
            )}

            {paymentStep === "bank-processing" && (
              <>
                <div style={styles.modalTitle}>Connecting to Bank</div>
                <div style={{ textAlign: "center", margin: "30px 0" }}>
                  <div style={{ color: "#64748b" }}>Please wait while we connect to {selectedBank}...</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button style={{...styles.continueBtn, background: "#10b981"}} onClick={() => confirmNetBanking("SUCCESS")}>Simulate Success</button>
                  <button style={{...styles.continueBtn, background: "#ef4444"}} onClick={() => confirmNetBanking("FAILED")}>Simulate Failure</button>
                </div>
              </>
            )}

            {paymentStep === "success" && (
              <>
                <div style={{...styles.successIcon, background: "#d1fae5", width: "70px", height: "70px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px"}}>
                  <span style={{fontSize: "32px", color: "#059669"}}>✓</span>
                </div>
                <div style={styles.modalTitle}>Payment Successful!</div>
                <div style={{ ...styles.modalSubtitle, color: "#059669", fontWeight: "600" }}>Your payment of ₹{user.pendingAmount} was successful</div>
                <div style={{ background: "#f1f5f9", padding: "15px", borderRadius: "12px", marginBottom: "20px", textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Transaction ID</div>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>{transactionId}</div>
                </div>
                <button style={styles.continueBtn} onClick={closeModal}>Done</button>
              </>
            )}

            {paymentStep === "failure" && (
              <>
                <div style={{...styles.failureIcon, background: "#fee2e2", width: "70px", height: "70px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px"}}>
                  <span style={{fontSize: "32px", color: "#dc2626"}}>✕</span>
                </div>
                <div style={styles.modalTitle}>Payment Failed</div>
                <div style={{ ...styles.modalSubtitle, color: "#dc2626", fontWeight: "600" }}>Your payment could not be processed</div>
                <button style={styles.continueBtn} onClick={() => setPaymentStep("select-method")}>Try Again</button>
                <button style={styles.cancelBtn} onClick={closeModal}>Close</button>
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
