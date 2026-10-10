import Link from "next/link";

import { TundraPageShell } from "@/components/tundra/organisms/TundraPageShell";
import { TundraCard } from "@/components/tundra/molecules/TundraCard";
import { TundraTypography } from "@/components/tundra/atoms/TundraTypography";
import { TundraButton } from "@/components/tundra/atoms/TundraButton";

export default async function SuccsessPage(query: {
	searchParams: Promise<{ store: string; sku: string; price: string }>;
}) {
	const { store, sku, price } = await query.searchParams;

	return (
		<TundraPageShell>
			<div style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "60vh",
				textAlign: "center"
			}}>
				<TundraTypography variant="display" size="xl" weight="bold" style={{ marginBottom: "16px" }}>
					🥳 Успешно!
				</TundraTypography>

				<TundraCard style={{ maxWidth: "600px", padding: "32px", width: "100%" }}>
					<div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
						<div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
							<TundraTypography variant="text" color="soft">Адрес магазина</TundraTypography>
							<TundraTypography variant="text" weight="medium">{store}</TundraTypography>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
							<TundraTypography variant="text" color="soft">Артикул товара</TundraTypography>
							<TundraTypography variant="text" weight="medium">{sku}</TundraTypography>
						</div>
						{price && (
							<div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
								<TundraTypography variant="text" color="soft">Новая цена</TundraTypography>
								<TundraTypography variant="text" weight="medium">{price} руб.</TundraTypography>
							</div>
						)}
					</div>

					<Link href="/services" style={{ width: "100%" }}>
						<TundraButton variant="primary" style={{ width: "100%" }}>
							Вернуться в сервисы
						</TundraButton>
					</Link>
				</TundraCard>
			</div>
		</TundraPageShell>
	);
}
