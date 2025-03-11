"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AuthForm.module.css";
import Popup from "../shared/popup/Popup";

export default function AuthForm() {
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const navigator = useRouter();

    function unauthorizeStateSetter() {
        setIsUnauthorized(true);
        setTimeout(() => {
            setIsUnauthorized(false);
        }, 2000);
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");

        const response = await fetch("/api/auth", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ password }),
        });

        if (response.status === 200) {
            document.cookie = await response.json();
            navigator.push("/services");
        } else unauthorizeStateSetter();
    }

    return (
        <>
            <form onSubmit={submit} className={styles.form}>
                <h1>Авторизуйтесь</h1>
                <input
                    className={styles.input}
                    type='password'
                    name='password'
                    placeholder='Пароль'
                />
                <button className={styles.button} type='submit'>
                    Войти
                </button>
            </form>
            {isUnauthorized && (
                <Popup>
                    <p>Неверный пароль</p>
                </Popup>
            )}
        </>
    );
}
