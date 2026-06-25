# ScentStack — Visión General

## ¿Qué es?

ScentStack es una plataforma de ecommerce de fragancias de lujo orientada al mercado costarricense. Permite a clientes navegar y comprar perfumes, y al equipo de administración gestionar inventario y pedidos.

Originalmente forkeado de una plataforma médica. Pueden existir referencias legacy a `patients`, `appointments`, `medical`. Nunca introducir nueva terminología médica.

---

## Dominios de negocio

| Dominio | Estado |
|---------|--------|
| Catálogo de productos | Funcional |
| Carrito de compras | Funcional |
| Checkout | Funcional |
| Pedidos (cliente) | Funcional |
| Admin — Inventario | Funcional |
| Admin — Ventas | Funcional |
| Admin — Dashboard | Placeholder |
| Admin — Clientes | Vacío |
| Admin — Ajustes | Vacío |
| Autenticación admin | Funcional |

---

## Rutas públicas

```
/              → redirige a /catalog
/catalog       → listado de fragancias
/catalog/[slug] → detalle de producto
/cart          → carrito
/checkout      → formulario de datos de entrega
/checkout/success/[id] → confirmación de pedido y pago
/login         → login admin
```

## Rutas admin (protegidas por JWT)

```
/admin/dashboard    → panel de control (placeholder)
/admin/inventory    → CRUD productos
/admin/sales        → gestión de pedidos
/admin/customers    → (vacío)
/admin/settings     → (vacío)
```

Protección vía `src/hocs/auth.tsx` con `authorizeServerSidePage()` en `getServerSideProps`.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (Pages Router) |
| UI | React 18 + Tailwind CSS |
| Estado servidor | TanStack Query v5 |
| Formularios | React Hook Form + Yup |
| Base de datos | PostgreSQL (Neon serverless) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| i18n | i18next + react-i18next |
| Icons | Lucide React |

---

## Variables de entorno requeridas

```bash
# DB
ECOMMERCE_DB_POSTGRES_URL      # PostgreSQL Neon

# Auth
JWT_SECRET                      # Secreto JWT (server-only)

# Pagos (públicas — NEXT_PUBLIC_)
NEXT_PUBLIC_SINPE_NUMBER        # Número SINPE Móvil
NEXT_PUBLIC_SINPE_OWNER         # Nombre dueño SINPE
NEXT_PUBLIC_IBAN                # IBAN transferencia
NEXT_PUBLIC_WHATSAPP_BUSINESS   # WhatsApp para comprobantes

# API base URLs (públicas)
NEXT_PUBLIC_AUTH_API_URL        # Base URL auth
NEXT_PUBLIC_CATALOG_API_URL     # Base URL catálogo/órdenes
```

---

## Modelo de sesión

- El middleware en `middleware.ts` inyecta la cookie `CART_SESSION_ID` (UUID) en cada request si no existe.
- El carrito se asocia a `CART_SESSION_ID`, sin login requerido.
- Los pedidos se vinculan al mismo `session_id` al hacer checkout.
- La sesión admin (JWT) se guarda en cookie con expiración de 1 hora.

---

## Flujo de compra resumido

```
1. Cliente navega /catalog
2. Selecciona producto y variante → agrega al carrito (session-based)
3. Va a /checkout → llena nombre, WhatsApp, dirección
4. Se crea el pedido en DB → se limpia el carrito
5. Redirige a /checkout/success/[uuid]
6. Cliente ve instrucciones de pago: SINPE Móvil o IBAN
7. Cliente envía comprobante por WhatsApp
8. Admin confirma recepción y actualiza estado del pedido
```

---

## Pago

Manual. No hay pasarela de pago integrada.

- **SINPE Móvil**: número configurado en env var
- **Transferencia IBAN**: cuenta configurada en env var
- **Comprobante**: enviado por WhatsApp al número de negocio

---

## Arquitectura de capas

```
Page (composición únicamente)
  └── Container (orquestación + hooks)
        └── Hook (estado, queries, mutations)
              └── Query/Mutation (TanStack Query)
                    └── ApiServiceClient (HTTP)
                          └── API Route (Next.js)
                                └── Service (lógica de negocio)
                                      └── Repository (SQL puro, Neon)
```

Ver [patterns/add-feature.md](../patterns/add-feature.md) para el patrón completo.
