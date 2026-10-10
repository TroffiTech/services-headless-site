import { NextResponse } from "next/server";

/**
 * Standard API response wrapper to ensure consistency across the application.
 */
export function apiResponse(success: boolean, data?: any, status: number = 200) {
	return NextResponse.json(
		{
			success,
			...(data !== undefined && { data }),
		},
		{ status }
	);
}

/**
 * Standard API error response wrapper.
 */
export function apiError(message: string, status: number = 400) {
	return NextResponse.json(
		{
			success: false,
			error: message
		},
		{ status }
	);
}
