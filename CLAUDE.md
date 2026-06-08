# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Domain

This is a **fragrance/perfume e-commerce store**. Core business entities:
- **Products** — fragrances with variants (size, concentration)
- **Cart** — session/persistent shopping cart
- **Orders** — checkout and order history
- **Customers** — registered users
- **Admin** — inventory, sales, customers, settings

> ⚠️ The codebase was forked from a medical system. You may encounter references
> to `patients`, `appointments`, `medical`, or `MEDICAL_RECORDS` — these are
> legacy artifacts being removed. Do NOT generate new code using medical domain
> terminology. Always use the fragrance/ecommerce domain vocabulary above.

---

## Commands

```bash
npm run dev           # Start Next.js dev server
npm run lint          # Run ESLint (next/core-web-vitals)
npm run build:styles  # Compile styles/global.scss → public/styles.css
npm run watch:styles  # Watch SCSS and recompile on change
```

> No test runner is configured yet.

---

## Architecture

Next.js 14 with **Pages Router** (`src/pages/`). TypeScript strict mode. Path alias `@/*` → `./src/*`.

### Routing

| Prefix | Purpose | Auth |
|---|---|---|
| `/` `/login` `/catalog` `/cart` `/checkout` | Public store | None |
| `/admin/*` | Admin dashboard (inventory, sales, customers, settings) | Protected via HOC |

Route constants → `src/shared/navigation/routes.ts`  
Auth guard → `src/hocs/auth.tsx` using `authorizeServerSidePage()`

### Data Fetching

TanStack Query v5 for all server state:
- **Mutations** → `src/shared/api/mutations/<domain>/`
- **Queries** → `src/shared/api/querys/<domain>/`
- **Transport** → `src/shared/api/api-service-client.ts` (injects Bearer token from cookies)

Valid domains for new code: `products`, `cart`, `orders`, `customers`, `auth`

### Environment Variables

```bash
ECOMMERCE_DB_POSTGRES_URL       # Neon PostgreSQL connection string
NEXT_PUBLIC_AUTH_API_URL        # Authentication / identity service
NEXT_PUBLIC_CATALOG_API_URL     # Products, cart, orders
```

> The old variables `NEXT_PUBLIC_IDENTITY_API_URL` and `NEXT_PUBLIC_MEDICAL_RECORDS_API_URL` have been removed.

### UI State

Two React contexts provided in `src/pages/_app.tsx`:
- `NavigationContext` → `src/shared/context/navigation-context.tsx` (sidebar open/close)
- `DashboardContext` → `src/layouts/dashboard/dashboard-context.tsx` (admin layout)

### Styling

Tailwind CSS + SASS.

Design tokens (`tailwind.config.js`):
- Primary blue `#2563EB` · Accent gold `#D4AF37` · Secondary cyan `#0EA5E9`
- Dark mode via `class` strategy
- Breakpoints: `xs` 340px → `xl` 1366px
- Fonts: Inter (`font-sans`), Poppins (`font-display`)

Utilities: `clsx` + `tailwind-merge` → `src/utils/tailwind-utils.ts`  
Global styles: `styles/globals.scss` — run `build:styles` after SCSS changes.

### Forms

**React Hook Form + Yup** is the standard. Formik is installed but deprecated — do not use it for new forms.

### i18n

i18next configured for **Spanish**.  
Translation keys → `src/static/texts/i18n.ts`  
Setup → `src/shared/i18n/i18n.ts`

### Auth

Tokens stored in cookies via `js-cookie`.  
Cookie helpers → `src/shared/utils/cookies-manager.ts`

> Cookies are not HttpOnly — this is a known security issue pending resolution.

---

## Known Technical Debt

| Area | Issue | Priority |
|---|---|---|
| Medical domain | Mutations/queries referencing patients/appointments still exist | 🔴 High |
| No tests | Any refactor is a blind leap | 🔴 High |
| .env empty | Must document all required variables | 🔴 High |
| Formik | Installed but unused — should be removed | 🟡 Medium |
| Pages Router | Legacy path — App Router migration pending | 🟡 Medium |
| Auth cookies | Not HttpOnly, no refresh token visible | 🟡 Medium |
| build:styles | Manual step, easy to forget | 🟢 Low |
| react-quill | Unmaintained, known issues with React 18 | 🟢 Low |

---

## Code Conventions

- Functional components only — no class components
- Named exports preferred over default exports
- New queries/mutations must use ecommerce domain names only
- Tailwind for styles — avoid inline styles
- Always use `tailwind()` from `src/utils/tailwind-utils.ts` for conditional classes (exported as `tailwind`, not `cn`)

### Naming — no abbreviations, ever

Every variable, parameter, and alias must use the full domain name:

| ❌ Avoid | ✅ Use |
|---|---|
| `req`, `res` | `request`, `response` |
| `auth` (header/token context) | `authorizationHeader`, `bearerToken` |
| `p`, `c`, `v`, `r`, `img` (loop/SQL alias) | `product`, `cart`, `variant`, `row`, `image` |
| `data`, `rows` (generic) | `productData`, `productRows`, `cartRows` |
| `id` (parameter) | `productUuid`, `cartUuid`, `orderId` |
| `page`, `limit` | `pageNumber`, `pageLimit` |