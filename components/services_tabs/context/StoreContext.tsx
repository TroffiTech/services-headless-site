"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { STORES_DOMENS } from "@/constants";

interface StoreContextType {
	selectedStores: string[];
	toggleStore: (domen: string) => void;
	selectAll: () => void;
	deselectAll: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
	const [selectedStores, setSelectedStores] = useState<string[]>([]);

	const toggleStore = (domen: string) => {
		setSelectedStores((prev) =>
			prev.includes(domen)
				? prev.filter((d) => d !== domen)
				: [...prev, domen]
		);
	};

	const selectAll = () => {
		setSelectedStores(STORES_DOMENS);
	};

	const deselectAll = () => {
		setSelectedStores([]);
	};

	return (
		<StoreContext.Provider value={{ selectedStores, toggleStore, selectAll, deselectAll }}>
			{children}
		</StoreContext.Provider>
	);
};

export const useStoreContext = () => {
	const context = useContext(StoreContext);
	if (context === undefined) {
		throw new Error("useStoreContext must be used within a StoreProvider");
	}
	return context;
};
