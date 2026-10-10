import React from "react";

interface TundraTabNavigationProps {
  activeTab: number;
  setActiveTab: (id: number) => void;
  tabs: { id: number; title: string }[];
}

export const TundraTabNavigation = ({ activeTab, setActiveTab, tabs }: TundraTabNavigationProps) => {
  return (
    <div style={{
      display: "flex",
      gap: "8px",
      marginBottom: "32px",
      borderBottom: "1px solid var(--line)",
      paddingBottom: "0"
    }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              border: "none",
              backgroundColor: "transparent",
              color: isActive ? "var(--accent)" : "var(--ink-2)",
              fontWeight: isActive ? "700" : "500",
              fontSize: "15px",
              fontFamily: "var(--font-display)",
              transition: "all 0.2s ease",
              borderBottom: isActive ? `3px solid var(--accent)` : "3px solid transparent",
              marginBottom: "-1px", // Overlay the borderBottom of the container
            }}
            onMouseOver={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--ink)";
            }}
            onMouseOut={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--ink-2)";
            }}
          >
            {tab.title}
          </button>
        );
      })}
    </div>
  );
};
