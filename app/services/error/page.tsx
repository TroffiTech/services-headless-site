"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

import { TundraPageShell } from "@/components/tundra/organisms/TundraPageShell";
import { TundraCard } from "@/components/tundra/molecules/TundraCard";
import { TundraTypography } from "@/components/tundra/atoms/TundraTypography";
import { TundraButton } from "@/components/tundra/atoms/TundraButton";

function ErrorContent() {
	const searchParams = useSearchParams();
	const errorMessage = searchParams.get("error");
	const sku = searchParams.get("sku");

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			minHeight: "60vh",
			textAlign: "center"
		}}>
			<TundraTypography variant="display" size="xl" weight="bold" color="ink-2" style={{ fontSize: "120px", marginBottom: "0" }}>
				500
			</TundraTypography>
			<TundraTypography variant="text" size="lg" style={{ marginBottom: "32px" }}>
				😵😵😵
			</TundraTypography>

			<TundraCard style={{ maxWidth: "600px", padding: "32px", textAlign: "center" }}>
				<TundraTypography variant="text" size="md" weight="medium" style={{ marginBottom: "16px" }}>
					{errorMessage || "Что-то сломалось.. Попробуйте позже либо проверьте введенные данные."}
				</TundraTypography>

				{sku && (
					<TundraTypography variant="text" size="sm" color="soft" style={{ marginBottom: "24px" }}>
						Артикул: <span style={{ color: "var(--ink)", fontWeight: "bold" }}>{sku}</span>
					</TundraTypography>
				)}

				<div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "24px" }}>
					<TundraButton
						variant="secondary"
						onClick={() => window.history.back()}
					>
						Вернуться и исправить
					</TundraButton>
					<Link href="/services">
						<TundraButton variant="primary">
							Создать новый товар
						</TundraButton>
					</Link>
				</div>
			</TundraCard>
		</div>
	);
}

export default function ErrorPage() {
	return (
		<TundraPageShell>
			<Suspense
				fallback={
					<div style={{ textAlign: "center", padding: "50px" }}>
						<TundraTypography variant="text">Загрузка...</TundraTypography>
					</div>
				}
			>
				<ErrorContent />
			</Suspense>
		</TundraPageShell>
	);
}
