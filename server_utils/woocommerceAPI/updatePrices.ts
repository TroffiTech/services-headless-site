import { getStore } from "./storeManager";

export async function updateStore(
	storeUrl: string,
	_apiCredentials: { key: string; secret: string },
	data: { [key: string]: string } | { post_status: string; sku: string },
) {
	try {
		const store = await getStore(storeUrl);

		// For price updates
		if (!("post_status" in data)) {
			const skus = Object.keys(data);
			const skuPriceMap: { [sku: string]: number } = {};

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

			if (result && result.length > 0) {
				return { error: false, success: true };
			}
			return { error: true, success: false };
		}
		// For status updates
		else {
			const { post_status, sku } = data;

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

			if (result && result.length > 0 && !result[0].error) {
				return { error: false, success: true };
			}
			return { error: true, success: false };
		}
	} catch (error) {
		console.error("Update logic error:", error);
		return { error: true, success: false };
	}
}
