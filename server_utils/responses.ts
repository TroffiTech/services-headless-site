import { NextResponse } from "next/server";

export function apiResponse(success: boolean, data?: any, error?: string) {
  return NextResponse.json(
    {
      success,
      ...(data !== undefined && { data }),
      ...(error !== undefined && { error }),
    },
    {
      status: success ? 200 : (error === "Unauthorized" ? 401 : 400),
    }
  );
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}
