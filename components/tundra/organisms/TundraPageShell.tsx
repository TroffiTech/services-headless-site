import React from "react";
import { TundraHeader } from "../organisms/TundraHeader";

interface TundraPageShellProps {
  children: React.ReactNode;
  userEmail?: string;
  onLogout?: () => void;
}

export const TundraPageShell = ({ children, userEmail, onLogout }: TundraPageShellProps) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "var(--page)",
      fontFamily: "var(--font-text)",
      color: "var(--ink)",
    }}>
      <TundraHeader userEmail={userEmail} onLogout={onLogout} />

      <main style={{
        flex: 1,
        padding: "32px",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}>
        {children}
      </main>

      <footer style={{
        padding: "20px",
        textAlign: "center",
        fontSize: "12px",
        color: "var(--soft)",
        borderTop: "1px solid var(--line)",
        backgroundColor: "var(--surface)"
      }}>
        © {new Date().getFullYear()} Troffi Services • Corporate Internal Tool
      </footer>
    </div>
  );
};
