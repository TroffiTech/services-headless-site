import React from "react";

interface TundraCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  padding?: string;
}

export const TundraCard = ({
  children,
  style,
  className,
  padding = "30px",
}: TundraCardProps) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(28, 33, 39, 0.08)",
        border: "1px solid var(--line)",
        overflow: "hidden",
        padding: padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
