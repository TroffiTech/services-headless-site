"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

import Header from "@/components/shared/header/Header";

function ErrorContent() {
	const searchParams = useSearchParams();
	const errorMessage = searchParams.get("error");
	const sku = searchParams.get("sku");

	return (
		<main>
			<section className="__onecolumn">
				<Header />
				<h1 style={{ fontSize: "200px", color: "var(--gray-color)" }}>500</h1>
				<p style={{ fontSize: "30px" }}>😵😵😵</p>

				<div
					style={{
						maxWidth: "600px",
						margin: "20px auto",
						padding: "20px",
						backgroundColor: "var(--light-gray-color)",
						borderRadius: "8px",
						textAlign: "center",
					}}
				>
					<p style={{ fontSize: "18px", color: "var(--dark-color)", marginBottom: "10px" }}>
						{errorMessage || "Что-то сломалось.. Попробуйте позже либо проверьте введенные данные."}
					</p>

					{sku && (
						<p style={{ fontSize: "16px", color: "var(--gray-color)", marginTop: "10px" }}>
							Артикул: <strong>{sku}</strong>
						</p>
					)}
				</div>

				<div style={{ marginTop: "20px" }}>
					<Link
						style={{
							fontSize: "24px",
							color: "var(--green-color)",
							textDecoration: "none",
							marginRight: "20px",
						}}
						href={"/services"}
					>
						Создать новый товар
					</Link>

					<button
						onClick={() => window.history.back()}
						style={{
							fontSize: "18px",
							color: "var(--blue-color)",
							background: "none",
							border: "none",
							cursor: "pointer",
							textDecoration: "underline",
						}}
					>
						Вернуться и исправить
					</button>
				</div>
			</section>
		</main>
	);
}

export default function ErrorPage() {
	return (
		<Suspense
			fallback={
				<main>
					<section className="__onecolumn">
						<Header />
						<div style={{ textAlign: "center", padding: "50px" }}>
							<p>Загрузка...</p>
						</div>
					</section>
				</main>
			}
		>
			<ErrorContent />
		</Suspense>
	);
}
