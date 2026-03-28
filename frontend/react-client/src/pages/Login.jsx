import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("=== Login Attempt ===");
    console.log("API URL:", `${API_BASE_URL}/auth/login`);
    console.log("Login type:", loginType);
    console.log("User ID:", userId);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ userId, password, loginType }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.token) {
        console.log("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          id: data.customerId || data.userId,
          customerId: data.customerId,
          name: data.name,
          loginType: data.loginType,
          mobile: data.mobile || "",
          address: data.address || "",
          planType: data.planType || "",
          planAmount: data.planAmount || 0,
          pendingAmount: data.pendingAmount || 0,
        }));
        
        if (data.loginType === "admin") {
          navigate("/admin");
        } else {
          navigate("/customer");
        }
      } else {
        console.log("Login failed:", data.message);
        setError(data.message || data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error (catch):", err);
      console.error("Error message:", err.message);
      setError("Cannot connect to server. Please check if backend is running on http://localhost:5555");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>

      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <svg style={styles.logoIconSvg} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </linearGradient>
                <linearGradient id="swooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="url(#wiGrad)" opacity="0.1"/>
              <ellipse cx="50" cy="52" rx="28" ry="22" stroke="url(#wiGrad)" strokeWidth="5" fill="none"/>
              <text x="28" y="65" fontSize="32" fontWeight="800" fill="url(#wiGrad)" fontFamily="Poppins, sans-serif">W</text>
              <text x="58" y="65" fontSize="32" fontWeight="800" fill="url(#wiGrad)" fontFamily="Poppins, sans-serif">I</text>
              <path d="M15 75 Q50 85 85 70" stroke="url(#swooshGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <h1 style={styles.logoText}>WAVE INIT</h1>
          <p style={styles.tagline}>Digital Payments</p>
        </div>

        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>Welcome Back</h2>
          <p style={styles.welcomeSubtitle}>Login to continue</p>
        </div>

        <div style={styles.tabsContainer}>
          <button
            type="button"
            style={{
              ...styles.tab,
              ...(loginType === "customer" ? styles.tabActive : {}),
            }}
            onClick={() => setLoginType("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            style={{
              ...styles.tab,
              ...(loginType === "admin" ? styles.tabActive : {}),
            }}
            onClick={() => setLoginType("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={{
              ...styles.inputWrapper,
              ...(focusedInput === "userId" ? styles.inputFocused : {}),
            }}>
              <input
                type="text"
                placeholder={loginType === "admin" ? "Admin ID" : "Customer ID / STB ID"}
                style={styles.input}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onFocus={() => setFocusedInput("userId")}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>

            <div style={{
              ...styles.inputWrapper,
              ...(focusedInput === "password" ? styles.inputFocused : {}),
            }}>
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.buttonLoader}></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div style={styles.hintBox}>
          <div style={styles.hintText}>
            {loginType === "admin" ? (
              <>
                <strong>Admin:</strong> ID: 123WAVE | Pass: sriram123@
              </>
            ) : (
              <>
                Use your Set-Top Box ID or WiFi ID as password
              </>
            )}
          </div>
        </div>

        <div style={styles.footer}>
          <span style={styles.footerText}>Secure & Encrypted</span>
        </div>
      </div>

      <div style={styles.brandBadge}>
        Powered by <strong>WAVE INIT</strong>
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-5deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.05); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const styles = {
  container: {
    minHeight: "100vh",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "15px",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  },
  backgroundShapes: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 0,
  },
  shape1: {
    position: "absolute",
    top: "-10%",
    right: "-5%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)",
    filter: "blur(60px)",
    animation: "pulse 8s ease-in-out infinite",
  },
  shape2: {
    position: "absolute",
    bottom: "-10%",
    left: "-10%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(78,205,196,0.25) 0%, transparent 70%)",
    filter: "blur(80px)",
    animation: "pulse 10s ease-in-out infinite reverse",
  },
  shape3: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,195,113,0.2) 0%, transparent 70%)",
    filter: "blur(60px)",
    animation: "pulse 12s ease-in-out infinite",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    maxHeight: "90vh",
    padding: "30px 25px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
    position: "relative",
    zIndex: 1,
    animation: "fadeInUp 0.6s ease-out",
    overflow: "hidden",
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logoIcon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 12px",
    position: "relative",
    animation: "float 6s ease-in-out infinite",
  },
  logoIconSvg: {
    width: "100%",
    height: "100%",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "800",
    margin: 0,
    background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "1px",
  },
  tagline: {
    fontSize: "10px",
    color: "rgba(255, 255, 255, 0.45)",
    margin: "4px 0 0 0",
    fontWeight: "500",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  welcomeSection: {
    textAlign: "center",
    marginBottom: "15px",
  },
  welcomeTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 5px 0",
  },
  welcomeSubtitle: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.5)",
    margin: 0,
  },
  tabsContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "18px",
    background: "rgba(0, 0, 0, 0.2)",
    padding: "5px",
    borderRadius: "12px",
  },
  tab: {
    flex: 1,
    padding: "12px 10px",
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "rgba(255, 255, 255, 0.6)",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0, 212, 255, 0.4)",
  },
  tabIcon: {
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputWrapper: {
    position: "relative",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    border: "1.5px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
  },
  inputFocused: {
    borderColor: "rgba(0, 212, 255, 0.6)",
    boxShadow: "0 0 0 4px rgba(0, 212, 255, 0.15), 0 4px 20px rgba(0,0,0,0.1)",
    transform: "scale(1.01)",
  },
  input: {
    flex: 1,
    padding: "14px",
    border: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    fontWeight: "500",
  },
  errorContainer: {
    padding: "10px 12px",
    background: "rgba(255, 77, 77, 0.15)",
    border: "1px solid rgba(255, 77, 77, 0.3)",
    borderRadius: "10px",
    color: "#ff6b6b",
    fontSize: "13px",
    fontWeight: "500",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 20px rgba(0, 212, 255, 0.3)",
    marginTop: "5px",
  },
  buttonLoading: {
    opacity: 0.8,
    cursor: "not-allowed",
  },
  buttonLoader: {
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  hintBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    marginTop: "15px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  hintText: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: "1.4",
    margin: 0,
    textAlign: "center",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "500",
  },
  brandBadge: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.3)",
    zIndex: 1,
  },
};

export default Login;
