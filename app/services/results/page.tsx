"use client";

import Link from "next/link";
import { use } from "react";

import { TundraPageShell } from "@/components/tundra/organisms/TundraPageShell";
import { TundraCard } from "@/components/tundra/molecules/TundraCard";
import { TundraTypography } from "@/components/tundra/atoms/TundraTypography";
import { TundraButton } from "@/components/tundra/atoms/TundraButton";

export default function ResultsPage({
	searchParams,
}: {
	searchParams: Promise<{ sku: string; price: string; success?: string; notFound?: string; failed?: string }>;
}) {
	const { sku, price, success, notFound, failed } = use(searchParams);
	const successfulStores = success ? success.split(",") : [];
	const notFoundStores = notFound ? notFound.split(",") : [];
	const failedStores = failed ? failed.split(",") : [];

	const totalStores = successfulStores.length + notFoundStores.length + failedStores.length;
	const isFullSuccess = failedStores.length === 0 && notFoundStores.length === 0 && totalStores > 0;
	const isFullFailure = successfulStores.length === 0 && notFoundStores.length === 0 && totalStores > 0;

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
					{isFullSuccess ? "🥳 Все обновлено!" : isFullFailure ? "😵 Ошибка обновления" : "⚠️ Частичный успех"}
				</TundraTypography>

				<TundraCard style={{ maxWidth: "600px", padding: "32px", width: "100%" }}>
					<div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
						<div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
							<TundraTypography variant="text" size="sm" color="soft">Товар</TundraTypography>
							<TundraTypography variant="text" weight="medium">{sku} — {price} руб.</TundraTypography>
						</div>

						{successfulStores.length > 0 && (
							<div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", padding: "12px", backgroundColor: "var(--accent-tint)", borderRadius: "8px", border: "1px solid var(--accent)" }}>
								<TundraTypography variant="text" size="sm" weight="bold" color="ink" style={{ color: "var(--accent)" }}>
									✅ Успешно обновлено ({successfulStores.length})
								</TundraTypography>
								<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
									{successfulStores.map((s, i) => (
										<TundraTypography key={i} variant="text" size="sm" weight="medium" style={{ backgroundColor: "var(--surface)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--line)" }}>
											{s}
										</TundraTypography>
									))}
								</div>
							</div>
						)}

						{notFoundStores.length > 0 && (
							<div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", padding: "12px", backgroundColor: "var(--warning-tint)", borderRadius: "8px", border: "1px solid var(--warning)" }}>
								<TundraTypography variant="text" size="sm" weight="bold" color="ink" style={{ color: "var(--warning)" }}>
									⚠️ Товар не найден ({notFoundStores.length})
								</TundraTypography>
								<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
									{notFoundStores.map((s, i) => (
										<TundraTypography key={i} variant="text" size="sm" weight="medium" style={{ backgroundColor: "var(--surface)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--line)" }}>
											{s}
										</TundraTypography>
									))}
								</div>
							</div>
						)}

						{failedStores.length > 0 && (
							<div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", padding: "12px", backgroundColor: "var(--err-tint)", borderRadius: "8px", border: "1px solid var(--err)" }}>
								<TundraTypography variant="text" size="sm" weight="bold" color="ink" style={{ color: "var(--err)" }}>
									❌ Ошибка ({failedStores.length})
								</TundraTypography>
								<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
									{failedStores.map((s, i) => (
										<TundraTypography key={i} variant="text" size="sm" weight="medium" style={{ backgroundColor: "var(--surface)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--line)" }}>
											{s}
										</TundraTypography>
									))}
								</div>
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
