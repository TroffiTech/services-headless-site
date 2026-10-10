import { NextRequest } from "next/server";
import { apiResponse, apiError } from "@/server_utils/responses";
import { validateSession } from "@/server_utils/env";
import { DomainSchema } from "@/server_utils/validation/services";

export async function POST(request: NextRequest) {
	try {
		// 1. Auth Check
		const { authenticated } = await validateSession();
		if (!authenticated) return apiError("Unauthorized", 401);

		const formData = await request.formData();
		const file = formData.get("file") as File;
		const domen = formData.get("domen") as string;

		// 2. Validation
		if (!file || !domen) {
			return apiError("File and domain are required", 400);
		}

		const domainValidation = DomainSchema.safeParse(domen);
		if (!domainValidation.success) {
			return apiError(domainValidation.error.issues[0].message, 400);
		}

		if (!file.type.startsWith("image/")) {
			return apiError("File must be an image", 400);
		}

		// Проверяем размер файла (макс. 10MB)
		const MAX_FILE_SIZE = 10 * 1024 * 1024;
		if (file.size > MAX_FILE_SIZE) {
			return apiError("File size must be less than 10MB", 400);
		}

		// Получаем логин и Application Password из .env
		const wpUsername = process.env.WP_API_USERNAME;
		const envKey = domen.split("//")[1].split(".")[0].toUpperCase();
		const wpPassword = process.env?.[envKey]?.split("+")[2];

		if (!wpUsername || !wpPassword) {
			console.error("❌ WordPress credentials not configured");
			return apiError("WordPress credentials not configured", 500);
		}

		console.log("🖼️ Загрузка изображения через WordPress Media API...");

		// Создаем FormData для WordPress
		const wpFormData = new FormData();
		wpFormData.append("file", file);
		wpFormData.append("title", file.name);
		wpFormData.append("status", "publish");

		// Загружаем изображение через WordPress Media API с Application Password
		const response = await fetch(`${domen}/wp-json/wp/v2/media`, {
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(`${wpUsername}:${wpPassword}`).toString("base64")}`,
			},
			body: wpFormData,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("❌ Ошибка загрузки. Статус:", response.status);

			let errorMessage = `Upload failed: ${response.status}`;
			try {
				const errorData = JSON.parse(errorText);
				errorMessage = errorData.message || errorMessage;
			} catch {
				errorMessage = errorText || errorMessage;
			}

			throw new Error(errorMessage);
		}

		const mediaData = await response.json();

		return apiResponse(true, {
			image: {
				id: mediaData.id,
				src: mediaData.source_url,
				alt: mediaData.alt_text || "",
				title: mediaData.title?.rendered || file.name,
			},
		});
	} catch (error: any) {
		console.error("❌ Ошибка загрузки изображения:", error);
		return apiError(error.message || "Upload failed", 500);
	}
}
