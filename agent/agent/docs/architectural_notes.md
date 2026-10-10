# Architectural Notes: Troffi Services

## 🎯 Design Philosophy
The application is designed as a **Control Plane** for a distributed network of WooCommerce stores. The primary architectural goal is to minimize the cognitive load on the administrator by abstracting the complexity of managing multiple separate WordPress installations into a single, unified interface.

## 🏗️ Key Architectural Decisions

### 1. Atomic Design System (Tundra UI)
To avoid the "prototype look" and ensure maintainability, the UI is built on a strict atomic hierarchy:
- **Atoms**: Purely presentational, stateless components (`TundraButton`, `TundraInput`). They rely on CSS variables for styling, ensuring that a single color change in `globals.css` propagates everywhere.
- **Molecules**: Simple combinations of atoms (`TundraFormField` = Label + Input + Error).
- **Organisms**: Complex, state-aware sections (`TundraStoreSidebar`, `TundraTabNavigation`).
- **Templates/Pages**: The final assembly using `TundraPageShell`.

### 2. Global Store State (Context Pattern)
With the move to batch processing, store selection was shifted from **local component state** to a **Context-based global state** (`StoreContext`).
- **Decoupling**: Tabs no longer care *how* stores are selected; they only consume the `selectedStores` array.
- **Persistence**: Selection is maintained across tab switches, preventing data loss and reducing redundant user actions.

### 3. Batch Processing Strategy (Client-Side Orchestration)
Instead of implementing a complex batch-API on the server, we use a **Client-Side Orchestration** pattern:
- **Mechanism**: The frontend iterates over the selected stores and fires individual requests to existing API endpoints using `Promise.allSettled`.
- **Trade-off**: This increases network requests but maintains high error granularity. We can report exactly which store failed without the server needing to manage complex partial-failure responses.
- **Concurrency**: Current implementation uses parallel requests; future iterations may introduce a concurrency limit to prevent server-side rate limiting.

### 4. Three-State Result Logic (UX Improvement)
To provide a professional user experience during batch updates, the system implements a **Tri-State Result Pattern**:
- **Updated (Success)**: Product found and successfully updated.
- **Not Found (Silent Success)**: Product does not exist in the target store. This is treated as a success state (no-op) to prevent misleading "Error" flags, but it is visually distinguished on the results page.
- **Failed (Error)**: A genuine system or network failure (e.g., 500 Internal Server Error).
- **Implementation**: This is handled by returning a specific `status: "not_found"` from the API and mapping it to a distinct UI section on the `/services/results` page.

### 5. Security-First API Design
The API layer was hardened using a **Validation-First** approach:
- **Zod Schemas**: Every request is validated against a strict Zod schema *before* any business logic is executed. This prevents "garbage-in" data from reaching the WooCommerce API.
- **Safe Env Mapping**: To avoid fragile string manipulation, a dedicated mapping utility (`server_utils/env.ts`) handles the translation from store domains to secure environment keys (case-insensitive).
- **Auth Guard**: A centralized `guard.ts` utility ensures session validity for all protected API routes, preventing unauthorized access.

### 6. I18n Strategy (Phrases Library)
To allow non-technical managers to update the UI text without touching code, all Russian strings are extracted into a centralized `phrases.ts` library. This separates the **content** from the **presentation**.

## 🛠️ Data Flow Diagram (High Level)
`User Action` $\rightarrow$ `StoreContext (Selected Stores)` $\rightarrow$ `Tab Form` $\rightarrow$ `Client Loop` $\rightarrow$ `API Route` $\rightarrow$ `Zod Validation` $\rightarrow$ `WooCommerce API` $\rightarrow$ `Store Response` $\rightarrow$ `Tri-State Result Mapping` $\rightarrow$ `Results Page`

## 📈 Scalability Considerations
- **Store Growth**: The current `STORES_DOMENS` array is a constant. As the network grows, this could be moved to a database.
- **Performance**: The use of `TundraPageShell` and optimized Next.js Route Handlers ensures minimal latency between the admin and the remote stores.
- **Testability**: A dedicated Jest test suite ensures that the complex WooCommerce interaction logic (especially the Three-State results) remains stable during updates.

## ⚠️ Scope Limitations
- **Add Product**: Note that the "Add Product" functionality (`/api/services/add-new-product`) has **not** been modified or refactored during this update cycle. It remains in its original state and should be reviewed for alignment with the new Three-State result pattern and updated environment mapping in future iterations.
