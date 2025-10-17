import { FETCH_RETRY_ATTEMPTS, REQUEST_DELAY } from "../config";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ProductAttribute {
	id: number;
	name: string;
	slug: string;
	type: string;
	order_by: string;
	has_archives: boolean;
}

export default async function getAttributes(
	storeUrl: string,
	apiCredentials: { key: string; secret: string }
): Promise<ProductAttribute[]> {
	try {
		const response = await fetch(`${storeUrl}/wp-json/wc/v3/products/attributes?per_page=100`, {
			headers: {
				authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
				"content-type": "application/json",
			},
			signal: AbortSignal.timeout(120_000),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const attributes = await response.json();
		return attributes;
	} catch (error) {
		if (FETCH_RETRY_ATTEMPTS <= 1) throw error;
		await delay(REQUEST_DELAY);
		console.log("Retry fetching attributes from " + storeUrl);
		return getAttributes(storeUrl, apiCredentials);
	}
}
