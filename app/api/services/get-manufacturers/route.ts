import { NextRequest } from "next/server";
import getManufacturers from "@/server_utils/woocommerceAPI/getManufacturers";
import { apiResponse, apiError } from "@/server_utils/responses";
import { validateSession } from "@/server_utils/env";
import { ServiceRequestSchema } from "@/server_utils/validation/services";
import { getWcAuthData } from "@/server_utils/env";

export async function POST(request: NextRequest) {
	try {
		// 1. Auth Check
		const { authenticated } = await validateSession();
		if (!authenticated) return apiError("Unauthorized", 401);

		// 2. Validation
		const body = await request.json();
		const validation = ServiceRequestSchema.safeParse(body);

		if (!validation.success) {
			return apiError(validation.error.issues[0].message, 400);
		}

		const { domen } = validation.data;

		// 3. Get WC Auth Data
		let wcAuthData;
		try {
			wcAuthData = await getWcAuthData(domen);
		} catch (e: any) {
			return apiError(e.message, 500);
		}

		const manufacturers = await getManufacturers(wcAuthData.storeURL, wcAuthData.authorizationData);

		return apiResponse(true, { manufacturers });
	} catch (error) {
		console.error("Error fetching manufacturers:", error);
		return apiError("Internal server error", 500);
	}
}
