import React from "react";
import { TundraTypography } from "../atoms/TundraTypography";

interface TundraBadgeProps {
  variant?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
}

export const TundraBadge = ({
  variant = "info",
  children,
}: TundraBadgeProps) => {
  const variants = {
    success: { bg: "var(--green-bg)", color: "var(--green)", border: "var(--green-bd)" },
    error: { bg: "var(--err-bg)", color: "var(--err)", border: "var(--err)" },
    warning: { bg: "var(--amber-bg)", color: "var(--amber)", border: "var(--amber-bd)" },
    info: { bg: "var(--grey-bg)", color: "var(--grey)", border: "var(--grey-bd)" },
  };

  const current = variants[variant];

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
      fontFamily: "var(--font-text)",
      backgroundColor: current.bg,
      color: current.color,
      border: `1px solid ${current.border}`,
    }}>
      {children}
    </span>
  );
};
