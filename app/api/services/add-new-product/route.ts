import { NextRequest, NextResponse } from "next/server";
import createProduct from "@/server_utils/woocommerceAPI/createProduct";

async function uploadImageToWordPress(file: File, domen: string, requestUrl: string): Promise<any> {
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

		// Валидация
		if (!sku || !name || !price || !domen) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const envKey = domen.split("//")[1].split(".")[0];
		const envValue = process.env?.[envKey]?.split("+");

		if (!envValue) {
			return NextResponse.json({ error: "wcAuth failed" }, { status: 500 });
		}

		const wcAuthData = {
			storeURL: domen,
			authorizationData: {
				key: envValue[0],
				secret: envValue[1],
			},
		};

		// Загрузка изображений через WordPress Media API
		let mainImageId: number | undefined;
		const galleryImageIds: number[] = [];

		const mainImageFile = formData.get("main_image") as File;
		if (mainImageFile && mainImageFile.size > 0) {
			console.log("🖼️ Загружаем главное изображение через WordPress Media API...");
			try {
				const uploadResult = await uploadImageToWordPress(mainImageFile, domen, requestUrl);
				if (uploadResult.success) {
					mainImageId = uploadResult.image.id;
					console.log("✅ Главное изображение загружено, ID:", mainImageId);
				}
			} catch (uploadError) {
				console.error("❌ Ошибка загрузки главного изображения:", uploadError);
				// Продолжаем создание товара без изображения
			}
		}

		const galleryFiles = formData.getAll("gallery_images") as File[];
		for (const file of galleryFiles) {
			if (file.size > 0) {
				console.log("🖼️ Загружаем изображение галереи через WordPress Media API...");
				try {
					const uploadResult = await uploadImageToWordPress(file, domen, requestUrl);
					if (uploadResult.success) {
						galleryImageIds.push(uploadResult.image.id);
						console.log("✅ Изображение галереи загружено, ID:", uploadResult.image.id);
					}
				} catch (uploadError) {
					console.error("❌ Ошибка загрузки изображения галереи:", uploadError);
					// Продолжаем без этого изображения
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
			return NextResponse.json({
				success: true,
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
			return NextResponse.json(
				{ error: result.error || "Failed to create product" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
