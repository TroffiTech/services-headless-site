import updateStore from "@/server_utils/wooCommerceAPI";

export async function POST(request: Request) {
	const dataToUpdate = await request.json();
	const { sku, price, domen } = dataToUpdate;

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
			key: envValue[0],
			secret: envValue[1],
		},
	};

	try {
		const result = await updateStore(
			wcAuthData.storeURL,
			wcAuthData.authorizationData,
			{
				[sku]: price,
			}
		);

		if (result.sucsess) {
			return new Response(
				JSON.stringify({ newPrice: price, sku, storeURL: wcAuthData.storeURL }),
				{
					headers: {
						"content-type": "application/json",
					},
					status: 200,
				}
			);
		} else {
			return new Response("something went wrong...", {
				headers: {
					"content-type": "application/json",
				},
				status: 500,
			});
		}
	} catch {
		return new Response("something went wrong...", {
			headers: {
				"content-type": "application/json",
			},
			status: 500,
		});
	}
}
