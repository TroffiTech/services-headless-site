"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { phrases } from "@/server_utils/i18n/phrases";
import { TundraButton } from "@/components/tundra/atoms/TundraButton";
import { TundraInput } from "@/components/tundra/atoms/TundraInput";
import { TundraTypography } from "@/components/tundra/atoms/TundraTypography";
import { TundraCard } from "@/components/tundra/molecules/TundraCard";

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
          setError(phrases.auth.login.invalidPassword);
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
        if (!response.ok) throw new Error(data.error || phrases.auth.login.genericError);
        setError(data.message || phrases.auth.register.success);
      } else if (mode === "forgot") {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || phrases.auth.login.genericError);
        setError(data.message || phrases.auth.forgot.success);
      }
    } catch (err: any) {
      setError(err.message || phrases.auth.login.genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction(authMode);
  };

  const isSuccess = error && (error.includes("успешно") || error.includes("отправлен"));

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "var(--page)",
      padding: "20px",
      fontFamily: "var(--font-text)",
    }}>
      <TundraCard style={{ width: "100%", maxWidth: "420px", overflow: "hidden" }}>
        <div style={{
          backgroundColor: "var(--graphite)",
          color: "var(--surface)",
          padding: "48px 32px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <TundraTypography variant="display" size="xl" weight="bold" style={{ color: "var(--surface)", margin: 0 }}>
            {authMode === "login" && phrases.auth.login.title}
            {authMode === "register" && phrases.auth.register.title}
            {authMode === "forgot" && phrases.auth.forgot.title}
          </TundraTypography>
          <TundraTypography variant="text" size="sm" style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {authMode === "login" && phrases.auth.login.subtitle}
            {authMode === "register" && phrases.auth.register.subtitle}
            {authMode === "forgot" && phrases.auth.forgot.subtitle}
          </TundraTypography>
        </div>

        <div style={{ padding: "32px" }}>
          {error && (
            <div style={{
              backgroundColor: isSuccess ? "var(--green-bg)" : "var(--err-bg)",
              color: isSuccess ? "var(--green)" : "var(--err)",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "14px",
              border: `1px solid ${isSuccess ? "var(--green-bd)" : "var(--err)"}`,
              textAlign: "center",
              fontWeight: "500",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TundraInput
              label={authMode === "login" ? phrases.auth.login.emailLabel :
                     authMode === "register" ? phrases.auth.register.emailLabel :
                     phrases.auth.forgot.emailLabel}
              placeholder={authMode === "login" ? phrases.auth.login.emailPlaceholder :
                           authMode === "register" ? phrases.auth.register.emailPlaceholder :
                           phrases.auth.forgot.emailPlaceholder}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {authMode === "login" && (
              <div style={{ position: "relative" }}>
                <TundraInput
                  label={phrases.auth.login.passwordLabel}
                  placeholder={phrases.auth.login.passwordPlaceholder}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "38px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "var(--soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            )}

            <TundraButton
              isLoading={loading}
              variant="primary"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {authMode === "login" ? phrases.auth.login.submit :
               authMode === "register" ? phrases.auth.register.submit : phrases.auth.forgot.submit}
            </TundraButton>
          </form>

          <div style={{
            marginTop: "32px",
            textAlign: "center",
            fontSize: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            color: "var(--ink-2)"
          }}>
            {authMode === "login" && (
              <>
                <TundraButton
                  variant="ghost"
                  onClick={() => { setAuthMode("forgot"); setError(""); }}
                  style={{ width: "auto", margin: "0 auto", padding: "4px 12px" }}
                >
                  {phrases.auth.login.forgotPassword}
                </TundraButton>
                <p style={{ margin: 0 }}>
                  {phrases.auth.login.noAccount}{" "}
                  <TundraButton
                    variant="ghost"
                    onClick={() => { setAuthMode("register"); setError(""); }}
                    style={{
                      width: "auto",
                      padding: "0",
                      display: "inline",
                      fontWeight: "700",
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      border: "none"
                    }}
                  >
                    {phrases.auth.login.registerLink}
                  </TundraButton>
                </p>
              </>
            )}
            {authMode !== "login" && (
              <TundraButton
                variant="ghost"
                onClick={() => { setAuthMode("login"); setError(""); }}
                style={{ width: "auto", margin: "0 auto", padding: "4px 12px" }}
              >
                Вернуться к входу
              </TundraButton>
            )}
          </div>
        </div>
      </TundraCard>
    </div>
  );
}
