import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import API_BASE_URL from "../config";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [dashboard, setDashboard] = useState({ totalCustomers: 0, activeCustomers: 0, totalPending: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    mobile: "",
    address: "",
    planType: "CABLE",
    planAmount: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.loginType !== "admin") {
        navigate("/");
      } else {
        setUser(parsed);
        loadData();
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const loadData = async () => {
    try {
      const [customersRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/customers`),
        fetch(`${API_BASE_URL}/admin/dashboard`),
      ]);
      
      if (customersRes.ok) {
        setCustomers(await customersRes.json());
      }
      if (dashboardRes.ok) {
        setDashboard(await dashboardRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCustomer 
        ? `${API_BASE_URL}/admin/customers/${editingCustomer.customerId}`
        : `${API_BASE_URL}/admin/customers`;
      
      const response = await fetch(url, {
        method: editingCustomer ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          planAmount: parseFloat(formData.planAmount),
        }),
      });

      if (response.ok) {
        setShowModal(false);
        loadData();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerId: customer.customerId,
      name: customer.name,
      mobile: customer.mobile,
      address: customer.address,
      planType: customer.planType,
      planAmount: customer.planAmount.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await fetch(`${API_BASE_URL}/admin/customers/${customerId}`, { method: "DELETE" });
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      customerId: "",
      name: "",
      mobile: "",
      address: "",
      planType: "CABLE",
      planAmount: "",
    });
  };

  const isMobile = window.innerWidth <= 768;

  const styles = {
    container: { 
      minHeight: "100vh", 
      background: "#F8FAFC",
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)",
      padding: isMobile ? "16px" : "20px",
      borderRadius: isMobile ? "0 0 24px 24px" : "0 0 30px 30px",
      color: "white",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    headerTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isMobile ? "10px" : "16px",
    },
    logo: { 
      display: "flex", 
      alignItems: "center", 
      gap: "12px", 
      fontWeight: "800", 
      fontSize: isMobile ? "18px" : "22px",
      color: "white",
    },
    logoIcon: { width: isMobile ? "32px" : "40px", height: isMobile ? "32px" : "40px" },
    logoutBtn: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      padding: isMobile ? "8px 16px" : "10px 20px",
      borderRadius: "25px",
      color: "white",
      cursor: "pointer",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: "500",
    },
    content: { 
      padding: isMobile ? "16px" : "24px", 
      maxWidth: "1400px", 
      margin: "0 auto",
    },
    welcomeText: {
      fontSize: isMobile ? "18px" : "24px", 
      fontWeight: "700",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
      gap: isMobile ? "12px" : "20px",
      marginBottom: isMobile ? "20px" : "30px",
    },
    statCard: {
      background: "white",
      padding: isMobile ? "16px" : "24px",
      borderRadius: isMobile ? "16px" : "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      textAlign: "center",
    },
    statLabel: { fontSize: isMobile ? "12px" : "14px", color: "#64748B", marginBottom: "6px", fontWeight: "500" },
    statValue: { fontSize: isMobile ? "28px" : "36px", fontWeight: "800", color: "#1E3A5F" },
    sectionTitle: {
      fontSize: isMobile ? "18px" : "22px",
      fontWeight: "700",
      color: "#1E293B",
      marginBottom: isMobile ? "16px" : "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    addBtn: {
      background: "linear-gradient(135deg, #3B82F6, #1E3A5F)",
      color: "white",
      border: "none",
      padding: isMobile ? "10px 18px" : "12px 24px",
      borderRadius: isMobile ? "10px" : "12px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: isMobile ? "13px" : "14px",
      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    },
    tableWrapper: {
      overflowX: "auto",
      background: "white",
      borderRadius: isMobile ? "16px" : "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    },
    table: {
      width: "100%",
      background: "white",
      borderCollapse: "collapse",
      minWidth: isMobile ? "600px" : "auto",
    },
    th: { 
      padding: isMobile ? "14px 12px" : "16px", 
      textAlign: "left", 
      background: "#F1F5F9", 
      fontWeight: "600", 
      color: "#475569", 
      fontSize: isMobile ? "12px" : "14px",
      borderBottom: "2px solid #E2E8F0",
    },
    td: { 
      padding: isMobile ? "14px 12px" : "16px", 
      borderBottom: "1px solid #F1F5F9", 
      fontSize: isMobile ? "13px" : "14px",
      color: "#334155",
    },
    actionBtn: {
      padding: isMobile ? "6px 12px" : "8px 14px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: isMobile ? "4px" : "8px",
      fontSize: isMobile ? "10px" : "12px",
    },
    editBtn: { background: "#3B82F6", color: "white" },
    deleteBtn: { background: "#EF4444", color: "white" },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "15px",
    },
    modalContent: {
      background: "white",
      padding: isMobile ? "20px" : "30px",
      borderRadius: isMobile ? "16px" : "20px",
      width: "100%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    modalBtns: { display: "flex", gap: "10px", marginTop: "20px" },
    saveBtn: { flex: 1, padding: "12px", background: "#1E3A5F", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
    cancelBtn: { flex: 1, padding: "12px", background: "#E2E8F0", color: "#1E293B", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <svg style={styles.logoIcon} viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="adminLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff"/>
                  <stop offset="100%" stopColor="#e0e7ff"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="rgba(255,255,255,0.2)"/>
              <path d="M25 65 C30 55, 40 45, 50 45 C60 45, 70 55, 75 65" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none"/>
              <path d="M45 30 L55 30 L50 55 Z" fill="#fff"/>
            </svg>
            <div>
              <div style={{ fontSize: isMobile ? "16px" : "20px" }}>WAVE INIT</div>
              <div style={{ fontSize: isMobile ? "10px" : "12px", opacity: 0.8, fontWeight: "500" }}>Admin Panel</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
        <div style={styles.welcomeText}>Welcome, {user?.name}!</div>
      </div>

      <div style={styles.content}>
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, borderLeft: "4px solid #3B82F6"}}>
            <div style={styles.statLabel}>Total Customers</div>
            <div style={{...styles.statValue, color: "#3B82F6"}}>{dashboard.totalCustomers}</div>
          </div>
          <div style={{...styles.statCard, borderLeft: "4px solid #10B981"}}>
            <div style={styles.statLabel}>Active Customers</div>
            <div style={{...styles.statValue, color: "#10B981"}}>{dashboard.activeCustomers}</div>
          </div>
          <div style={{...styles.statCard, borderLeft: "4px solid #F59E0B"}}>
            <div style={styles.statLabel}>Total Pending (₹)</div>
            <div style={{ ...styles.statValue, color: "#F59E0B" }}>{dashboard.totalPending?.toFixed(2) || "0.00"}</div>
          </div>
        </div>

        <div style={styles.sectionTitle}>
          <span>Customer Management</span>
          <button style={styles.addBtn} onClick={() => { resetForm(); setShowModal(true); }}>+ Add Customer</button>
        </div>

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {customers.map((customer) => (
              <div key={customer.id} style={{ 
                background: "white", 
                borderRadius: "16px", 
                padding: "16px", 
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "16px", color: "#1E3A5F" }}>{customer.name}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>{customer.customerId}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ ...styles.actionBtn, ...styles.editBtn }} onClick={() => handleEdit(customer)}>Edit</button>
                    <button style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={() => handleDelete(customer.customerId)}>Delete</button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                  <div><span style={{ color: "#64748B" }}>Mobile:</span> <strong>{customer.mobile}</strong></div>
                  <div><span style={{ color: "#64748B" }}>Plan:</span> <strong>{customer.planType}</strong></div>
                  <div><span style={{ color: "#64748B" }}>Amount:</span> <strong>₹{customer.planAmount}</strong></div>
                  <div style={{ color: customer.pendingAmount > 0 ? "#EF4444" : "#10B981" }}>
                    <span style={{ color: "#64748B" }}>Pending:</span> <strong>₹{customer.pendingAmount}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Mobile</th>
                  <th style={styles.th}>Plan</th>
                  <th style={styles.th}>Plan Amount</th>
                  <th style={styles.th}>Pending</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td style={styles.td}><strong>{customer.customerId}</strong></td>
                    <td style={styles.td}>{customer.name}</td>
                    <td style={styles.td}>{customer.mobile}</td>
                    <td style={styles.td}>{customer.planType}</td>
                    <td style={styles.td}>₹{customer.planAmount}</td>
                    <td style={{...styles.td, color: customer.pendingAmount > 0 ? "#EF4444" : "#10B981"}}>
                      ₹{customer.pendingAmount}
                    </td>
                    <td style={styles.td}>
                      <button style={{ ...styles.actionBtn, ...styles.editBtn }} onClick={() => handleEdit(customer)}>Edit</button>
                      <button style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={() => handleDelete(customer.customerId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {customers.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748B", background: "white", borderRadius: "16px" }}>
            No customers found. Add your first customer!
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: "20px", color: "#1E293B" }}>
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Customer ID (e.g., STB001, WIFI001)"
                style={styles.input}
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
                disabled={editingCustomer}
              />
              <input
                type="text"
                placeholder="Customer Name"
                style={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                style={styles.input}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Address"
                style={styles.input}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <select
                style={styles.select}
                value={formData.planType}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
              >
                <option value="CABLE">Cable TV</option>
                <option value="WIFI">WiFi Broadband</option>
                <option value="COMBO">Combo (Cable + WiFi)</option>
              </select>
              <input
                type="number"
                placeholder="Plan Amount (₹)"
                style={styles.input}
                value={formData.planAmount}
                onChange={(e) => setFormData({ ...formData, planAmount: e.target.value })}
                required
              />
              <div style={styles.modalBtns}>
                <button type="button" style={styles.cancelBtn} onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>{editingCustomer ? "Update" : "Add Customer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
