# CLAUDE.md

## Project

ScentStack is a luxury fragrance ecommerce platform focused on the Costa Rican market.

Business domains:

- Products
- Brands
- Cart
- Checkout
- Orders
- Customers
- Admin

This project was originally forked from a medical platform.

Legacy references may still exist:

- patients
- appointments
- medical
- medical-records

Never introduce new medical terminology.
Always use ecommerce and fragrance vocabulary.

---

## Tech Stack

- Next.js 14 (Pages Router)
- React
- TypeScript (strict)
- TanStack Query v5
- Tailwind CSS
- React Hook Form
- Yup
- PostgreSQL (Neon)

Path alias:

```txt
@/* -> src/*
```

---

## Commands

```bash
npm run dev

npm run lint

npm run build

npm run build:styles

npm run watch:styles
```

No test runner is currently configured.

---

## Architecture

Feature-oriented modular monolith.

```txt
src/
├── pages/
├── features/
├── components/
├── shared/
├── services/
├── repositories/
├── hooks/
└── types/
```

### Responsibilities

Pages:

- Composition only
- No business logic

Components:

- Presentation only
- No direct API calls

Hooks:

- State orchestration
- Query and mutation composition

Services:

- Business rules
- Calculations
- Transformations

Repositories:

- Data access only

Do not move business logic into UI components.

---

## Routing

Public:

```txt
/
/catalog
/cart
/checkout
/login
```

Admin:

```txt
/admin/*
```

Protected through:

```txt
src/hocs/auth.tsx
```

---

## Data Fetching

TanStack Query is the standard.

Queries:

```txt
src/shared/api/querys/
```

Mutations:

```txt
src/shared/api/mutations/
```

Transport:

```txt
src/shared/api/api-service-client.ts
```

Do not fetch directly inside components.

---

## Forms

Always use:

- React Hook Form
- Yup

Do not introduce Formik.

---

## Styling

Use:

- Tailwind CSS
- tailwind()
- Typography

Avoid:

- Inline styles
- Duplicate typography classes

---

## Design System

Typography is mandatory.

Do not render business text directly using:

- h1
- h2
- h3
- p

Use:

```tsx
<Typography variant={TypographyVariant.*}>
```

TypographyVariant is the single source of truth.

---

## Naming

Prefer descriptive names.

Good:

```ts
productUuid;
orderId;
pageNumber;
pageLimit;
productRows;
```

Avoid:

```ts
p;
r;
tmp;
x;
y;
```

Keep framework conventions when appropriate.

Examples:

```ts
router.query.id;
product.id;
```

are acceptable.

---

## Environment Variables

Required:

```bash
ECOMMERCE_DB_POSTGRES_URL

NEXT_PUBLIC_AUTH_API_URL

NEXT_PUBLIC_CATALOG_API_URL

NEXT_PUBLIC_SINPE_NUMBER

NEXT_PUBLIC_SINPE_OWNER

NEXT_PUBLIC_IBAN

NEXT_PUBLIC_WHATSAPP_BUSINESS
```

---

## Documentation

All project documentation lives under `.claude/docs/`. Every doc below is authoritative context for the current state of the codebase.

No doc under `.claude/docs/` is optional — all are loaded as context.

### Project root
- [README](README.md) — Setup, rutas, estado del proyecto con checkboxes de pendientes por etapa

### Overview & Status
- [App Overview](.claude/docs/00-app-overview.md) — Domains, routes, tech stack, session model, payment flow
- [MVP Status](.claude/docs/01-mvp-status.md) — What works, what's placeholder, mocked data, priorities
- [Database Schema](.claude/docs/02-database-schema.md) — All tables, columns, SQL patterns
- [Roadmap Visual Frontend](.claude/docs/roadmap-visual-frontend.md) — Sesiones cortas por prioridad: design system, filtros, cart drawer, decants

