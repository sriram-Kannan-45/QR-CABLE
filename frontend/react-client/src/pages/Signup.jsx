import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../config";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%)",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      padding: "40px",
      borderRadius: "20px",
      background: "rgba(255,255,255,0.95)",
      boxShadow: "0px 20px 60px rgba(0,0,0,0.3)",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "30px",
    },
    logoText: {
      fontWeight: "bold",
      fontSize: "28px",
      color: "#1E3A5F",
    },
    title: {
      fontSize: "24px",
      marginBottom: "8px",
      fontWeight: "700",
      color: "#1E293B",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "14px",
      color: "#64748B",
      marginBottom: "30px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      marginBottom: "18px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "16px",
      outline: "none",
      transition: "0.3s",
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
    success: {
      color: "#10B981",
      marginBottom: "15px",
      fontSize: "14px",
      textAlign: "center",
    },
    link: {
      color: "#3B82F6",
      textDecoration: "none",
      fontWeight: "500",
    },
    footer: {
      marginTop: "20px",
      textAlign: "center",
      fontSize: "14px",
      color: "#64748B",
    },
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
        }));
        navigate("/home");
      } else {
        setError(data.token || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={{ fontSize: "32px" }}>⎔</span>
          <span style={styles.logoText}>QR-CABLE</span>
        </div>

        <div style={styles.title}>Create Account</div>
        <div style={styles.subtitle}>Sign up for QR-CABLE</div>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone number"
            style={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
