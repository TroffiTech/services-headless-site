import {
	FETCH_RETRY_ATTEMPTS,
	PRODUCTS_PER_PAGE,
	REQUEST_DELAY,
} from "./config";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getProductIds(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	skus: string[],
	retryAttempts: number = FETCH_RETRY_ATTEMPTS
) {
	try {
		const data = await fetch(
			`${storeUrl}/wp-json/wc/v3/products/?sku=${skus[0]}&per_page=${PRODUCTS_PER_PAGE}&_fields=id,sku`,
			{
				headers: {
					authorization: `Basic ${btoa(
						apiCredentials.key + ":" + apiCredentials.secret
					)}`,
					"content-type": "application/json",
				},
				signal: AbortSignal.timeout(120_000),
			}
		);

		return await data.json();
	} catch (error) {
		if (retryAttempts <= 1) throw new Error("unawailable connection");
		delay(REQUEST_DELAY);
		console.log("retry to connect to " + storeUrl);
		return await getProductIds(
			storeUrl,
			apiCredentials,
			skus,
			retryAttempts - 1
		);
	}
}

async function makeBatchUpdateRequest(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	idPricePairs: Array<{ regular_price: string; id: number }>
) {
	try {
		const data = await fetch(`${storeUrl}/wp-json/wc/v3/products/batch`, {
			method: "post",
			headers: {
				authorization: `Basic ${btoa(
					apiCredentials.key + ":" + apiCredentials.secret
				)}`,
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

export default async function updateStore(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	data: { [key: string]: number }
) {
	const skus = [];
	for (const sku in data) {
		skus.push(sku);
	}

	const idSkuPairs: Array<{ id: number; sku: string }> | null =
		await getProductIds(
			storeUrl,
			{ key: apiCredentials.key, secret: apiCredentials.secret },
			skus
		);
	if (!idSkuPairs || !Array.isArray(idSkuPairs) || idSkuPairs.length === 0)
		return { error: true, sucsess: false };

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
		idPricePairs
	);

	if (!result) return { error: true, sucsess: false };
	if (result.length === 0) return { error: true, sucsess: false };
	return { error: false, sucsess: true };
}
