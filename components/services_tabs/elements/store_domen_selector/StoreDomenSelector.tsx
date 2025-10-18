import { Dispatch, SetStateAction, useState } from "react";

import { checkSVG, crossSVG } from "@/components/icons/icons";
import styles from "./StoreDomenSelector.module.css";
import { STORES_DOMENS } from "@/constants";

export default function StoreDomenSelector({
	value,
	valueSetter,
}: {
	value: string;
	valueSetter: Dispatch<SetStateAction<string>>;
}) {
	const [isDropped, setIsDropped] = useState(false);

	return (
		<>
			<div onClick={() => setIsDropped(true)} className={styles.storeDomenSelector}>
				👉 {value}
			</div>
			<Modal
				isDropped={isDropped}
				dropSetter={setIsDropped}
				selected={value}
				selectSetter={valueSetter}
			/>
		</>
	);
}

function Modal({
	isDropped,
	dropSetter,
	selected,
	selectSetter,
}: {
	isDropped: boolean;
	dropSetter: Dispatch<SetStateAction<boolean>>;
	selected: string;
	selectSetter: Dispatch<SetStateAction<string>>;
}) {
	return (
		<div
			className={
				isDropped
					? styles.storeDomenSelector_modalContainer__showed
					: styles.storeDomenSelector_modalContainer__hidden
			}
		>
			<div className={styles.toreDomenSelector_modalContainer_inner}>
				<div
					onClick={() => dropSetter(false)}
					className={styles.storeDomenSelector_modalContainer_cross}
				>
					{crossSVG}
				</div>
				<h2 className={styles.storeDomenSelector_modalContainer_title}>Выберите</h2>
				<ul className={styles.storeDomenSelector_modalContainer_list}>
					{STORES_DOMENS.map((domen, index) => (
						<li
							key={index}
							onClick={() => {
								dropSetter(false);
								selectSetter(domen);
							}}
						>
							<p>{`${index + 1}. ${domen}`}</p>
							<div
								className={
									selected === domen
										? styles.storeDomenSelector_modalContainer_list_icon__selected
										: styles.storeDomenSelector_modalContainer_list_icon__unselected
								}
							>
								{checkSVG}
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
