export interface CredentialsType {
    store_url: string;
    wc_key: string;
    wc_secret: string;
    wp_username?: string;
    wp_app_pass?: string;
}

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
