import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import StoreDomenSelector from "../../elements/store_domen_selector/StoreDomenSelector";
import Sonner from "@/components/shared/sonner/Sonner";
import { TundraButton } from "@/components/tundra/atoms/TundraButton";
import { TundraInput } from "@/components/tundra/atoms/TundraInput";
import { TundraTypography } from "@/components/tundra/atoms/TundraTypography";
import { TundraFormField } from "@/components/tundra/molecules/TundraFormField";
import { TundraCard } from "@/components/tundra/molecules/TundraCard";

interface Category {
	id: number;
	name: string;
	slug: string;
	parent: number;
}

interface Manufacturer {
	id: number;
	name: string;
	slug: string;
}

export default function AddProductTab() {
	const navigator = useRouter();
	const [value, setValue] = useState("Нажмите, чтобы выбрать магазин");
	const [isLoading, setIsLoading] = useState(false);
	const [isWarning, setIsWarning] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
	const [isLoadingData, setIsLoadingData] = useState(false);

	// Refs для полей формы
	const skuRef = useRef<HTMLInputElement | null>(null);
	const nameRef = useRef<HTMLInputElement | null>(null);
	const shortDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
	const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
	const priceRef = useRef<HTMLInputElement | null>(null);
	const mainImageRef = useRef<HTMLInputElement | null>(null);
	const galleryImagesRef = useRef<HTMLInputElement | null>(null);

	// Загрузка данных при выборе домена
	useEffect(() => {
		if (value !== "Нажмите, чтобы выбрать магазин") {
			loadStoreData();
		}
	}, [value]);

	const loadStoreData = async () => {
		setIsLoadingData(true);
		const domain = `https://${value}`;

		try {
			// Загружаем категории
			const categoriesResponse = await fetch("/api/services/get-categories", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ domen: domain }),
			});

			if (categoriesResponse.ok) {
				const categoriesData = await categoriesResponse.json();
				setCategories(categoriesData.categories || []);
			}

			// Загружаем производителей
			const manufacturersResponse = await fetch("/api/services/get-manufacturers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ domen: domain }),
			});

			if (manufacturersResponse.ok) {
				const manufacturersData = await manufacturersResponse.json();
				setManufacturers(manufacturersData.manufacturers || []);
			}
		} catch (error) {
			console.error("Error loading store data:", error);
		} finally {
			setIsLoadingData(false);
		}
	};

	async function submit() {
		if (
			!skuRef.current ||
			!nameRef.current ||
			!priceRef.current ||
			skuRef.current.value === "" ||
			nameRef.current.value === "" ||
			priceRef.current.value === "" ||
			value === "Нажмите, чтобы выбрать магазин"
		) {
			setIsWarning(true);
			setTimeout(() => setIsWarning(false), 2000);
			return;
		}

		// Получаем выбранные файлы
		const mainImageFile = mainImageRef.current?.files?.[0];
		const galleryImageFiles = galleryImagesRef.current?.files;

		const formData = new FormData();

		// Добавляем основные данные
		formData.append("sku", skuRef.current.value);
		formData.append("name", nameRef.current.value);
		formData.append("price", priceRef.current.value);
		formData.append("domen", `https://${value}`);

		// Добавляем опциональные поля
		if (shortDescriptionRef.current?.value) {
			formData.append("short_description", shortDescriptionRef.current.value);
		}
		if (descriptionRef.current?.value) {
			formData.append("description", descriptionRef.current.value);
		}

		// Добавляем категорию если выбрана
		const selectedCategory = document.querySelector(
			'input[name="category"]:checked'
		) as HTMLInputElement;
		if (selectedCategory) {
			formData.append("categories", selectedCategory.value);
		}

		// Добавляем производителя если выбран
		const selectedManufacturer = document.querySelector(
			'input[name="manufacturer"]:checked'
		) as HTMLInputElement;
		if (selectedManufacturer) {
			formData.append("manufacturer", selectedManufacturer.value);
		}

		// Добавляем файлы изображений
		if (mainImageFile) {
			formData.append("main_image", mainImageFile);
		}

		if (galleryImageFiles) {
			for (let i = 0; i < galleryImageFiles.length; i++) {
				formData.append("gallery_images", galleryImageFiles[i]);
			}
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/services/add-new-product", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (response.ok && result.success) {
				navigator.push(
					`/services/succsess/?store=${result.storeURL}&sku=${result.sku}&name=${result.name}`
				);
			} else {
				const originalError = result.error || "Unknown error";
				const errorMessage = encodeURIComponent(originalError);
				const sku = encodeURIComponent(skuRef.current?.value || "");

				navigator.push(`/services/error?error=${errorMessage}&sku=${sku}`);
			}
		} catch (error) {
			console.error("❌ Ошибка сети:", error);
			navigator.push(`/services/error?`);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			{isLoading && <Sonner />}
			<TundraTypography variant="display" size="lg" weight="bold" style={{ marginBottom: "24px" }}>
				Добавить продукт в выбранный магазин
			</TundraTypography>

			<StoreDomenSelector value={value} valueSetter={setValue} />

			{value !== "Нажмите, чтобы выбрать магазин" && isLoadingData && (
				<TundraTypography variant="text" size="sm" color="soft" style={{ textAlign: "center", marginBottom: "20px" }}>
					Загрузка данных магазина...
				</TundraTypography>
			)}

			<TundraCard style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<TundraFormField label="Артикул *" required>
					<TundraInput
						ref={skuRef}
						spellCheck={false}
						type="text"
						name="sku"
						placeholder="AB.123.12.1"
						required
					/>
				</TundraFormField>

				<TundraFormField label="Название товара *" required>
					<TundraInput
						ref={nameRef}
						spellCheck={false}
						type="text"
						name="name"
						placeholder="Смартфон iPhone 15 Pro"
						required
					/>
				</TundraFormField>

				<TundraFormField label="Категория">
					<div style={{ display: "flex", flexWrap: "wrap", gap: "12px", padding: "8px 0" }}>
						{categories.length > 0 ? (
							categories.map((category) => (
								<label key={category.id} style={{
									display: "flex",
									alignItems: "center",
									gap: "6px",
									cursor: "pointer",
									fontSize: "14px",
									fontFamily: "var(--font-text)",
									color: "var(--ink-2)"
								}}>
									<input
										type="radio"
										name="category"
										value={category.id}
										style={{ accentColor: "var(--accent)" }}
									/>
									<span>{category.name}</span>
								</label>
							))
						) : (
							<div style={{ color: "var(--soft)", fontSize: "13px" }}>
								{isLoadingData ? "Загрузка категорий..." : "Категории не найдены"}
							</div>
						)}
					</div>
				</TundraFormField>

				<TundraFormField label="Производитель">
					<div style={{ display: "flex", flexWrap: "wrap", gap: "12px", padding: "8px 0" }}>
						{manufacturers.length > 0 ? (
							manufacturers.map((manufacturer) => (
								<label key={manufacturer.id} style={{
									display: "flex",
									alignItems: "center",
									gap: "6px",
									cursor: "pointer",
									fontSize: "14px",
									fontFamily: "var(--font-text)",
									color: "var(--ink-2)"
								}}>
									<input
										type="radio"
										name="manufacturer"
										value={manufacturer.name}
										style={{ accentColor: "var(--accent)" }}
									/>
									<span>{manufacturer.name}</span>
								</label>
							))
						) : (
							<div style={{ color: "var(--soft)", fontSize: "13px" }}>
								{isLoadingData ? "Загрузка производителей..." : "Производители не найдены"}
							</div>
						)}
					</div>
				</TundraFormField>

				<TundraFormField label="Короткое описание">
					<textarea
						ref={shortDescriptionRef}
						spellCheck={false}
						name="short_description"
						placeholder="Краткое описание товара для карточки..."
						rows={3}
						style={{
							width: "100%",
							padding: "12px 16px",
							borderRadius: "8px",
							border: "1px solid var(--line)",
							boxSizing: "border-box",
							fontSize: "15px",
							fontFamily: "var(--font-text)",
							outline: "none",
							color: "var(--ink)",
							transition: "border-color 0.2s",
						}}
						onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
						onBlur={(e) => e.currentTarget.style.borderColor = "var(--line)"}
					/>
				</TundraFormField>

				<TundraFormField label="Описание">
					<textarea
						ref={descriptionRef}
						spellCheck={false}
						name="description"
						placeholder="Подробное описание товара со всеми характеристиками..."
						rows={5}
						style={{
							width: "100%",
							padding: "12px 16px",
							borderRadius: "8px",
							border: "1px solid var(--line)",
							boxSizing: "border-box",
							fontSize: "15px",
							fontFamily: "var(--font-text)",
							outline: "none",
							color: "var(--ink)",
							transition: "border-color 0.2s",
						}}
						onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
						onBlur={(e) => e.currentTarget.style.borderColor = "var(--line)"}
					/>
				</TundraFormField>

				<TundraFormField label="Цена *" required>
					<TundraInput
						ref={priceRef}
						spellCheck={false}
						type="number"
						step="0.01"
						min="0"
						name="price"
						placeholder="9999.00"
						required
					/>
				</TundraFormField>

				<TundraFormField label="✅ Главное изображение (JPG, PNG, GIF, WebP)" required>
					<input
						ref={mainImageRef}
						type="file"
						name="main_image"
						accept="image/jpeg,image/png,image/gif,image/webp"
						style={{
							fontSize: "14px",
							fontFamily: "var(--font-text)",
							color: "var(--ink-2)",
							cursor: "pointer"
						}}
					/>
				</TundraFormField>

				<TundraFormField label="Дополнительные изображения (можно несколько)">
					<input
						ref={galleryImagesRef}
						type="file"
						name="gallery_images"
						accept="image/jpeg,image/png,image/gif,image/webp"
						multiple
						style={{
							fontSize: "14px",
							fontFamily: "var(--font-text)",
							color: "var(--ink-2)",
							cursor: "pointer"
						}}
					/>
				</TundraFormField>

				<div style={{
					marginTop: "20px",
					paddingTop: "20px",
					borderTop: "1px solid var(--line)",
					textAlign: "center"
				}}>
					<TundraTypography variant="text" size="sm" color="soft" style={{ marginBottom: "12px", display: "block" }}>
						Будьте внимательны при создании товара
					</TundraTypography>
					<TundraButton
						onClick={submit}
						isLoading={isLoading}
						variant="primary"
						style={{ width: "100%" }}
					>
						{isLoading ? "Создание..." : "Создать товар"}
					</TundraButton>
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
					Заполните обязательные поля корректно
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
