import getAttributes from "./getAttributes";

export interface Manufacturer {
	id: number;
	name: string;
	slug: string;
}

export default async function getManufacturers(
	storeUrl: string,
	apiCredentials: { key: string; secret: string }
): Promise<Manufacturer[]> {
	try {
		console.log("🔍 Поиск атрибута производителя...");

		// 1. Получаем все атрибуты
		const attributes = await getAttributes(storeUrl, apiCredentials);

		// 2. Ищем атрибут производителя по разным возможным названиям
		const manufacturerAttribute = attributes.find(
			(attr) =>
				attr.name.toLowerCase().includes("производитель") ||
				attr.name.toLowerCase().includes("manufacturer") ||
				attr.name.toLowerCase().includes("brand") ||
				attr.name.toLowerCase().includes("бренд") ||
				attr.slug.includes("proizvoditel") ||
				attr.slug.includes("manufacturer") ||
				attr.slug.includes("brand")
		);

		if (!manufacturerAttribute) {
			console.log("❌ Атрибут производителя не найден");
			console.log(
				"Доступные атрибуты:",
				attributes.map((a) => ({ name: a.name, slug: a.slug }))
			);
			return [];
		}

		console.log(
			"✅ Найден атрибут производителя:",
			manufacturerAttribute.name,
			"ID:",
			manufacturerAttribute.id
		);

		// 3. Получаем термины (значения) атрибута производителя
		const response = await fetch(
			`${storeUrl}/wp-json/wc/v3/products/attributes/${manufacturerAttribute.id}/terms?per_page=100`,
			{
				headers: {
					authorization: `Basic ${btoa(apiCredentials.key + ":" + apiCredentials.secret)}`,
					"content-type": "application/json",
				},
				signal: AbortSignal.timeout(120_000),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const terms = await response.json();
		console.log("✅ Получено производителей:", terms.length);

		return terms.map((term: Manufacturer) => ({
			id: term.id,
			name: term.name,
			slug: term.slug,
		}));
	} catch (error) {
		console.error("Error fetching manufacturers:", error);
		return [];
	}
}
