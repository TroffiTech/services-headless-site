import React from "react";
import { TundraTypography } from "../atoms/TundraTypography";

interface TundraHeaderProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const TundraHeader = ({ userEmail, onLogout }: TundraHeaderProps) => {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px",
      backgroundColor: "var(--graphite)",
      color: "var(--surface)",
      borderBottom: "4px solid var(--accent)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "32px",
          height: "32px",
          backgroundColor: "var(--accent)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "18px",
          color: "white"
        }}>
          T
        </div>
        <TundraTypography variant="display" size="lg" weight="bold" style={{ color: "var(--surface)" }}>
          Troffi Services
        </TundraTypography>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {userEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#4ADE80",
              borderRadius: "50%",
            }} />
            <TundraTypography variant="text" size="sm" color="soft" style={{ color: "rgba(255,255,255,0.7)" }}>
              {userEmail}
            </TundraTypography>
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "var(--surface)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "var(--font-text)",
              fontWeight: "500"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            Выход
          </button>
        )}
      </div>
    </header>
  );
};
