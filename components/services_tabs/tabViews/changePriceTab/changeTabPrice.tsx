import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import StoreDomenSelector from "../../elements/store_domen_selector/StoreDomenSelector";
import Sonner from "@/components/shared/sonner/Sonner";
import Button from "@/components/shared/button/Button";
import Popup from "@/components/shared/popup/Popup";
import styles from "./changePriceTab.module.css";

export default function ChangePriceNab() {
	const navigator = useRouter();
	const [value, setValue] = useState("Нажмите, чтобы выбрать магазин");
	const [isLoading, setIsLoading] = useState(false);
	const [isWarning, setIsWarning] = useState(false);
	const skuRef = useRef<HTMLInputElement | null>(null);
	const priceRef = useRef<HTMLInputElement | null>(null);

	async function submit() {
		if (
			!skuRef.current ||
			!priceRef.current ||
			skuRef.current.value === "" ||
			priceRef.current.value === "" ||
			value === "Нажмите, чтобы выбрать магазин"
		) {
			setIsWarning(true);
			setTimeout(() => setIsWarning(false), 2000);
			return;
		}
		const requestData = {
			sku: skuRef.current.value,
			price: priceRef.current.value,
			domen: `https://${value}`,
		};
		setIsLoading(true);
		const response = await fetch("api/services/update-one", {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(requestData),
		});

		if (response.status === 200) {
			const resultData = await response.json();
			navigator.push(
				`/services/succsess/?store=${resultData.storeURL}&sku=${resultData.sku}&price=${resultData.newPrice}`
			);
		} else navigator.push("/services/error");
	}

	return (
		<>
			{isLoading && <Sonner />}
			<div className={styles.tabs_tabsDisplay_description}>
				Обновить цену одной позиции в выбранном магазине
			</div>
			<StoreDomenSelector value={value} valueSetter={setValue} />
			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="sku">Артикул товара</label>
				<input
					ref={skuRef}
					spellCheck={false}
					type="text"
					name="sku"
					placeholder="AB.123.12.1"
					required
				/>
			</div>
			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="price">Новая цена</label>
				<input
					ref={priceRef}
					spellCheck={false}
					type="number"
					name="price"
					placeholder="9999"
					required
				/>
			</div>
			<div className={styles.tabs_tabsDisplay_buttonWrapper}>
				<p>Кнопка сработает сразу</p>
				<h3>БУДЬТЕ ВНИМАТЕЛЬНЫ!</h3>
				<h2>🚭</h2>
				<Button callback={submit}>Обновить</Button>
			</div>
			{isWarning && <Popup>Заполните поля корректно</Popup>}
		</>
	);
}
