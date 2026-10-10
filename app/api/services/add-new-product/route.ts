import { NextRequest } from "next/server";

import { UploadImageResponse } from "@/server_utils/woocommerceAPI/uploadImages";
import createProduct from "@/server_utils/woocommerceAPI/createProduct";
import { apiResponse, apiError } from "@/server_utils/responses";
import { validateSession } from "@/server_utils/env";
import { getWcAuthData } from "@/server_utils/env";
import { DomainSchema } from "@/server_utils/validation/services";

async function uploadImageToWordPress(
	file: File,
	domen: string,
	requestUrl: string
): Promise<UploadImageResponse> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("domen", domen);

	console.log(`📤 Начинаем загрузку: ${file.name} (${Math.round(file.size / 1024)}KB)`);

	const response = await fetch(`${new URL(requestUrl).origin}/api/services/upload-image`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error(`❌ Ошибка загрузки ${file.name}:`, errorData);
		throw new Error(errorData.error || `Upload failed: ${response.status}`);
	}

	const result = await response.json();

	if (!result.success) {
		console.error(`❌ Загрузка ${file.name} не удалась:`, result.error);
		throw new Error(result.error || "Upload failed");
	}

	console.log(`✅ ${file.name} загружен успешно! ID: ${result.image.id}`);
	return result;
}

export async function POST(request: NextRequest) {
	try {
		// 1. Auth Check
		const { authenticated } = await validateSession();
		if (!authenticated) return apiError("Unauthorized", 401);

		const formData = await request.formData();
		const requestUrl = request.url;

		// Текстовые данные
		const sku = formData.get("sku") as string;
		const name = formData.get("name") as string;
		const short_description = formData.get("short_description") as string;
		const description = formData.get("description") as string;
		const price = formData.get("price") as string;
		const categories = formData.get("categories") as string;
		const manufacturer = formData.get("manufacturer") as string;
		const domen = formData.get("domen") as string;

		// 2. Validation
		if (!sku || !name || !price || !domen) {
			return apiError("Missing required fields", 400);
		}

		const domainValidation = DomainSchema.safeParse(domen);
		if (!domainValidation.success) {
			return apiError(domainValidation.error.issues[0].message, 400);
		}

		// 3. Get WC Auth Data
		let wcAuthData;
		try {
			wcAuthData = await getWcAuthData(domen);
		} catch (e: any) {
			return apiError(e.message, 500);
		}

		// Загрузка изображений через WordPress Media API
		let mainImageId: number | undefined;
		const galleryImageIds: number[] = [];

		const mainImageFile = formData.get("main_image") as File;
		if (mainImageFile && mainImageFile.size > 0) {
			console.log("🖼️ Загружаем главное изображение через WordPress Media API...");
			try {
				const uploadResult = await uploadImageToWordPress(mainImageFile, domen, requestUrl);
				if (uploadResult.success) {
					mainImageId = uploadResult.image?.id;
					console.log("✅ Главное изображение загружено, ID:", mainImageId);
				}
			} catch (uploadError) {
				console.error("❌ Ошибка загрузки главного изображения:", uploadError);
			}
		}

		const galleryFiles = formData.getAll("gallery_images") as File[];
		for (const file of galleryFiles) {
			if (file.size > 0) {
				console.log("🖼️ Загружаем изображение галереи через WordPress Media API...");
				try {
					const uploadResult = await uploadImageToWordPress(file, domen, requestUrl);
					if (uploadResult.success) {
						galleryImageIds.push(uploadResult.image!.id);
						console.log("✅ Изображение галереи загружено, ID:", uploadResult.image!.id);
					}
				} catch (uploadError) {
					console.error("❌ Ошибка загрузки изображения галереи:", uploadError);
				}
			}
		}

		// Создание товара с ID изображений
		const result = await createProduct(wcAuthData.storeURL, wcAuthData.authorizationData, {
			sku,
			name,
			short_description: short_description || undefined,
			description: description || undefined,
			price,
			main_image_id: mainImageId,
			gallery_image_ids: galleryImageIds.length > 0 ? galleryImageIds : undefined,
			categories: categories ? [parseInt(categories)] : undefined,
			manufacturer: manufacturer || undefined,
		});

		if (result.success) {
			return apiResponse(true, {
				product: result.product,
				storeURL: wcAuthData.storeURL,
				sku,
				name,
				uploadedImages: {
					main: mainImageId,
					gallery: galleryImageIds,
				},
			});
		} else {
			return apiError(result.error || "Failed to create product", 500);
		}
	} catch (error) {
		console.error("Error:", error);
		return apiError("Internal server error", 500);
	}
}
