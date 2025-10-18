import styles from "./Button.module.css";

interface ButtonProps {
	children: React.ReactNode;
	callback: () => void;
	disabled?: boolean;
}

export default function Button({ children, callback, disabled = false }: ButtonProps) {
	return (
		<button
			onClick={callback}
			disabled={disabled}
			className={disabled ? styles.buttonDisabled : styles.button}
		>
			{children}
		</button>
	);
}
