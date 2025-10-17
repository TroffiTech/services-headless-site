import { FETCH_RETRY_ATTEMPTS, REQUEST_DELAY } from "../config";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	parent: number;
}

async function getCategoriesRequest(
	storeUrl: string,
	apiCredentials: { key: string; secret: string },
	retryAttempts: number = FETCH_RETRY_ATTEMPTS
): Promise<Category[]> {
	try {
		const response = await fetch(
			`${storeUrl}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`,
			{
				headers: {
					authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
					"content-type": "application/json",
				},
				signal: AbortSignal.timeout(120_000),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		if (retryAttempts <= 1) throw new Error("Unable to fetch categories");
		await delay(REQUEST_DELAY);
		console.log("Retry fetching categories from " + storeUrl);
		return getCategoriesRequest(storeUrl, apiCredentials, retryAttempts - 1);
	}
}

export default async function getCategories(
	storeUrl: string,
	apiCredentials: { key: string; secret: string }
): Promise<Category[]> {
	try {
		const categories = await getCategoriesRequest(storeUrl, apiCredentials);
		return categories;
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}
