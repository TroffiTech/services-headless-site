import { Dispatch, SetStateAction, useState } from "react";

import { STORES_DOMENS } from "@/constants";
import { TundraSelectModal } from "@/components/tundra/molecules/TundraSelectModal";
import { TundraTypography } from "@/components/tundra/atoms/TundraTypography";

export default function StoreDomenSelector({
	value,
	valueSetter,
}: {
	value: string;
	valueSetter: Dispatch<SetStateAction<string>>;
}) {
	const [isDropped, setIsDropped] = useState(false);

	return (
		<>
			<div
				onClick={() => setIsDropped(true)}
				style={{
					display: "flex",
					alignItems: "center",
					gap: "8px",
					padding: "12px 16px",
					backgroundColor: "var(--surface)",
					border: "1px solid var(--line)",
					borderRadius: "8px",
					cursor: "pointer",
					transition: "all 0.2s",
					width: "100%",
					marginBottom: "20px",
				}}
				onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
				onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
			>
				<span style={{ color: "var(--accent)", fontWeight: "bold" }}>👉</span>
				<TundraTypography variant="text" weight="medium" color="ink">
					{value}
				</TundraTypography>
			</div>
			<TundraSelectModal
				isOpen={isDropped}
				onClose={() => setIsDropped(false)}
				options={STORES_DOMENS}
				selected={value}
				onSelect={(val) => {
					valueSetter(val);
					setIsDropped(false);
				}}
				title="Выберите магазин"
			/>
		</>
	);
}
