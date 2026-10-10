import { NextRequest } from "next/server";
import { apiResponse, apiError } from "@/server_utils/responses";
import { getClientIp, checkRateLimit } from "@/server_utils/security/rate-limiter";

export async function POST(request: NextRequest) {
	try {
		// Rate Limiting
		const ip = getClientIp(request);
		if (!checkRateLimit(ip)) {
			return apiError("Too many requests. Please try again in 15 minutes.", 429);
		}

		const body = await request.json();
		const password = body.password;

		if (password === process.env.password) {
			return apiResponse(true, { authenticated: true });
		} else {
			return apiError("Unauthorized", 401);
		}
	} catch (error) {
		return apiError("Invalid request body", 400);
	}
}
