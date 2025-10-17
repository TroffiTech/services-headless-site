import { FETCH_RETRY_ATTEMPTS, REQUEST_DELAY } from "../config";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ProductData {
	sku: string;
	name: string;
	short_description?: string;
	description?: string;
	price: string;
	main_image_id?: number; // ID из медиа-библиотеки
	gallery_image_ids?: number[]; // ID изображений галереи
	categories?: number[];
	manufacturer?: string;
}

interface CreateProductResponse {
	success: boolean;
	product?: any;
	error?: string;
}

async function createProductRequest(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	productData: any,
	retryAttempts: number = FETCH_RETRY_ATTEMPTS
): Promise<CreateProductResponse> {
	try {
		const response = await fetch(`${storeUrl}/wp-json/wc/v3/products`, {
			method: "POST",
			headers: {
				authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
				"content-type": "application/json",
			},
			body: JSON.stringify(productData),
			signal: AbortSignal.timeout(120_000),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return { success: true, product: data };
	} catch (error) {
		if (retryAttempts <= 1) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Connection failed",
			};
		}

		await delay(REQUEST_DELAY);
		console.log(`Retry creating product (${retryAttempts - 1} attempts left)`);
		return createProductRequest(storeUrl, apiCredentials, productData, retryAttempts - 1);
	}
}

export default async function createProduct(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	data: ProductData
): Promise<CreateProductResponse> {
	try {
		console.log("🚀 Создание товара с ID изображений...");

		const productData: any = {
			sku: data.sku,
			name: data.name,
			regular_price: data.price,
			status: "publish",
		};

		// Текстовые поля
		if (data.short_description) {
			productData.short_description = data.short_description;
		}
		if (data.description) {
			productData.description = data.description;
		}

		// Изображения через ID
		const images = [];
		if (data.main_image_id) {
			images.push({
				id: data.main_image_id,
				position: 0,
			});
			console.log("📸 Добавлено главное изображение ID:", data.main_image_id);
		}

		if (data.gallery_image_ids && data.gallery_image_ids.length > 0) {
			data.gallery_image_ids.forEach((imageId, index) => {
				images.push({
					id: imageId,
					position: index + 1,
				});
			});
			console.log("🖼️ Добавлены изображения галереи:", data.gallery_image_ids.length);
		}

		if (images.length > 0) {
			productData.images = images;
		}

		// Категории
		if (data.categories && data.categories.length > 0) {
			productData.categories = data.categories.map((id) => ({ id }));
		}

		// Производитель
		if (data.manufacturer) {
			productData.meta_data = [
				{
					key: "manufacturer",
					value: data.manufacturer,
				},
			];
		}

		console.log("📦 Отправка данных товара в WooCommerce...");
		const result = await createProductRequest(storeUrl, apiCredentials, productData);

		if (result.success) {
			console.log("✅ Товар создан успешно!");
			console.log("🆔 ID товара:", result.product?.id);
		} else {
			console.error("❌ Ошибка создания товара:", result.error);
		}

		return result;
	} catch (error) {
		console.error("💥 Критическая ошибка:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
