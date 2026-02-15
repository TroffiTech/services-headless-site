import { updateStore } from "@/server_utils/woocommerceAPI/updatePrices";

export async function POST(request: Request) {
	const dataToUpdate = await request.json();
	const { sku, price, domen, post_status } = dataToUpdate;
	console.log(sku, price, domen, post_status);

	const envKey = domen.split("//")[1].split(".")[0];
	const envValue = process.env?.[envKey]?.split("+");

	if (!envValue)
		return new Response("wcAuth failed. Please, check wc .env keys", {
			headers: {
				"content-type": "application/json",
			},
			status: 500,
		});

	const wcAuthData = {
		storeURL: domen,
		authorizationData: {
			key: envValue[0],
			secret: envValue[1],
		},
	};

	try {
		let result;

		if (price && !post_status) {
			// Обновление цены
			result = await updateStore(wcAuthData.storeURL, wcAuthData.authorizationData, {
				[sku]: price,
			});
		} else if (!price && post_status) {
			// Обновление статуса - передаем и статус, и SKU
			console.log("updating status for sku:", sku);
			result = await updateStore(wcAuthData.storeURL, wcAuthData.authorizationData, {
				post_status: post_status, // используем переданный статус
				sku: sku, // передаем SKU
			});
		}

		console.log("update result:", result);

		if (result && result.success) {
			return new Response(
				JSON.stringify({
					newPrice: price,
					sku,
					storeURL: wcAuthData.storeURL,
					newStatus: post_status,
				}),
				{
					headers: {
						"content-type": "application/json",
					},
					status: 200,
				},
			);
		} else {
			return new Response(JSON.stringify({ error: "Update failed" }), {
				headers: {
					"content-type": "application/json",
				},
				status: 500,
			});
		}
	} catch (error) {
		console.error("API error:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			headers: {
				"content-type": "application/json",
			},
			status: 500,
		});
	}
}
