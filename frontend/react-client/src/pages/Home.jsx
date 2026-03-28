import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config";

function Home() {
  const [user, setUser] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      fetchRecentTransactions(parsed.id);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchRecentTransactions = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/history?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRecentTransactions(data.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#F8FAFC",
    },
    header: {
      background: "linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)",
      padding: "30px 20px",
      borderRadius: "0 0 30px 30px",
      color: "white",
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: "bold",
      fontSize: "20px",
    },
    logoutBtn: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      padding: "8px 16px",
      borderRadius: "20px",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    },
    welcome: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "8px",
    },
    email: {
      fontSize: "14px",
      opacity: 0.9,
    },
    content: {
      padding: "20px",
    },
    section: {
      marginBottom: "30px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1E293B",
      marginBottom: "16px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "16px",
    },
    card: {
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      textAlign: "center",
      cursor: "pointer",
      transition: "0.3s",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      textDecoration: "none",
      color: "inherit",
      display: "block",
    },
    cardIcon: {
      fontSize: "36px",
      marginBottom: "12px",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#1E293B",
    },
    primaryCard: {
      background: "linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)",
      color: "white",
    },
    transactionList: {
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    transactionItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 20px",
      borderBottom: "1px solid #F1F5F9",
    },
    transactionLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    transactionIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
    },
    transactionDetails: {
      display: "flex",
      flexDirection: "column",
    },
    transactionId: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1E293B",
    },
    transactionDate: {
      fontSize: "12px",
      color: "#64748B",
    },
    transactionAmount: {
      fontSize: "16px",
      fontWeight: "700",
    },
    statusBadge: {
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px",
      color: "#64748B",
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS": return { bg: "#D1FAE5", color: "#059669" };
      case "FAILED": return { bg: "#FEE2E2", color: "#DC2626" };
      default: return { bg: "#FEF3C7", color: "#D97706" };
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <span>⎔</span> QR-CABLE
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div style={styles.welcome}>Hello, {user.name}!</div>
        <div style={styles.email}>{user.email}</div>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Quick Actions</div>
          <div style={styles.grid}>
            <Link to="/generate-qr" style={styles.card}>
              <div style={{...styles.card, ...styles.primaryCard}}>
                <div style={styles.cardIcon}>⎔</div>
                <div style={styles.cardTitle}>Generate QR</div>
              </div>
            </Link>
            <Link to="/scan-qr" style={styles.card}>
              <div style={styles.card}>
                <div style={styles.cardIcon}>📷</div>
                <div style={styles.cardTitle}>Scan QR</div>
              </div>
            </Link>
            <Link to="/history" style={styles.card}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>History</div>
              </div>
            </Link>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Recent Transactions</div>
          {recentTransactions.length > 0 ? (
            <div style={styles.transactionList}>
              {recentTransactions.map((tx) => {
                const isSent = tx.senderId === user.id;
                const statusStyle = getStatusColor(tx.status);
                return (
                  <div key={tx.id} style={styles.transactionItem}>
                    <div style={styles.transactionLeft}>
                      <div style={{
                        ...styles.transactionIcon,
                        background: isSent ? "#FEE2E2" : "#D1FAE5",
                      }}>
                        {isSent ? "↑" : "↓"}
                      </div>
                      <div style={styles.transactionDetails}>
                        <div style={styles.transactionId}>
                          {tx.transactionId}
                        </div>
                        <div style={styles.transactionDate}>
                          {formatDate(tx.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        ...styles.transactionAmount,
                        color: isSent ? "#DC2626" : "#059669",
                      }}>
                        {isSent ? "-" : "+"}₹{tx.amount}
                      </div>
                      <div style={{
                        ...styles.statusBadge,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
              <div>No transactions yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
