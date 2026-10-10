# Project Documentation: Troffi Services

## 📌 Overview
Troffi Services is a management dashboard built with **Next.js 16 (App Router)** that acts as a simplified administrative interface for WooCommerce stores. It allows admins to perform critical store operations (like adding products and updating prices) without navigating the complex WordPress backend.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 (React 19)
- **Styling**: CSS Modules
- **API**: Next.js Route Handlers (API Routes)
- **Integration**: WooCommerce REST API (WP-JSON)
- **Deployment**: Optimized for Vercel (includes `@vercel/analytics` and `@vercel/speed-insights`)

### Core Directory Structure
- `/app`: Routing and API endpoints.
    - `/api/services`: Logic for specific WooCommerce operations (e.g., `add-new-product`, `upload-image`).
    - `/services`: User-facing pages for the management tools.
- `/components`: UI Library.
    - `/services_tabs`: Tool-specific views (e.g., Product Addition, Price Management).
    - `/shared`: Generic UI components (Buttons, Popups, Header).
- `/server_utils`: The "Backend" logic.
    - `/woocommerceAPI`: Pure TS functions handling HTTP requests to WooCommerce with built-in retry logic.
    - `config.ts`: Global constants for API behavior (retries, delays).

### Authentication & Multi-tenancy
The application uses a dynamic credential lookup system:
1. The client sends the `domen` (store URL).
2. The server extracts a key from the domain (e.g., `storename.com` -> `storename`).
3. It looks up the matching environment variable (formatted as `key+secret`).
4. It uses these credentials to authorize requests via Basic Auth to the WooCommerce API.

## 🔄 Key Workflows

### Product Creation Flow
`Frontend (AddProductTab)` $\rightarrow$ `API (/api/services/add-new-product)` $\rightarrow$ `Image Upload (/api/services/upload-image)` $\rightarrow$ `WooCommerce API (createProduct)`

## ⚠️ Known Weak Points & Technical Debt
- **Hardcoded IDs**: The "Manufacturer" attribute ID is hardcoded (`128`) in `createProduct.ts`.
- **Fragile Auth**: Domain-to-env-var mapping is sensitive to domain naming conventions.
- **Generic Error Handling**: Frontend error states are basic and could be more descriptive.
- **Type Safety**: Heavy reliance on `formData.get()` casting; lacks a formal validation layer (e.g., Zod).

## 🚀 Planned Improvements
1. **Attribute Discovery**: Implement a system to fetch attribute IDs by name instead of hardcoding them.
2. **Request Validation**: Add a validation schema for all incoming API requests.
3. **Auth Refactoring**: Centralize the domain-credential logic into a reusable utility or middleware.
4. **UI Feedback**: Add real-time progress indicators for image uploads.
