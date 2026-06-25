# ScentStack Ecommerce

Plataforma de ecommerce de fragancias de lujo orientada al mercado costarricense. Permite a clientes navegar y comprar perfumes (botellas y decants), y al equipo de administración gestionar inventario y pedidos.

---

## Setup

```bash
# Instalar dependencias
yarn install

# Variables de entorno requeridas
cp .env.example .env.local

# Desarrollo
npm run dev

# Build de estilos (Tailwind standalone)
npm run build:styles

# Build de producción
npm run build
```

### Variables de entorno

```bash
ECOMMERCE_DB_POSTGRES_URL=        # PostgreSQL Neon
JWT_SECRET=                        # Secreto JWT (server-only)
NEXT_PUBLIC_SINPE_NUMBER=         # Número SINPE Móvil
NEXT_PUBLIC_SINPE_OWNER=          # Nombre dueño SINPE
NEXT_PUBLIC_IBAN=                 # IBAN transferencia
NEXT_PUBLIC_WHATSAPP_BUSINESS=    # WhatsApp para comprobantes
NEXT_PUBLIC_AUTH_API_URL=         # Base URL auth
NEXT_PUBLIC_CATALOG_API_URL=      # Base URL catálogo/órdenes
```

---

## Stack

Next.js 14 (Pages Router) · React 18 · TypeScript strict · TanStack Query v5 · Tailwind CSS · React Hook Form + Yup · PostgreSQL (Neon serverless)

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/catalog` |
| `/catalog` | Listado de fragancias con filtros |
| `/catalog/[slug]` | Detalle de producto |
| `/cart` | Carrito de compra |
| `/checkout` | Formulario de entrega |
| `/checkout/success/[id]` | Confirmación + instrucciones de pago |
| `/login` | Login admin |
| `/admin/*` | Panel de administración (protegido con JWT) |

---

## Estado del Proyecto

### ✅ MVP Base — Funcional al 100%

- [x] Catálogo de fragancias con búsqueda y paginación
- [x] Detalle de producto con selección de variante
- [x] Carrito session-based (agregar / actualizar / eliminar)
- [x] Checkout con datos de entrega
- [x] Confirmación de pedido con instrucciones de pago (SINPE / IBAN)
- [x] Admin: Login con JWT (1h)
- [x] Admin: CRUD de productos con variantes e imágenes
- [x] Admin: Lista y detalle de pedidos con cambio de estado

---

### 🚧 En Desarrollo — Roadmap Visual Frontend

Plan completo con contexto técnico en [`.claude/docs/roadmap-visual-frontend.md`](.claude/docs/roadmap-visual-frontend.md).

#### P1 — Design System & Carrusel

- [ ] **S0-A** Paleta estandarizada: reemplazar azul legacy por negro elegante, definir superficies cálidas
- [ ] **S1-A** Carrusel hero: auto-play, pausa en hover, dots indicators

#### P2 — Campos de filtro en BD y Admin

- [ ] **S0-B** Migraciones SQL: `gender`, `olfactory_family` en productos; `presentation_type` en variantes
- [ ] **S0-C** Types → Repo → Service → API: soporte de nuevos campos y parámetros de filtro
- [ ] **S1-B** Admin: formularios actualizados con gender, familia olfativa y tipo de presentación

#### P3 — Filtros Avanzados en Catálogo

- [ ] **S2-A** Hook de filtros + URL params (deep-linking)
- [ ] **S2-B** UI: panel/chips de filtro por género y marca
- [ ] **S2-C** UI: filtros avanzados — familia olfativa, concentración, presentación, precio
- [ ] **S2-D** Active filters bar con chips removibles + ordenamiento

#### P4 — Cart Drawer

- [ ] **S3-A** `CartDrawerContext` + Provider en `_app.tsx`
- [ ] **S3-B** Componente drawer lateral: items, +/- cantidad, subtotal, CTA checkout
- [ ] **S3-C** Navbar cart badge + trigger automático desde lista y detalle

#### P5 — Detalle de Producto Mejorado

- [ ] **S4-A** Galería con thumbnails deslizables y zoom en hover
- [ ] **S4-B** Chips de variante: decant/botella + precio dinámico
- [ ] **S4-C** Breadcrumb + badges (familia, género) + mobile sticky CTA

---

### ⏳ Post-MVP — Backlog

- [ ] Dashboard admin con métricas reales
- [ ] Notificaciones por email al crear pedido
- [ ] Gestión de clientes (desde tabla `orders`)
- [ ] Reportes de ventas por período
- [ ] Wishlist / favoritos
- [ ] Reseñas de productos
- [ ] Descuentos y cupones
- [ ] Integración pasarela de pago (SINPE automático o Stripe)
- [ ] Tracking de envíos
- [ ] SEO: OpenGraph, Twitter cards
- [ ] Roles admin vs staff

---

## Documentación técnica

Toda la documentación vive en [`.claude/docs/`](.claude/docs/):

- [Visión general](.claude/docs/00-app-overview.md)
- [Estado MVP](.claude/docs/01-mvp-status.md)
- [Esquema de BD](.claude/docs/02-database-schema.md)
- [Roadmap Visual Frontend](.claude/docs/roadmap-visual-frontend.md)
