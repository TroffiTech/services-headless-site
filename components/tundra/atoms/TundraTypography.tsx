import React from "react";

interface TundraTypographyProps {
  variant: "display" | "text" | "mono";
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  weight?: "normal" | "medium" | "bold";
  color?: "ink" | "ink-2" | "soft" | "accent";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TundraTypography = ({
  variant = "text",
  size = "md",
  weight = "normal",
  color = "ink",
  children,
  className,
  style,
}: TundraTypographyProps) => {
  const fontMap = {
    display: "var(--font-display)",
    text: "var(--font-text)",
    mono: "var(--font-mono)",
  };

  const sizeMap = {
    sm: "12px",
    md: "14px",
    lg: "18px",
    xl: "24px",
    xxl: "32px",
  };

  const weightMap = {
    normal: "400",
    medium: "500",
    bold: "700",
  };

  const colorMap = {
    ink: "var(--ink)",
    "ink-2": "var(--ink-2)",
    soft: "var(--soft)",
    accent: "var(--accent)",
  };

  const combinedStyle: React.CSSProperties = {
    fontFamily: fontMap[variant],
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    lineHeight: "1.5",
    ...style,
  };

  return <span className={className} style={combinedStyle}>{children}</span>;
};
