# 🛍️ Troffi Services

A professional WooCommerce product management suite built with Next.js, designed for efficient batch operations and product synchronization across multiple stores.

## 🌟 Key Features

### 🛠 Product Management
- **Batch Updates**: Update prices and product statuses across multiple stores simultaneously.
- **Smart Synchronization**: Intelligent handling of product existence (distinguishes between "Updated", "Not Found", and "System Error").
- **Product Creation**: Streamlined workflow for adding new products to WooCommerce stores.
- **Media Integration**: Seamless image uploads via the WordPress Media API.
- **Taxonomy Control**: Comprehensive management of WooCommerce categories and manufacturers.

### 🛡️ Technical Excellence
- **Strongly Typed**: Built with TypeScript for maximum reliability and maintainability.
- **Robust Validation**: Strict server-side schema validation using Zod.
- **Secure Auth**: Integrated session management and secure API credential handling.
- **Performance**: Parallel request orchestration using `Promise.allSettled` for high-speed batch operations.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Components**: Tundra Design System
- **API**: WooCommerce REST API & WordPress Media API
- **Validation**: Zod
- **Testing**: Jest & ts-jest

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/someTrickyCase/TroffiServices.git
cd TroffiServices
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory. Store credentials using the domain name as the key (lowercase).

**Format:** `domain_name=consumer_key+consumer_secret`

```env
# Example Store Credentials
hiluxtoyota=ck_xxxxxxxxxxxx+cs_xxxxxxxxxxxx
fordf150=ck_xxxxxxxxxxxx+cs_xxxxxxxxxxxx
fiatfullback=ck_xxxxxxxxxxxx+cs_xxxxxxxxxxxx

# WordPress Application Password (for image uploads)
WP_API_USERNAME=your_admin_username
```

### 4. Run the Application
```bash
npm run dev
```

## 🔐 Credential Guide

### WooCommerce API Keys
1. Navigate to **WooCommerce** $\rightarrow$ **Settings** $\rightarrow$ **Advanced** $\rightarrow$ **REST API**.
2. Create a new key with **Read/Write** permissions.
3. Add to `.env` as: `domain=ck_xxx+cs_xxx`.

### WordPress Application Password
1. Navigate to **WordPress Admin** $\rightarrow$ **Users** $\rightarrow$ **Profile**.
2. Scroll to **Application Passwords** and create a new one.
3. Copy the generated password to `WP_API_USERNAME` in your `.env`.

## 🧪 Testing

The project includes a comprehensive test suite to ensure the stability of the WooCommerce integration.

```bash
# Run all tests
npm test
```

## 📐 Architecture

The project follows a modular service-oriented architecture:
- `app/api`: Serverless route handlers for API operations.
- `server_utils/woocommerceAPI`: Core business logic and WooCommerce client implementation.
- `components/tundra`: Atomic design system for a consistent UI/UX.
- `server_utils/validation`: Centralized Zod schemas for data integrity.
