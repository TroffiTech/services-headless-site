import { getStore } from "./storeManager";
import { ProductType } from "./localClient";

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

interface WooCommerceProductResponse {
	id: number;
	sku: string;
	name: string;
	regular_price: string;
	status: string;
}

interface CreateProductResponse {
	success: boolean;
	product?: WooCommerceProductResponse;
	error?: string;
}

export default async function createProduct(
	storeUrl: string,
	_apiCredentials: { key: string; secret: string },
	data: ProductData
): Promise<CreateProductResponse> {
	try {
		console.log("🚀 Создание товара через WooClient...");

		// Initialize store
		const store = await getStore(storeUrl);

		// Map ProductData to ProductType
		const productPayload: ProductType = {
			sku: data.sku,
			name: data.name,
			price: parseFloat(data.price),
			status: "publish", // Default status
			shortDescription: data.short_description,
			description: data.description,
		};

		// Categories
		if (data.categories && data.categories.length > 0) {
			productPayload.categories = data.categories.map((id) => ({ id }));
		}

		// Manufacturer Attribute
		if (data.manufacturer) {
			productPayload.attributes = [
				{
					id: 128, // ID атрибута "Производитель"
					options: [data.manufacturer],
				},
			];
		}

		// Handle Images.
		// Note: The library's createProducts expects image paths for upload.
		// However, since the app already uploads images and has IDs, we cannot
		// use the library's automatic upload for existing IDs.
		// We will create the product first, then update images via fetch
		// if the library doesn't support ID-based creation in the high-level API.
		// Actually, to keep logic identical, we'll use the library for creation
		// and then handle images if necessary, but for now we'll map what we can.

		console.log("📦 Отправка данных товара в WooCommerce...");
		const results = await store.createProducts([productPayload]);

		// The library returns an array of results for createProducts
		const result = results[0];

		if (result && !result.error) {
			console.log("✅ Товар создан успешно!");
			console.log("🆔 ID товара:", result.id);

			// Manual image update since library expects paths
			if (data.main_image_id || (data.gallery_image_ids && data.gallery_image_ids.length > 0)) {
				const images = [];
				if (data.main_image_id) {
					images.push({ id: data.main_image_id, position: 0 });
				}
				if (data.gallery_image_ids) {
					data.gallery_image_ids.forEach((id, index) => {
						images.push({ id, position: index + 1 });
					});
				}

				// Use updateProducts to set the image IDs
				await store.updateProducts([{
					id: result.id,
					images: images as any, // casting because library type expects paths
				}]);
			}

			return {
				success: true,
				product: {
					id: result.id,
					sku: result.sku,
					name: result.name,
					regular_price: result.price.toString(),
					status: "publish",
				},
			};
		} else {
			const errorMsg = result?.error || "Failed to create product";
			console.error("❌ Ошибка создания товара:", errorMsg);
			return {
				success: false,
				error: errorMsg,
			};
		}
	} catch (error) {
		console.error("💥 Критическая ошибка:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
