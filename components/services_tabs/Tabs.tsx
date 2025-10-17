"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styles from "./Tabs.module.css";
import ChangePriceNab from "./tabViews/changePriceTab/changeTabPrice";
import AddProductTab from "./tabViews/addProductTab/AddProductTab";

const servicesList = [
	{ id: 1, title: "Цены" },
	{ id: 2, title: "Создать товар" },
	{ id: 3, title: "Люди" },
];

export default function Tabs() {
	const [selectedTab, setSelectedTab] = useState(1);
	return (
		<div className={styles.tabs}>
			<TabsList currentTab={selectedTab} currentTabSetter={setSelectedTab} />
			<div className={styles.tabs_tabsDisplay}>
				<TabDisplay currentTab={selectedTab} />
			</div>
		</div>
	);
}

function TabsList({
	currentTab,
	currentTabSetter,
}: {
	currentTab: number;
	currentTabSetter: Dispatch<SetStateAction<number>>;
}) {
	return (
		<ul className={styles.tabs_tabsList}>
			{servicesList.map((service) => (
				<li
					onClick={() => currentTabSetter(service.id)}
					key={service.id}
					className={
						service.id === currentTab
							? styles.tabs_tabsList_selectedItem
							: styles.tabs_tabsList_unselectedItem
					}
				>
					{service.title}
				</li>
			))}
		</ul>
	);
}

function TabDisplay({ currentTab }: { currentTab: number }) {
	switch (currentTab) {
		case 1: {
			return <ChangePriceNab />;
		}
		case 2: {
			return <AddProductTab />;
		}
		case 3: {
			return <ThirdTab />;
		}
	}
}

function ThirdTab() {
	return (
		<>
			<div className={styles.tabs_tabsDisplay_description}>Люди</div>
		</>
	);
}
