import { WooClient } from "./localClient";
import { getWcAuthData } from "../env";

const client = new WooClient();

/**
 * Retrieves a configured WooCommerce store instance for the given domain.
 *
 * @param domen The domain of the store (e.g., "store.troffi.ru")
 * @returns A WooCommerce store instance
 * @throws Error if authentication data cannot be retrieved
 */
export async function getStore(domen: string) {
    const { storeURL, authorizationData } = await getWcAuthData(domen);

    // Use the domain as the store identifier in the client
    client.addStore(domen, {
        store_url: storeURL,
        wc_key: authorizationData.key,
        wc_secret: authorizationData.secret,
    });

    return client.selectStore(domen);
}
