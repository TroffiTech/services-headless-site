import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import styles from "./AddProductTab.module.css";
import StoreDomenSelector from "../../elements/store_domen_selector/StoreDomenSelector";
import Button from "@/components/shared/button/Button";
import Popup from "@/components/shared/popup/Popup";
import Sonner from "@/components/shared/sonner/Sonner";

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

	// Refs для выбора категорий и производителей
	const categoryRef = useRef<HTMLInputElement | null>(null);
	const manufacturerRef = useRef<HTMLInputElement | null>(null);

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
				body: formData, // FormData вместо JSON
			});

			const result = await response.json();

			if (response.ok && result.success) {
				console.log("✅ Товар создан успешно:", result.product);
				navigator.push(
					`/services/succsess/?store=${result.storeURL}&sku=${result.sku}&name=${result.name}`
				);
			} else {
				console.error("❌ Ошибка создания товара:", result.error);
				navigator.push("/services/error");
			}
		} catch (error) {
			console.error("❌ Ошибка сети:", error);
			navigator.push("/services/error");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			{isLoading && <Sonner />}
			<div className={styles.tabs_tabsDisplay_description}>
				Добавить продукт в выбранный магазин
			</div>

			<StoreDomenSelector value={value} valueSetter={setValue} />

			{value !== "Нажмите, чтобы выбрать магазин" && isLoadingData && (
				<div className={styles.loadingMessage}>Загрузка данных магазина...</div>
			)}

			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="sku">Артикул *</label>
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
				<label htmlFor="name">Название товара *</label>
				<input
					ref={nameRef}
					spellCheck={false}
					type="text"
					name="name"
					placeholder="Смартфон iPhone 15 Pro"
					required
				/>
			</div>

			{/* Выбор категории */}
			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label>Категория</label>
				<div className={styles.radioGroup}>
					{categories.length > 0 ? (
						categories.map((category) => (
							<label key={category.id} className={styles.radioLabel}>
								<input
									ref={categoryRef}
									type="radio"
									name="category"
									value={category.id}
									className={styles.radioInput}
								/>
								<span className={styles.radioText}>{category.name}</span>
							</label>
						))
					) : (
						<div className={styles.noData}>
							{isLoadingData ? "Загрузка категорий..." : "Категории не найдены"}
						</div>
					)}
				</div>
			</div>

			{/* Выбор производителя */}
			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label>Производитель</label>
				<div className={styles.radioGroup}>
					{manufacturers.length > 0 ? (
						manufacturers.map((manufacturer) => (
							<label key={manufacturer.id} className={styles.radioLabel}>
								<input
									ref={manufacturerRef}
									type="radio"
									name="manufacturer"
									value={manufacturer.name}
									className={styles.radioInput}
								/>
								<span className={styles.radioText}>{manufacturer.name}</span>
							</label>
						))
					) : (
						<div className={styles.noData}>
							{isLoadingData ? "Загрузка производителей..." : "Производители не найдены"}
						</div>
					)}
				</div>
			</div>

			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="short_description">Короткое описание</label>
				<textarea
					ref={shortDescriptionRef}
					spellCheck={false}
					name="short_description"
					placeholder="Краткое описание товара для карточки..."
					rows={3}
				/>
			</div>

			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="description">Описание</label>
				<textarea
					ref={descriptionRef}
					spellCheck={false}
					name="description"
					placeholder="Подробное описание товара со всеми характеристиками..."
					rows={5}
				/>
			</div>

			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="price">Цена *</label>
				<input
					ref={priceRef}
					spellCheck={false}
					type="number"
					step="0.01"
					min="0"
					name="price"
					placeholder="9999.00"
					required
				/>
			</div>

			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="main_image">✅ Выберите файл изображения (JPG, PNG, GIF, WebP)</label>
				<input
					ref={mainImageRef}
					type="file"
					name="main_image"
					accept="image/jpeg,image/png,image/gif,image/webp"
				/>
			</div>

			<div className={styles.tabs_tabsDisplay_inputGroup}>
				<label htmlFor="gallery_images">
					Дополнительные изображения. ✅ Можно выбрать несколько файлов
				</label>
				<input
					ref={galleryImagesRef}
					type="file"
					name="gallery_images"
					accept="image/jpeg,image/png,image/gif,image/webp"
					multiple
				/>
			</div>

			<div className={styles.tabs_tabsDisplay_buttonWrapper}>
				<p>Кнопка сработает сразу</p>
				<h3>БУДЬТЕ ВНИМАТЕЛЬНЫ!</h3>
				<h2>🚭</h2>
				<Button callback={submit}>Создать товар</Button>
			</div>

			{isWarning && <Popup>Заполните обязательные поля корректно</Popup>}
		</>
	);
}
