import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Safely maps a domain URL to an environment variable key.
 * Example: "https://store.troffi.ru" -> "store"
 */
export function getEnvKeyFromDomain(domain: string): string | null {
	try {
		const url = new URL(domain);
		const hostname = url.hostname;
		const parts = hostname.split(".");
		if (parts.length < 1) return null;

		return parts[0].toLowerCase();
	} catch {
		return null;
	}
}

/**
 * Retrieves WooCommerce auth data from environment variables based on domain.
 * Throws an error if the environment variable is missing or improperly formatted.
 */
export async function getWcAuthData(domain: string) {
	const envKey = getEnvKeyFromDomain(domain);
	if (!envKey) {
		throw new Error("Invalid domain format");
	}

	const envValue = process.env?.[envKey]?.split("+");

	if (!envValue || envValue.length < 2) {
		throw new Error(`WC Auth failed. Please check environment variable: ${envKey}`);
	}

	return {
		storeURL: domain,
		authorizationData: {
			key: envValue[0],
			secret: envValue[1],
		},
	};
}

/**
 * Validates the current server session.
 * Returns the authentication status and session object if available.
 */
export async function validateSession() {
	const session = await getServerSession(authOptions);
	if (!session) {
		return { authenticated: false, session: null };
	}
	return { authenticated: true, session };
}
