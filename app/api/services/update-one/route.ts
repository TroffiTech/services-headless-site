import { updateStore } from "@/server_utils/woocommerceAPI/updatePrices";
import { apiResponse, apiError } from "@/server_utils/responses";
import { validateSession } from "@/server_utils/env";
import { ProductUpdateSchema } from "@/server_utils/validation/services";
import { getWcAuthData } from "@/server_utils/env";

export async function POST(request: Request) {
	try {
		// 1. Auth Check
		const { authenticated } = await validateSession();
		if (!authenticated) return apiError("Unauthorized", 401);

		// 2. Validation
		const body = await request.json();
		const validation = ProductUpdateSchema.safeParse(body);

		if (!validation.success) {
			return apiError(validation.error.issues[0].message, 400);
		}

		const { domen, productId: sku, updates } = validation.data;
		const { price, post_status } = updates;

		// 3. Get WC Auth Data
		let wcAuthData;
		try {
			wcAuthData = await getWcAuthData(domen);
		} catch (e: any) {
			return apiError(e.message, 500);
		}

		try {
			let result;

			if (price && !post_status) {
				// Update price
				result = await updateStore(wcAuthData.storeURL, wcAuthData.authorizationData, {
					[sku]: price,
				});
			} else if (!price && post_status) {
				// Update status
				result = await updateStore(wcAuthData.storeURL, wcAuthData.authorizationData, {
					post_status: post_status,
					sku: sku,
				});
			} else {
				return apiError("Provide either price or post_status, but not both", 400);
			}

			if (result && result.success) {
				return apiResponse(true, {
					newPrice: price,
					sku,
					storeURL: wcAuthData.storeURL,
					newStatus: post_status,
				});
			} else {
				return apiError("Update failed", 500);
			}
		} catch (error) {
			console.error("Update logic error:", error);
			return apiError("Internal server error during update", 500);
		}
	} catch (error: any) {
		console.error("API error:", error);
		return apiError(error.message || "Internal server error", 500);
	}
}
