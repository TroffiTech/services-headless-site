import { FETCH_RETRY_ATTEMPTS, REQUEST_DELAY } from "../config";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface UploadImageResponse {
	success: boolean;
	image?: {
		id: number;
		src: string;
		name: string;
	};
	error?: string;
}

export default async function uploadImage(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	imageUrl: string
): Promise<UploadImageResponse> {
	try {
		console.log("🖼️ Загрузка изображения:", imageUrl);

		// Создаем изображение через WooCommerce API
		const response = await fetch(`${storeUrl}/wp-json/wc/v3/products`, {
			method: "POST",
			headers: {
				authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				images: [
					{
						src: imageUrl,
					},
				],
			}),
			signal: AbortSignal.timeout(120_000),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.log("❌ Ошибка загрузки изображения:", errorData);
			return {
				success: false,
				error: errorData.message || "Failed to upload image",
			};
		}

		const data = await response.json();

		// WooCommerce автоматически загрузит изображение и вернет его данные
		if (data.images && data.images.length > 0) {
			const image = data.images[0];
			return {
				success: true,
				image: {
					id: image.id,
					src: image.src,
					name: image.name || "product-image",
				},
			};
		}

		return { success: false, error: "No image data returned" };
	} catch (error) {
		console.error("Error uploading image:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Connection failed",
		};
	}
}
