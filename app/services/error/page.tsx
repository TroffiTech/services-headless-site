import Header from "@/components/shared/header/Header";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <main>
            <section className='__onecolumn'>
                <Header />
                <h1 style={{ fontSize: "200px", color: "var(--gray-color)" }}>500</h1>
                <p style={{ fontSize: "30px" }}>😵😵😵</p>
                <p style={{ fontSize: "18px", color: "var(--gray-color)" }}>
                    Что-то сломалось.. Попробуйе позже
                </p>
                <Link
                    style={{
                        fontSize: "24px",
                        color: "var(--green-color)",
                        textDecoration: "none",
                    }}
                    href={"/services"}>
                    Вернуться
                </Link>
            </section>
        </main>
    );
}
