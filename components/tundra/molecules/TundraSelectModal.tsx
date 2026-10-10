import React from "react";
import { TundraTypography } from "../atoms/TundraTypography";
import { TundraButton } from "../atoms/TundraButton";

interface TundraSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  title: string;
}

export const TundraSelectModal = ({
  isOpen,
  onClose,
  options,
  selected,
  onSelect,
  title,
}: TundraSelectModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(28, 33, 39, 0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        backgroundColor: "var(--surface)",
        width: "100%",
        maxWidth: "400px",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        overflow: "hidden",
        animation: "slideUp 0.3s ease-out",
      }}>
        <div style={{
          padding: "20px",
          backgroundColor: "var(--graphite)",
          color: "var(--surface)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <TundraTypography variant="display" size="md" weight="bold" style={{ color: "var(--surface)" }}>
            {title}
          </TundraTypography>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--surface)",
              cursor: "pointer",
              fontSize: "20px",
              padding: "0 5px"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: "10px 0"
        }}>
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => onSelect(option)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                cursor: "pointer",
                transition: "background 0.2s",
                backgroundColor: selected === option ? "var(--accent-tint)" : "transparent",
                borderLeft: selected === option ? "4px solid var(--accent)" : "4px solid transparent",
              }}
              onMouseOver={(e) => {
                if (selected !== option) e.currentTarget.style.backgroundColor = "var(--page)";
              }}
              onMouseOut={(e) => {
                if (selected !== option) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <TundraTypography
                variant="text"
                color={selected === option ? "ink" : "ink-2"}
                weight={selected === option ? "bold" : "normal"}
              >
                {`${index + 1}. ${option}`}
              </TundraTypography>
              {selected === option && (
                <span style={{ color: "var(--accent)", fontWeight: "bold" }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
