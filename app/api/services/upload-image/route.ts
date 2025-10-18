import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const domen = formData.get("domen") as string;

		if (!file || !domen) {
			return NextResponse.json({ error: "File and domain are required" }, { status: 400 });
		}

		if (!file.type.startsWith("image/")) {
			return NextResponse.json({ error: "File must be an image" }, { status: 400 });
		}

		// Проверяем размер файла (макс. 10MB)
		const MAX_FILE_SIZE = 10 * 1024 * 1024;
		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
		}

		// Получаем логин и Application Password из .env
		const wpUsername = process.env.WP_API_USERNAME;
		const envKey = domen.split("//")[1].split(".")[0];
		const wpPassword = process.env?.[envKey]?.split("+")[2];

		if (!wpUsername || !wpPassword) {
			console.error("❌ WordPress credentials not configured");
			return NextResponse.json({ error: "WordPress credentials not configured" }, { status: 500 });
		}

		console.log("🖼️ Загрузка изображения через WordPress Media API...");
		console.log("👤 Пользователь:", wpUsername);
		console.log("🏪 Домен:", domen);
		console.log("📁 Файл:", file.name, `(${Math.round(file.size / 1024)}KB)`);

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
				// Не добавляем Content-Type - браузер сам установит с boundary для FormData
			},
			body: wpFormData,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("❌ Ошибка загрузки. Статус:", response.status);
			console.error("❌ Ответ сервера:", errorText);

			let errorMessage = `Upload failed: ${response.status}`;
			try {
				const errorData = JSON.parse(errorText);
				errorMessage = errorData.message || errorMessage;
			} catch {
				// Если ответ не JSON, используем текст ошибки
				errorMessage = errorText || errorMessage;
			}

			throw new Error(errorMessage);
		}

		const mediaData = await response.json();

		console.log("✅ Изображение загружено успешно!");
		console.log("🆔 ID:", mediaData.id);
		console.log("🔗 URL:", mediaData.source_url);
		console.log("📛 Название:", mediaData.title?.rendered);

		return NextResponse.json({
			success: true,
			image: {
				id: mediaData.id,
				src: mediaData.source_url,
				alt: mediaData.alt_text || "",
				title: mediaData.title?.rendered || file.name,
			},
		});
	} catch (error) {
		console.error("❌ Ошибка загрузки изображения:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Upload failed",
			},
			{ status: 500 }
		);
	}
}
