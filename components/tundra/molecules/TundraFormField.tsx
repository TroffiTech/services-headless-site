import React from "react";
import { TundraTypography } from "../atoms/TundraTypography";
import { TundraBadge } from "../atoms/TundraBadge";

interface TundraFormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}

export const TundraFormField = ({
  label,
  children,
  error,
  required,
}: TundraFormFieldProps) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
      marginBottom: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <TundraTypography variant="text" size="sm" weight="bold" color="ink-2">
          {label}
        </TundraTypography>
        {required && <span style={{ color: "var(--err)" }}>*</span>}
      </div>

      {children}

      {error && (
        <TundraBadge variant="error">
          {error}
        </TundraBadge>
      )}
    </div>
  );
};
