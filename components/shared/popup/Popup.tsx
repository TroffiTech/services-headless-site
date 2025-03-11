import styles from "./Popup.module.css";

export default function Popup({ children }: { children: React.ReactNode }) {
    return <div className={styles.popup}>{children}</div>;
}
