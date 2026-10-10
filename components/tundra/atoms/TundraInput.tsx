import React, { forwardRef } from "react";

interface TundraInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TundraInput = forwardRef<HTMLInputElement, TundraInputProps>(({
  label,
  error,
  style,
  ...props
}, ref) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "100%",
    }}>
      {label && (
        <label style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "var(--ink-2)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontFamily: "var(--font-text)",
        }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          border: `1px solid ${error ? "var(--err)" : "var(--line)"}`,
          boxSizing: "border-box",
          fontSize: "15px",
          fontFamily: props.type === "password" ? "var(--font-mono)" : "var(--font-text)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          outline: "none",
          color: "var(--ink)",
          backgroundColor: "var(--surface)",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? "var(--err)" : "var(--accent)";
          e.currentTarget.style.boxShadow = error ? "0 0 0 3px var(--err-bg)" : "0 0 0 3px var(--accent-tint)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "var(--err)" : "var(--line)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {error && (
        <span style={{
          fontSize: "12px",
          color: "var(--err)",
          fontWeight: "500",
          fontFamily: "var(--font-text)",
        }}>
          {error}
        </span>
      )}
    </div>
  );
});

TundraInput.displayName = "TundraInput";
