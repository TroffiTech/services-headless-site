import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiError } from "@/server_utils/responses";

/**
 * Safely maps a domain URL to an environment variable key.
 * Example: "https://store.troffi.ru" -> "STORE"
 */
export function getEnvKeyFromDomain(domen: string): string | null {
  try {
    const url = new URL(domen);
    const hostname = url.hostname; // store.troffi.ru
    const parts = hostname.split(".");
    if (parts.length < 1) return null;

    // Get the first segment and uppercase it (e.g., 'store' -> 'STORE')
    return parts[0].toUpperCase();
  } catch {
    return null;
  }
}

/**
 * Retrieves WooCommerce auth data from environment variables based on domain.
 */
export async function getWcAuthData(domen: string) {
  const envKey = getEnvKeyFromDomain(domen);
  if (!envKey) {
    throw new Error("Invalid domain format");
  }

  const envValue = process.env?.[envKey]?.split("+");
  if (!envValue || envValue.length < 2) {
    throw new Error(`wcAuth failed. Please check environment variable: ${envKey}`);
  }

  return {
    storeURL: domen,
    authorizationData: {
      key: envValue[0],
      secret: envValue[1],
    },
  };
}

/**
 * Helper to enforce authentication in API routes.
 */
export async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { authenticated: false, session: null };
  }
  return { authenticated: true, session };
}
