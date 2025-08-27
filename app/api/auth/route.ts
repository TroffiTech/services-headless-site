export async function POST(request: Request) {
	const password = (await request.json()).password;
	if (password === process.env.password) {
		return new Response(JSON.stringify(`authenticated=true`), {
			headers: {
				"content-type": "application/json",
			},
			status: 200,
		});
	} else {
		return new Response("Unauthorized", {
			headers: {
				"content-type": "application/json",
			},
			status: 401,
		});
	}
}
