import { WoocommerceAPI } from "@/server_utils/wooCommerceAPI";

export async function POST(request: Request) {
    const dataToUpdate = await request.json();
    const { sku, price, domen } = dataToUpdate;

    const productDataUpdatedTo = { [sku]: price };

    const envKey = domen.split("//")[1].split(".")[0];
    const envValue = process.env?.[envKey]?.split("+");

    if (!envValue)
        return new Response("wcAuth failed. Please, check wc .env keys", {
            headers: {
                "content-type": "application/json",
            },
            status: 500,
        });

    const wcAuthData = {
        storeURL: domen,
        authorizationData: {
            consumerKey: envValue[0],
            consumerSecret: envValue[1],
        },
    };

    try {
        const wc = new WoocommerceAPI([wcAuthData], productDataUpdatedTo);
        await wc.fetchProductsIds();
        await wc.updateProductsPrices();

        const result = wc.getFinalResult;

        return new Response(JSON.stringify(result), {
            headers: {
                "content-type": "application/json",
            },
            status: 200,
        });
    } catch {
        return new Response("something went wrong...", {
            headers: {
                "content-type": "application/json",
            },
            status: 500,
        });
    }
}
