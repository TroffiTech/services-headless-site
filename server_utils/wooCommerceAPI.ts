type PromiseFulfilledResult = {
    status: "fulfilled";
    value: Array<{ id: string | undefined }>;
};

type PriceList = {
    [key: string]: string;
};

type AuthorizationData = { consumerKey: string; consumerSecret: string };
type StoreData = { storeURL: string; authorizationData: AuthorizationData };

type ProductIdGetterRequestData = {
    storeURL: string;
    authorizationData: AuthorizationData;
    prductSku: string;
};

type ProductPriceUpdaterRequest = {
    sku?: string;
    id: string | undefined;
    authorizationData: AuthorizationData;
    storeURL: string;
    newPrice: string;
};

export class WoocommerceAPI {
    private _productsIdsPromises: Array<Promise<ReturnType<typeof this.fetchProductIdBySku>>> = [];

    private priceList: PriceList = {};
    private storesAuthData: Array<StoreData> = [];

    private productIdGettersRequests: Array<ProductIdGetterRequestData> = [];
    private productsPricesUpdaterRequests: Array<ProductPriceUpdaterRequest> = [];

    public updatingResult: Array<{ newPrice: string; storeURL: string; sku: string }> = [];

    constructor(storesAuthData: Array<StoreData>, priceList: PriceList) {
        this.storesAuthData = [...storesAuthData];
        this.priceList = { ...priceList };
    }

    private async fetchProductIdBySku(requestData: ProductIdGetterRequestData) {
        try {
            const { storeURL, prductSku, authorizationData } = requestData;
            const data = await fetch(`${storeURL}/wp-json/wc/v3/products/?sku=${prductSku}`, {
                headers: {
                    authorization: `Basic ${btoa(
                        authorizationData.consumerKey + ":" + authorizationData.consumerSecret
                    )}`,
                    "content-type": "application/json",
                },
            });
            return await data.json();
        } catch {
            console.warn(`something went wrong while fetch ${requestData.storeURL}`);
        }
    }

    private async putProductPriceByID(
        storeURL: string,
        authorizationData: AuthorizationData,
        id: string,
        newPrice: string
    ) {
        try {
            const data = await fetch(`${storeURL}/wp-json/wc/v3/products/${id}`, {
                method: "put",
                headers: {
                    authorization: `Basic ${btoa(
                        authorizationData.consumerKey + ":" + authorizationData.consumerSecret
                    )}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({ regular_price: newPrice }),
            });
            return data.ok;
        } catch {
            console.warn(`something went wrong while updating ${storeURL} with ID: ${id}`);
        }
    }

    private _setIdsGettersRequests() {
        this.storesAuthData.map((authData) => {
            for (const sku in this.priceList) {
                this.productIdGettersRequests.push({
                    authorizationData: authData.authorizationData,
                    storeURL: authData.storeURL,
                    prductSku: sku,
                });
            }
        });
    }

    public async fetchProductsIds() {
        this._setIdsGettersRequests();
        this.productIdGettersRequests.map((requestData) => {
            this._productsIdsPromises.push(this.fetchProductIdBySku(requestData));
        });

        const promisesResults: Array<PromiseFulfilledResult | PromiseRejectedResult> =
            await Promise.allSettled(this._productsIdsPromises);

        promisesResults.map((result, index) => {
            if (result.status === "rejected") return;
            const id = result && result.value?.length ? result.value[0].id : undefined;
            const productPriceUpdaterRequestData = {
                id,
                sku: this.productIdGettersRequests[index].prductSku,
                newPrice: this.priceList[this.productIdGettersRequests[index].prductSku],
                storeURL: this.productIdGettersRequests[index].storeURL,
                authorizationData: this.productIdGettersRequests[index].authorizationData,
            };
            this.productsPricesUpdaterRequests.push(productPriceUpdaterRequestData);
        });
    }

    public async updateProductsPrices() {
        for (const priceUpdaterRequest of this.productsPricesUpdaterRequests) {
            const { authorizationData, id, storeURL, newPrice, sku } = priceUpdaterRequest;
            if (!id || !newPrice) continue;
            const isOk = await this.putProductPriceByID(storeURL, authorizationData, id, newPrice);
            if (isOk) this.updatingResult.push({ newPrice, storeURL, sku: sku || "undefined" });
        }
    }

    get getIntermediateResult() {
        return this.productsPricesUpdaterRequests;
    }

    get getFinalResult() {
        return this.updatingResult;
    }
}
