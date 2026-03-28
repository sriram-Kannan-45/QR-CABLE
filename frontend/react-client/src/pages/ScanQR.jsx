import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import API_BASE_URL from "../config";

function ScanQR() {
  const [scannedData, setScannedData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showManual && !scannedData) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          scanner.clear();
          setScannedData(decodedText);
          processQRData(decodedText);
        },
        (error) => {
          console.log(error);
        }
      );

      scannerRef.current = scanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
        }
      };
    }
  }, [showManual, scannedData]);

  const processQRData = async (qrData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/qr/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qrData),
      });

      const data = await response.json();

      if (response.ok && data.transactionId) {
        setPaymentData(data);
      } else {
        setError(data.description || "Invalid QR code");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setScannedData(manualInput);
      processQRData(manualInput);
    }
  };

  const handlePayment = async () => {
    if (!paymentData || !scannedData) return;

    setProcessing(true);
    setError("");

    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrData: scannedData,
          senderId: userData.id,
          receiverId: paymentData.userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentResult(data);
      } else {
        setError(data.message || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      setError("Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#F8FAFC",
    },
    header: {
      background: "linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)",
      padding: "20px",
      borderRadius: "0 0 30px 30px",
      color: "white",
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    backBtn: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      padding: "8px 16px",
      borderRadius: "20px",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      textDecoration: "none",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      textAlign: "center",
      marginTop: "20px",
    },
    content: {
      padding: "30px 20px",
      maxWidth: "500px",
      margin: "0 auto",
    },
    card: {
      background: "white",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    },
    scannerBox: {
      width: "100%",
      minHeight: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F8FAFC",
      borderRadius: "16px",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
      marginBottom: "15px",
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "#1E3A5F",
      border: "none",
      borderRadius: "10px",
      color: "white",
      fontWeight: "600",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.3s",
      marginBottom: "10px",
    },
    secondaryBtn: {
      background: "#F1F5F9",
      color: "#1E293B",
    },
    error: {
      color: "#EF4444",
      marginBottom: "15px",
      fontSize: "14px",
      textAlign: "center",
      padding: "10px",
      background: "#FEE2E2",
      borderRadius: "8px",
    },
    success: {
      color: "#10B981",
      marginBottom: "15px",
      fontSize: "14px",
      textAlign: "center",
      padding: "10px",
      background: "#D1FAE5",
      borderRadius: "8px",
    },
    paymentDetails: {
      textAlign: "center",
    },
    amount: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#3B82F6",
      margin: "20px 0",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid #F1F5F9",
    },
    detailLabel: {
      color: "#64748B",
      fontSize: "14px",
    },
    detailValue: {
      color: "#1E293B",
      fontWeight: "600",
      fontSize: "14px",
    },
    resultBox: {
      textAlign: "center",
      padding: "30px",
    },
    resultIcon: {
      fontSize: "60px",
      marginBottom: "20px",
    },
    resultTitle: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "10px",
    },
    resultMessage: {
      color: "#64748B",
      marginBottom: "20px",
    },
    toggleLink: {
      color: "#3B82F6",
      textAlign: "center",
      cursor: "pointer",
      fontSize: "14px",
      marginTop: "15px",
      display: "block",
    },
  };

  if (paymentResult) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <Link to="/home" style={styles.backBtn}>
              ← Back
            </Link>
            <span style={{ fontWeight: "600" }}>QR-CABLE</span>
            <span></span>
          </div>
          <div style={styles.title}>Payment Result</div>
        </div>

        <div style={styles.content}>
          <div style={styles.card}>
            <div style={styles.resultBox}>
              <div style={{
                ...styles.resultIcon,
                background: paymentResult.status === "SUCCESS" ? "#d1fae5" : "#fee2e2",
              }}>
                <span style={{ fontSize: "32px", color: paymentResult.status === "SUCCESS" ? "#059669" : "#dc2626" }}>
                  {paymentResult.status === "SUCCESS" ? "✓" : "✕"}
                </span>
              </div>
              <div style={{
                ...styles.resultTitle,
                color: paymentResult.status === "SUCCESS" ? "#059669" : "#DC2626"
              }}>
                {paymentResult.status === "SUCCESS" ? "Payment Successful!" : "Payment Failed"}
              </div>
              <div style={styles.resultMessage}>{paymentResult.message}</div>
              {paymentResult.transactionId && (
                <div style={{ color: "#64748B", marginBottom: "10px" }}>
                  Transaction ID: {paymentResult.transactionId}
                </div>
              )}
              {paymentResult.amount && (
                <div style={styles.amount}>₹{paymentResult.amount}</div>
              )}
              <button
                style={styles.button}
                onClick={() => navigate("/home")}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <Link to="/home" style={styles.backBtn}>
            ← Back
          </Link>
          <span style={{ fontWeight: "600" }}>QR-CABLE</span>
          <span></span>
        </div>
        <div style={styles.title}>Scan Payment QR</div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          {!paymentData ? (
            <>
              {!showManual ? (
                <>
                  <div style={styles.scannerBox} id="qr-reader">
                    {loading && <div>Processing...</div>}
                  </div>
                  {error && <div style={styles.error}>{error}</div>}
                  <span
                    style={styles.toggleLink}
                    onClick={() => setShowManual(true)}
                  >
                    Enter QR data manually
                  </span>
                </>
              ) : (
                <form onSubmit={handleManualSubmit}>
                  <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
                    Enter QR Data
                  </label>
                  <textarea
                    style={{...styles.input, minHeight: "100px", resize: "vertical"}}
                    placeholder="Paste QR data here..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    required
                  />
                  {error && <div style={styles.error}>{error}</div>}
                  <button
                    type="submit"
                    style={{...styles.button, opacity: loading ? 0.7 : 1}}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Process QR Data"}
                  </button>
                  <button
                    type="button"
                    style={{...styles.button, ...styles.secondaryBtn}}
                    onClick={() => {
                      setShowManual(false);
                      setManualInput("");
                      setError("");
                    }}
                  >
                    Use Camera Instead
                  </button>
                </form>
              )}
            </>
          ) : (
            <div style={styles.paymentDetails}>
              <div style={{ fontSize: "18px", color: "#64748B", marginBottom: "10px" }}>
                Payment Details
              </div>
              <div style={styles.amount}>₹{paymentData.amount}</div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Transaction ID</span>
                <span style={styles.detailValue}>{paymentData.transactionId}</span>
              </div>
              {paymentData.description && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Description</span>
                  <span style={styles.detailValue}>{paymentData.description}</span>
                </div>
              )}
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Status</span>
                <span style={{...styles.detailValue, color: "#F59E0B"}}>Pending</span>
              </div>
              
              {error && <div style={styles.error}>{error}</div>}

              <button
                style={{...styles.button, marginTop: "20px", opacity: processing ? 0.7 : 1}}
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Confirm & Pay"}
              </button>
              <button
                style={{...styles.button, ...styles.secondaryBtn}}
                onClick={() => {
                  setPaymentData(null);
                  setScannedData(null);
                }}
              >
                Scan Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScanQR;
