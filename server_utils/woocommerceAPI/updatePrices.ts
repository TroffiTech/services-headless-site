import { FETCH_RETRY_ATTEMPTS, PRODUCTS_PER_PAGE, REQUEST_DELAY } from "../config";
import delay from "../utils/delay";

async function getProductIds(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	skus: string[],
	retryAttempts: number = FETCH_RETRY_ATTEMPTS,
) {
	try {
		const data = await fetch(
			`${storeUrl}/wp-json/wc/v3/products/?sku=${skus[0]}&per_page=${PRODUCTS_PER_PAGE}&_fields=id,sku`,
			{
				headers: {
					authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
					"content-type": "application/json",
				},
				signal: AbortSignal.timeout(120_000),
			},
		);

		return await data.json();
	} catch (error) {
		if (retryAttempts <= 1) throw new Error("unawailable connection");
		delay(REQUEST_DELAY);
		console.log("retry to connect to " + storeUrl);
		return await getProductIds(storeUrl, apiCredentials, skus, retryAttempts - 1);
	}
}

async function makeStatusUpdateRequest(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	statusUpdateData: Array<{ id: number; status: string }>, // принимаем массив объектов с id и status
) {
	console.log("updating status:", statusUpdateData);
	try {
		const response = await fetch(`${storeUrl}/wp-json/wc/v3/products/batch`, {
			method: "post",
			headers: {
				authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({ update: statusUpdateData }), // передаем массив
			signal: AbortSignal.timeout(120_000),
		});

		const res = await response.json();
		console.log("status update result:", res);
		return res;
	} catch (error) {
		console.error("Status update error:", error);
		throw new Error("something went wrong while updating status");
	}
}

async function makeBatchUpdateRequest(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	idPricePairs: Array<{ regular_price: string; id: number }>,
) {
	try {
		const data = await fetch(`${storeUrl}/wp-json/wc/v3/products/batch`, {
			method: "post",
			headers: {
				authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({ update: idPricePairs }),
			signal: AbortSignal.timeout(120_000),
		});

		return await data.json();
	} catch (error) {
		throw new Error("something went wrong while updating price");
	}
}

export async function updateStore(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	data: { [key: string]: string } | { post_status: string; sku: string }, // добавляем sku в тип для статуса
) {
	// Для обновления цены
	if (!("post_status" in data)) {
		const skus = Object.keys(data); // получаем SKU из ключей объекта

		const idSkuPairs = await getProductIds(
			storeUrl,
			{ key: apiCredentials.key, secret: apiCredentials.secret },
			skus,
		);

		if (!idSkuPairs || !Array.isArray(idSkuPairs) || idSkuPairs.length === 0)
			return { error: true, success: false };

		const idPricePairs: Array<{ regular_price: string; id: number }> = [];
		idSkuPairs.map((pair) => {
			if (!pair.id || !data[pair.sku]) return;
			idPricePairs.push({
				id: pair.id,
				regular_price: data[pair.sku]?.toString(),
			});
		});

		const result = await makeBatchUpdateRequest(
			storeUrl,
			{ key: apiCredentials.key, secret: apiCredentials.secret },
			idPricePairs,
		);

		if (!result) return { error: true, success: false };
		return { error: false, success: true };
	}
	// Для обновления статуса
	else {
		// Здесь data содержит { post_status: string, sku: string }
		const { post_status, sku } = data;

		const idSkuPairs = await getProductIds(
			storeUrl,
			{ key: apiCredentials.key, secret: apiCredentials.secret },
			[sku], // передаем массив с одним SKU
		);

		if (!idSkuPairs || !Array.isArray(idSkuPairs) || idSkuPairs.length === 0)
			return { error: true, success: false };

		// Создаем массив для batch update с id и статусом
		const statusUpdateData = idSkuPairs.map((pair) => ({
			id: pair.id,
			status: post_status,
		}));

		const result = await makeStatusUpdateRequest(
			storeUrl,
			{ key: apiCredentials.key, secret: apiCredentials.secret },
			statusUpdateData,
		);

		if (!result) return { error: true, success: false };
		return { error: false, success: true };
	}
}
