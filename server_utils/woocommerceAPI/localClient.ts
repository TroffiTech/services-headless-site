import { CredentialsType } from "./types";

/**
 * A local implementation of the WooCommerce API Client.
 * This replaces the broken npm package and provides the necessary methods
 * for product creation, price updates, and ID resolution.
 *
 * We export the interfaces here for consistency.
 */
export interface ProductType {
    name: string;
    sku: string;
    price: number;
    description?: string;
    shortDescription?: string;
    featuredImage?: string;
    images?: string[];
    categories?: {
        id: number;
    }[];
    attributes?: {
        id: number;
        options: string[];
    }[];
    status?: string;
}

export class WooClient {
    private stores: Map<string, CredentialsType> = new Map();
    private selectedStoreId: string | null = null;

    addStore(id: string, credentials: CredentialsType) {
        this.stores.set(id, credentials);
    }

    selectStore(id: string) {
        if (!this.stores.has(id)) {
            throw new Error(`Store ${id} not found. Please add it first using addStore().`);
        }
        this.selectedStoreId = id;
        const creds = this.stores.get(id)!;
        return new Store(creds);
    }

    selectAllStores() {
        return Array.from(this.stores.entries()).map(([id, creds]) => ({ id, ...creds }));
    }

    removeStore(id: string) {
        this.stores.delete(id);
        if (this.selectedStoreId === id) {
            this.selectedStoreId = null;
        }
    }

    removeAllStores() {
        this.stores.clear();
        this.selectedStoreId = null;
    }
}

class Store {
    constructor(private creds: CredentialsType) {}

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.creds.store_url}/wp-json/wc/v3${endpoint}`;
        const auth = btoa(`${this.creds.wc_key}:${this.creds.wc_secret}`);

        const defaultOptions: RequestInit = {
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        };

        console.log(`[WooClient Request] ${options.method || 'GET'} ${url}`);
        if (options.body) {
            console.log(`[WooClient Body] ${options.body}`);
        }

        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[WooClient Error] status: ${response.status}, body: ${errorText}`);
            const error = JSON.parse(errorText).catch(() => ({ message: "Unknown error" }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`[WooClient Response] ${response.status} OK`);
        return data;
    }

    async createProducts(products: ProductType[]) {
        const response = await this.request("/products/batch", {
            method: "POST",
            body: JSON.stringify({ create: products }),
        });

        return response.map((res: any) => {
            if (res.error) return { error: res.error };
            return { id: res.id, sku: res.sku, name: res.name, price: res.regular_price };
        });
    }

    async updateProducts(products: any[]) {
        const response = await this.request("/products/batch", {
            method: "POST",
            body: JSON.stringify({ update: products }),
        });

        // WooCommerce batch API returns an object { update: [...], create: [...], delete: [...] }
        const updates = response.update || [];

        return updates.map((res: any) => {
            if (res.error) return { error: res.error };
            return res;
        });
    }

    async updatePrices(skuPriceMap: { [sku: string]: number }) {
        const skus = Object.keys(skuPriceMap);
        const ids = await this.getProductIdsBySkus(skus);

        const updatePayload = ids.map(item => ({
            id: item.id,
            regular_price: skuPriceMap[item.sku].toString()
        }));

        return this.updateProducts(updatePayload);
    }

    async getProductIdsBySkus(skus: string[]) {
        const results = await Promise.all(skus.map(async (sku) => {
            try {
                const products = await this.request(`/products?sku=${sku}&_fields=id,sku`);
                return products[0] || null;
            } catch {
                return null;
            }
        }));
        return results.filter((p): p is {id: number, sku: string} => p !== null);
    }

    async getAllProducts() {
        return this.request("/products");
    }

    async getCategories() {
        return this.request("/products/categories");
    }

    async getAttributes() {
        return this.request("/products/attributes");
    }

    async uploadImages(paths: string[]) {
        throw new Error("uploadImages not implemented in local client. Please use the existing API route.");
    }
}

export { Store };
