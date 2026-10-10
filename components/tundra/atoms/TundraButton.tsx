import React from "react";

interface TundraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const TundraButton = ({
  variant = "primary",
  isLoading = false,
  children,
  style,
  ...props
}: TundraButtonProps) => {
  const variants = {
    primary: {
      backgroundColor: "var(--accent)",
      color: "white",
      boxShadow: "0 4px 12px rgba(232, 112, 42, 0.3)",
      hoverBg: "var(--accent-dark)",
    },
    secondary: {
      backgroundColor: "var(--steel)",
      color: "white",
      boxShadow: "0 4px 12px rgba(46, 65, 83, 0.2)",
      hoverBg: "var(--steel-2)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--accent)",
      boxShadow: "none",
      hoverBg: "var(--accent-tint)",
    },
  };

  const currentVariant = variants[variant];

  return (
    <button
      {...props}
      style={{
        padding: "12px 24px",
        borderRadius: "8px",
        border: variant === "ghost" ? "1px solid var(--line)" : "none",
        cursor: isLoading ? "not-allowed" : "pointer",
        fontWeight: "700",
        fontSize: "15px",
        fontFamily: "var(--font-display)",
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
        boxShadow: currentVariant.boxShadow,
        ...style,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = currentVariant.hoverBg;
        if (variant === "ghost") e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = currentVariant.backgroundColor;
        if (variant === "ghost") e.currentTarget.style.borderColor = "var(--line)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <>
          <span className="tundra-spinner" style={{
            width: "16px",
            height: "16px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "white",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          Processing...
        </>
      ) : (
        children
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
