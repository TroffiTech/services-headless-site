import { NextRequest, NextResponse } from "next/server";

import getManufacturers from "@/server_utils/woocommerceAPI/getManufacturers";

export async function POST(request: NextRequest) {
	try {
		const { domen } = await request.json();

		if (!domen) {
			return NextResponse.json({ error: "Domain is required" }, { status: 400 });
		}

		const envKey = domen.split("//")[1].split(".")[0];
		const envValue = process.env?.[envKey]?.split("+");

		if (!envValue) {
			return NextResponse.json(
				{ error: "wcAuth failed. Please, check wc .env keys" },
				{ status: 500 }
			);
		}

		const wcAuthData = {
			storeURL: domen,
			authorizationData: {
				key: envValue[0],
				secret: envValue[1],
			},
		};

		const manufacturers = await getManufacturers(wcAuthData.storeURL, wcAuthData.authorizationData);

		return NextResponse.json({
			success: true,
			manufacturers,
		});
	} catch (error) {
		console.error("Error fetching manufacturers:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
