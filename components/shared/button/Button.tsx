import styles from "./Button.module.css";

export default function Button({
    children,
    callback,
}: {
    children: React.ReactNode;
    callback: () => void;
}) {
    return (
        <button className={styles.button} onClick={callback}>
            {children}
        </button>
    );
}
