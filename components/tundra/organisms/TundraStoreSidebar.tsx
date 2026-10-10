import React from "react";
import { STORES_DOMENS } from "@/constants";
import { useStoreContext } from "@/components/services_tabs/context/StoreContext";
import { TundraTypography } from "../atoms/TundraTypography";
import { TundraBadge } from "../atoms/TundraBadge";

export const TundraStoreSidebar = () => {
	const { selectedStores, toggleStore, selectAll, deselectAll } = useStoreContext();
	const isAllSelected = selectedStores.length === STORES_DOMENS.length;

	return (
		<div style={{
			width: "300px",
			height: "100%",
			backgroundColor: "var(--surface)",
			borderRight: "1px solid var(--line)",
			display: "flex",
			flexDirection: "column",
			padding: "24px",
			boxSizing: "border-box",
			position: "sticky",
			top: 0
		}}>
			<div style={{ marginBottom: "24px" }}>
				<TundraTypography variant="display" size="sm" weight="bold" style={{ marginBottom: "16px", display: "block" }}>
					Выбор магазинов
				</TundraTypography>

				<div style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "20px",
					padding: "12px",
					backgroundColor: "var(--page)",
					borderRadius: "8px",
					border: "1px solid var(--line)"
				}}>
					<TundraTypography variant="text" size="sm" weight="medium">
						Выбрано: {selectedStores.length}
					</TundraTypography>
					<div style={{ display: "flex", gap: "8px" }}>
						<button
							onClick={selectAll}
							style={{
								fontSize: "12px",
								padding: "4px 8px",
								borderRadius: "4px",
								border: "1px solid var(--line)",
								backgroundColor: "var(--surface)",
								cursor: "pointer",
								fontFamily: "var(--font-text)",
								color: "var(--ink-2)"
							}}
						>
							Все
						</button>
						<button
							onClick={deselectAll}
							style={{
								fontSize: "12px",
								padding: "4px 8px",
								borderRadius: "4px",
								border: "1px solid var(--line)",
								backgroundColor: "var(--surface)",
								cursor: "pointer",
								fontFamily: "var(--font-text)",
								color: "var(--ink-2)"
							}}
						>
							Сброс
						</button>
					</div>
				</div>
			</div>

			<div style={{
				flex: 1,
				overflowY: "auto",
				display: "flex",
				flexDirection: "column",
				gap: "8px",
				paddingRight: "8px"
			}}>
				{STORES_DOMENS.map((domen) => (
					<label key={domen} style={{
						display: "flex",
						alignItems: "center",
						gap: "10px",
						padding: "8px 12px",
						borderRadius: "6px",
						cursor: "pointer",
						transition: "background 0.2s",
						backgroundColor: selectedStores.includes(domen) ? "var(--accent-tint)" : "transparent",
						border: selectedStores.includes(domen) ? "1px solid var(--accent)" : "1px solid transparent",
					}}>
						<input
							type="checkbox"
							checked={selectedStores.includes(domen)}
							onChange={() => toggleStore(domen)}
							style={{ accentColor: "var(--accent)" }}
						/>
						<TundraTypography
							variant="text"
							size="sm"
							weight={selectedStores.includes(domen) ? "bold" : "normal"}
							color={selectedStores.includes(domen) ? "ink" : "ink-2"}
						>
							{domen}
						</TundraTypography>
					</label>
				))}
			</div>
		</div>
	);
};