### Features (per-domain context)
- [Catalog](.claude/docs/features/catalog.md) — Product list & detail, API endpoints, types
- [Cart](.claude/docs/features/cart.md) — Session-based cart, API endpoints, session cookie
- [Checkout & Orders](.claude/docs/features/checkout-orders.md) — Checkout flow, order creation, success page
- [Admin — Inventario](.claude/docs/features/admin-inventory.md) — Product CRUD, protection, forms
- [Admin — Ventas](.claude/docs/features/admin-sales.md) — Order management, status flow, i18n
- [Admin — Dashboard](.claude/docs/features/admin-dashboard.md) — Placeholder stats, bug crítico sin protección
- [Auth](.claude/docs/features/auth.md) — JWT admin auth, HOC de protección, limitaciones

### Patterns (how to add new things)
- [Add Feature](.claude/docs/patterns/add-feature.md) — Checklist completo: types → repo → service → API → query → container → page → i18n
- [Add API Route](.claude/docs/patterns/add-api-route.md) — Estructura, auth, errores, respuestas estándar
- [Add Container Component](.claude/docs/patterns/add-component-container.md) — Hook + container pattern, Typography, i18n
- [Add Query/Mutation](.claude/docs/patterns/add-query-mutation.md) — TanStack Query v5, ApiServiceClient, query keys

### Audits (known issues)
- [Bugs](.claude/docs/audits/bugs.md) — Bug crítico dashboard, middleware sin trackear, any types
- [i18n Gaps](.claude/docs/audits/i18n-gaps.md) — Strings hardcodeados, terminología médica legacy, nombre incorrecto
- [Features Incompletas](.claude/docs/audits/incomplete-features.md) — Páginas vacías, TODOs, features deseables

---

## Investigation Rules

Before reading files:

Classify the issue:

1. Compile error
2. Server error
3. Browser runtime error
4. Data issue
5. Styling issue

Do not scan the repository first.

Start from:

1. Reproducing page
2. Direct children
3. Related hooks
4. Related queries/mutations

Expand only when necessary.

---

## Token Efficiency

Read the minimum number of files required.

Prefer:

- Search
- Symbol lookup
- Focused reads

Avoid repository-wide exploration.

Do not read unrelated:

- package.json
- lock files
- i18n
- SQL
- configuration

unless evidence points there.

Stop investigation once a probable root cause is identified.

Report findings before continuing.

---

## Refactoring Rules

Before large refactors:

1. Explain the problem
2. Explain the proposed solution
3. List impacted files

Do not perform large architectural changes without explicit approval.

---

## Session Protocol

After completing any development session (any stage from the roadmap):

1. Mark the completed checkboxes in `README.md` (section "En Desarrollo").
2. Update the affected feature doc under `.claude/docs/features/` to reflect the new state.
3. If the database schema changed, update `02-database-schema.md`.
4. If a new reusable pattern was introduced, document it in `.claude/docs/patterns/`.
5. If a bug listed in `audits/bugs.md` was fixed, remove it from that file.

Do not close a session without updating `README.md`.

---

## Legacy Cleanup

Medical-domain code still exists.

When touching related files:

- Prefer ecommerce terminology
- Do not expand medical abstractions
- Gradually migrate to ecommerce naming

## Communication

Always respond in Spanish unless explicitly requested otherwise.

Use concise technical explanations.

When debugging:

- Explain findings before proposing changes.
- Show file paths.
- Show probable root cause.
- Explain confidence level.

Preferred format:

1. Diagnóstico
2. Evidencia
3. Solución propuesta
4. Archivos afectados

Avoid long narratives.

Avoid describing every file that was inspected.

Report only relevant findings.

Debugging Output

When investigating:

Do not print detailed reasoning.

Do not print file-by-file analysis.

Do not describe every search performed.

Return only:

Root cause
Evidence
Impacted files
Recommended fix

Keep responses under 300 words unless explicitly asked for more detail.


Investigation Budget

For debugging tasks:

Maximum 10 files before reporting findings.
Maximum 2 search rounds before reporting findings.
If no root cause is found, stop and ask for guidance.

Do not continue expanding the investigation indefinitely.