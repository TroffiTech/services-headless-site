"use client";

import Tabs from "@/components/services_tabs/Tabs";
import { TundraPageShell } from "@/components/tundra/organisms/TundraPageShell";
import { TundraStoreSidebar } from "@/components/tundra/organisms/TundraStoreSidebar";
import { StoreProvider } from "@/components/services_tabs/context/StoreContext";
import { signOut } from "next-auth/react";

export default function Services() {
	return (
		<StoreProvider>
			<TundraPageShell
				onLogout={() => signOut({ callbackUrl: "/auth/login" })}
			>
				<div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
					<TundraStoreSidebar />
					<div style={{ flex: 1, minWidth: 0 }}>
						<Tabs />
					</div>
				</div>
			</TundraPageShell>
		</StoreProvider>
	);
}
