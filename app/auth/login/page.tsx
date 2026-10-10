"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const router = useRouter();

  const handleAuthAction = async (mode: "login" | "register" | "forgot") => {
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/services");
          router.refresh();
        }
      } else if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Registration failed");
        setError(data.message);
      } else if (mode === "forgot") {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Reset failed");
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction(authMode);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          backgroundColor: "#0070f3",
          color: "white",
          padding: "30px 20px",
          textAlign: "center",
          position: "relative"
        }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
            {authMode === "login" && "Troffi Services Login"}
            {authMode === "register" && "Create Account"}
            {authMode === "forgot" && "Reset Password"}
          </h1>
          <p style={{ opacity: 0.9, fontSize: "14px", marginTop: "8px" }}>
            Secure access for @troffi.ru employees
          </p>
        </div>

        <div style={{ padding: "30px 20px" }}>
          {error && (
            <div style={{
              backgroundColor: error.includes("successfully") || error.includes("sent") ? "#dcfce7" : "#fee2e2",
              color: error.includes("successfully") || error.includes("sent") ? "#166534" : "#dc2626",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "14px",
              border: `1px solid ${error.includes("successfully") || error.includes("sent") ? "#bbf7d0" : "#ef4444"}`,
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@troffi.ru"
                required
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
              />
            </div>

            {authMode === "login" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={authMode === "login"}
                    style={{ width: "100%", padding: "12px", paddingRight: "45px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "#666"
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0062cc"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#0070f3"}
            >
              {loading ? "Processing..." : (
                authMode === "login" ? "Login" :
                authMode === "register" ? "Register Account" : "Send New Password"
              )}
            </button>
          </form>

          <div style={{ marginTop: "25px", textAlign: "center", fontSize: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {authMode === "login" && (
              <>
                <button
                  onClick={() => { setAuthMode("forgot"); setError(""); }}
                  style={{ background: "none", border: "none", color: "#0070f3", cursor: "pointer", textDecoration: "underline" }}
                >
                  Forgot Password?
                </button>
                <p style={{ color: "#666" }}>
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setAuthMode("register"); setError(""); }}
                    style={{ background: "none", border: "none", color: "#0070f3", cursor: "pointer", fontWeight: "bold", padding: 0 }}
                  >
                    Register here
                  </button>
                </p>
              </>
            )}
            {authMode !== "login" && (
              <button
                onClick={() => { setAuthMode("login"); setError(""); }}
                style={{ background: "none", border: "none", color: "#0070f3", cursor: "pointer", textDecoration: "underline", margin: "0 auto" }}
              >
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
