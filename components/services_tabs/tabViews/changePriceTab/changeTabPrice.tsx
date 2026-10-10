import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import Sonner from "@/components/shared/sonner/Sonner";
import { TundraButton } from "@/components/tundra/atoms/TundraButton";
import { TundraTypography } from "@/components/tundra/atoms/TundraTypography";
import { TundraInput } from "@/components/tundra/atoms/TundraInput";
import { TundraFormField } from "@/components/tundra/molecules/TundraFormField";
import { TundraCard } from "@/components/tundra/molecules/TundraCard";
import { useStoreContext } from "@/components/services_tabs/context/StoreContext";

export default function ChangePriceNab() {
	const navigator = useRouter();
	const { selectedStores } = useStoreContext();
	const [isLoading, setIsLoading] = useState(false);
	const [isWarning, setIsWarning] = useState(false);
	const skuRef = useRef<HTMLInputElement | null>(null);
	const priceRef = useRef<HTMLInputElement | null>(null);

	async function submit(action: "price" | "hide") {
		if (
			!skuRef.current ||
			!priceRef.current ||
			skuRef.current.value === "" ||
			selectedStores.length === 0
		) {
			setIsWarning(true);
			setTimeout(() => setIsWarning(false), 2000);
			return;
		}

		if (action === "price" && priceRef.current.value === "") {
			setIsWarning(true);
			setTimeout(() => setIsWarning(false), 2000);
			return;
		}

		setIsLoading(true);

		try {
			const results = await Promise.allSettled(
				selectedStores.map(async (store) => {
					let requestData;
					if (action === "price") {
						requestData = {
							sku: skuRef.current!.value,
							price: priceRef.current!.value,
							domen: `https://${store}`,
						};
					} else {
						requestData = {
							sku: skuRef.current!.value,
							domen: `https://${store}`,
							post_status: "draft",
						};
					}

					const response = await fetch("/api/services/update-one", {
						method: "post",
						headers: {
							"content-type": "application/json",
						},
						body: JSON.stringify(requestData),
					});

					if (!response.ok) {
						throw new Error(`Store ${store} failed: ${response.statusText}`);
					}

					return response.json();
				})
			);

			const successful = results.filter(r => r.status === 'fulfilled').length;

			if (successful === 0) {
				navigator.push("/services/error");
			} else if (successful < selectedStores.length) {
				navigator.push(`/services/error?error=Partial update: ${successful}/${selectedStores.length} stores succeeded`);
			} else {
				navigator.push(
					`/services/succsess/?store=Multiple&sku=${skuRef.current?.value}&price=${priceRef.current?.value}`
				);
			}
		} catch (error) {
			console.error("Batch update error:", error);
			navigator.push("/services/error");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			{isLoading && <Sonner />}
			<TundraTypography variant="display" size="lg" weight="bold" style={{ marginBottom: "24px" }}>
				Обновить цену одной позиции в выбранном магазине
			</TundraTypography>

			<TundraCard style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<TundraFormField label="Артикул товара" required>
					<TundraInput
						ref={skuRef}
						spellCheck={false}
						type="text"
						name="sku"
						placeholder="AB.123.12.1"
						required
					/>
				</TundraFormField>

				<TundraFormField label="Новая цена (заполнить только если обновляете цену)">
					<TundraInput
						ref={priceRef}
						spellCheck={false}
						type="number"
						name="price"
						placeholder="9999"
					/>
				</TundraFormField>

				<div style={{
					marginTop: "20px",
					paddingTop: "20px",
					borderTop: "1px solid var(--line)",
					textAlign: "center",
					display: "flex",
					flexDirection: "column",
					gap: "12px"
				}}>
					<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
						<TundraTypography variant="text" size="sm" color="soft">
							Кнопка сработает сразу
						</TundraTypography>
						<TundraTypography variant="text" size="sm" weight="bold" style={{ color: "var(--err)" }}>
							БУДЬТЕ ВНИМАТЕЛЬНЫ! 🚭
						</TundraTypography>
					</div>

					<div style={{ display: "flex", gap: "12px" }}>
						<TundraButton
							onClick={() => submit("price")}
							isLoading={isLoading}
							variant="primary"
							style={{ flex: 1 }}
						>
							Обновить цену {selectedStores.length > 1 ? `(${selectedStores.length})` : ""}
						</TundraButton>
						<TundraButton
							onClick={() => submit("hide")}
							isLoading={isLoading}
							variant="secondary"
							style={{ flex: 1 }}
						>
							Скрыть товар {selectedStores.length > 1 ? `(${selectedStores.length})` : ""}
						</TundraButton>
					</div>
				</div>
			</TundraCard>

			{isWarning && (
				<div style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					backgroundColor: "var(--err)",
					color: "white",
					padding: "12px 24px",
					borderRadius: "8px",
					boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
					zIndex: 1000,
					fontWeight: "bold",
					animation: "slideIn 0.3s ease-out"
				}}>
					Выберите хотя бы один магазин и заполните поля
				</div>
			)}
			<style>{`
				@keyframes slideIn {
					from { transform: translateX(100%); opacity: 0; }
					to { transform: translateX(0); opacity: 1; }
				}
			`}</style>
		</>
	);
}
