import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
    try {
      const response = await fetch(`${API_BASE_URL}/payment/transactions?customerId=${userData.id}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.status === filter;
  });

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
      maxWidth: "600px",
      margin: "0 auto",
    },
    filterContainer: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      overflowX: "auto",
      paddingBottom: "5px",
    },
    filterBtn: {
      padding: "8px 16px",
      borderRadius: "20px",
      border: "none",
      fontSize: "14px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "0.3s",
    },
    activeFilter: {
      background: "#1E3A5F",
      color: "white",
    },
    inactiveFilter: {
      background: "white",
      color: "#64748B",
    },
    summary: {
      display: "flex",
      gap: "15px",
      marginBottom: "25px",
    },
    summaryCard: {
      flex: 1,
      background: "white",
      padding: "20px",
      borderRadius: "16px",
      textAlign: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    summaryLabel: {
      fontSize: "12px",
      color: "#64748B",
      marginBottom: "5px",
    },
    summaryValue: {
      fontSize: "20px",
      fontWeight: "700",
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
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    },
    transactionDetails: {
      display: "flex",
      flexDirection: "column",
    },
    transactionId: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#1E293B",
    },
    transactionDate: {
      fontSize: "12px",
      color: "#64748B",
      marginTop: "2px",
    },
    transactionRight: {
      textAlign: "right",
    },
    transactionAmount: {
      fontSize: "16px",
      fontWeight: "700",
      marginBottom: "4px",
    },
    statusBadge: {
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "600",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#64748B",
      background: "white",
      borderRadius: "16px",
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
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateSummary = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.id;

    const totalReceived = transactions
      .filter(tx => tx.receiverId === userId && tx.status === "SUCCESS")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalSent = transactions
      .filter(tx => tx.senderId === userId && tx.status === "SUCCESS")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalTransactions = transactions.filter(tx => tx.status === "SUCCESS").length;

    return { totalReceived, totalSent, totalTransactions };
  };

  const summary = calculateSummary();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

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
        <div style={styles.title}>Transaction History</div>
      </div>

      <div style={styles.content}>
        <div style={styles.summary}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Received</div>
            <div style={{...styles.summaryValue, color: "#059669"}}>
              ₹{summary.totalReceived.toFixed(2)}
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Sent</div>
            <div style={{...styles.summaryValue, color: "#DC2626"}}>
              ₹{summary.totalSent.toFixed(2)}
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Transactions</div>
            <div style={{...styles.summaryValue, color: "#3B82F6"}}>
              {summary.totalTransactions}
            </div>
          </div>
        </div>

        <div style={styles.filterContainer}>
          <button
            style={{
              ...styles.filterBtn,
              ...(filter === "all" ? styles.activeFilter : styles.inactiveFilter),
            }}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            style={{
              ...styles.filterBtn,
              ...(filter === "SUCCESS" ? styles.activeFilter : styles.inactiveFilter),
            }}
            onClick={() => setFilter("SUCCESS")}
          >
            Success
          </button>
          <button
            style={{
              ...styles.filterBtn,
              ...(filter === "FAILED" ? styles.activeFilter : styles.inactiveFilter),
            }}
            onClick={() => setFilter("FAILED")}
          >
            Failed
          </button>
          <button
            style={{
              ...styles.filterBtn,
              ...(filter === "PENDING" ? styles.activeFilter : styles.inactiveFilter),
            }}
            onClick={() => setFilter("PENDING")}
          >
            Pending
          </button>
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading...</div>
        ) : filteredTransactions.length > 0 ? (
          <div style={styles.transactionList}>
            {filteredTransactions.map((tx) => {
              const isSent = tx.senderId === userData.id;
              const statusStyle = getStatusColor(tx.status);
              return (
                <div key={tx.id} style={styles.transactionItem}>
                  <div style={styles.transactionLeft}>
                    <div
                      style={{
                        ...styles.transactionIcon,
                        background: isSent ? "#FEE2E2" : "#D1FAE5",
                      }}
                    >
                      {isSent ? "↑" : "↓"}
                    </div>
                    <div style={styles.transactionDetails}>
                      <div style={styles.transactionId}>
                        {tx.transactionId}
                      </div>
                      <div style={styles.transactionDate}>
                        {formatDate(tx.createdAt)}
                      </div>
                      {tx.description && (
                        <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>
                          {tx.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={styles.transactionRight}>
                    <div
                      style={{
                        ...styles.transactionAmount,
                        color: isSent ? "#DC2626" : "#059669",
                      }}
                    >
                      {isSent ? "-" : "+"}₹{tx.amount}
                    </div>
                    <div
                      style={{
                        ...styles.statusBadge,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {tx.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>📭</div>
            <div style={{ fontSize: "16px", marginBottom: "5px" }}>No transactions found</div>
            <div style={{ fontSize: "14px" }}>
              {filter !== "all" ? `No ${filter.toLowerCase()} transactions` : "Your transactions will appear here"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
