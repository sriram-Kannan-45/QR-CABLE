import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import API_BASE_URL from "../config";

function GenerateQR() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#1E293B",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
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
    },
    error: {
      color: "#EF4444",
      marginBottom: "15px",
      fontSize: "14px",
      textAlign: "center",
    },
    qrContainer: {
      textAlign: "center",
      padding: "30px 0",
    },
    qrWrapper: {
      display: "inline-block",
      padding: "20px",
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
    qrLabel: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1E293B",
      marginTop: "20px",
      marginBottom: "8px",
    },
    amount: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#3B82F6",
      marginBottom: "10px",
    },
    transactionId: {
      fontSize: "14px",
      color: "#64748B",
      marginBottom: "20px",
    },
    copyBtn: {
      background: "#F1F5F9",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      color: "#1E293B",
      cursor: "pointer",
      fontSize: "14px",
      marginTop: "15px",
    },
    success: {
      color: "#10B981",
      marginBottom: "15px",
      fontSize: "14px",
      textAlign: "center",
    },
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setQrData(null);
    setLoading(true);

    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          userId: userData.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.qrData) {
        setQrData(data);
      } else {
        setError(data.description || "Failed to generate QR code");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData.qrData);
    }
  };

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
        <div style={styles.title}>Generate Payment QR</div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          {!qrData ? (
            <form onSubmit={handleGenerate}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  style={styles.input}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="What's this payment for?"
                  style={styles.input}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                type="submit"
                style={{...styles.button, opacity: loading ? 0.7 : 1}}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate QR Code"}
              </button>
            </form>
          ) : (
            <div style={styles.qrContainer}>
              <div style={styles.qrWrapper}>
                <QRCodeSVG
                  value={qrData.qrData}
                  size={200}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <div style={styles.qrLabel}>Payment Amount</div>
              <div style={styles.amount}>₹{qrData.amount}</div>
              <div style={styles.transactionId}>
                Transaction ID: {qrData.transactionId}
              </div>
              {qrData.description && (
                <div style={{ color: "#64748B", marginBottom: "10px" }}>
                  {qrData.description}
                </div>
              )}
              <button style={styles.copyBtn} onClick={copyToClipboard}>
                Copy QR Data
              </button>
              <div style={styles.success}>
                QR Code generated successfully!
              </div>
              <button
                style={{...styles.button, marginTop: "15px"}}
                onClick={() => setQrData(null)}
              >
                Generate Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateQR;
