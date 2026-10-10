"use client";

import { useState } from "react";

import ChangePriceNab from "./tabViews/changePriceTab/changeTabPrice";
import AddProductTab from "./tabViews/addProductTab/AddProductTab";
import { TundraTabNavigation } from "@/components/tundra/organisms/TundraTabNavigation";

const servicesList = [
	{ id: 1, title: "Цены" },
	{ id: 2, title: "Создать товар" },
];

export default function Tabs() {
	const [selectedTab, setSelectedTab] = useState(1);
	return (
		<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
			<TundraTabNavigation
				activeTab={selectedTab}
				setActiveTab={setSelectedTab}
				tabs={servicesList}
			/>
			<div style={{ marginTop: "24px" }}>
				<TabDisplay currentTab={selectedTab} />
			</div>
		</div>
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
		default:
			return null;
	}
}
