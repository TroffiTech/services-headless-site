export function getWordPressCredentials() {
	return {
		username: process.env.WP_API_USERNAME,
		password: process.env.WP_API_PASSWORD,
	};
}
// utils/wordpressAuth.ts
export async function getWordPressToken(
	domen: string,
	credentials: { username: string; password: string }
) {
	try {
		const response = await fetch(`${domen}/wp-json/jwt-auth/v1/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Auth failed: ${errorData.message || response.status}`);
		}

		const data = await response.json();

		if (data.token) {
			console.log("✅ WordPress токен получен для:", domen);
			return data.token;
		} else {
			throw new Error(data.message || "Token not received");
		}
	} catch (error) {
		console.error("❌ Ошибка получения токена для", domen, ":", error);
		throw error;
	}
}
