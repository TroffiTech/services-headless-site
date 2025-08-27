import Header from "@/components/shared/header/Header";
import Link from "next/link";

export default async function SuccsessPage(query: {
	searchParams: Promise<{ store: string; sku: string; price: string }>;
}) {
	const { store, sku, price } = await query.searchParams;

	return (
		<main className="__fullscreen __centerall">
			<section className="section-succsess">
				<Header />
				<h1>🥳Успешно!</h1>
				<p
					style={{ fontSize: "20px", alignSelf: "start" }}
				>{`Адрес магазина: ${store}`}</p>
				<p
					style={{ fontSize: "20px", alignSelf: "start" }}
				>{`Арикул товара: ${sku}`}</p>
				<p
					style={{
						fontSize: "20px",
						alignSelf: "start",
					}}
				>{`Новая цена: ${price} руб.`}</p>
				<Link
					style={{
						fontSize: "24px",
						color: "var(--green-color)",
						textDecoration: "none",
					}}
					href={"/services"}
				>
					Вернуться
				</Link>
			</section>
		</main>
	);
}
