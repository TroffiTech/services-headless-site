import { getStore } from "./storeManager";

/**
 * Response type for store update operations
 */
export interface StoreUpdateResult {
	success: boolean;
	error: boolean;
	message?: string;
}

/**
 * Updates product details (price or status) in a specific WooCommerce store.
 * Handles the "Product not found" case as a successful no-op to avoid treating
 * missing products as system errors.
 */
export async function updateStore(
	storeUrl: string,
	_apiCredentials: { key: string; secret: string },
	data: { [key: string]: string } | { post_status: string; sku: string },
): Promise<StoreUpdateResult> {
	try {
		const store = await getStore(storeUrl);

		// Handle Price Updates
		if (!("post_status" in data)) {
			const skus = Object.keys(data);
			const skuPriceMap: Record<string, number> = {};

			skus.forEach((sku) => {
				const price = parseFloat(data[sku]);
				if (!isNaN(price)) {
					skuPriceMap[sku] = price;
				}
			});

			if (Object.keys(skuPriceMap).length === 0) {
				return { error: true, success: false };
			}

			const idSkuPairs = await store.getProductIdsBySkus(skus);

			if (!idSkuPairs || idSkuPairs.length === 0) {
				return { error: false, success: true, message: "Product not found in store" };
			}

			const updatePayload = idSkuPairs.map(item => ({
				id: item.id,
				regular_price: skuPriceMap[item.sku].toString()
			}));

			const result = await store.updateProducts(updatePayload);

			return result && result.length > 0
				? { error: false, success: true }
				: { error: true, success: false };
		}

		// Handle Status Updates
		const { post_status, sku } = data as { post_status: string; sku: string };
		const productIds = await store.getProductIdsBySkus([sku]);

		if (!productIds || productIds.length === 0) {
			return { error: false, success: true, message: "Product not found in store" };
		}

		const targetId = productIds[0].id;
		const result = await store.updateProducts([
			{
				id: targetId,
				status: post_status,
			},
		]);

		return (result && result.length > 0 && !result[0].error)
			? { error: false, success: true }
			: { error: true, success: false };

	} catch (error) {
		console.error("[WooCommerce API] Update failed:", error);
		return { error: true, success: false };
	}
}
