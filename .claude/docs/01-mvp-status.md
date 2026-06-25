# ScentStack — Estado MVP

## Lo que funciona al 100%

| Feature | Archivos clave |
|---------|----------------|
| Catálogo con búsqueda y paginación | `pages/catalog/`, `api/products/` |
| Detalle de producto con variantes | `pages/catalog/[slug]/` |
| Carrito session-based (add/update/remove) | `pages/cart/`, `api/cart/` |
| Checkout (datos de entrega) | `pages/checkout/`, `api/orders/` POST |
| Página de confirmación con instrucciones de pago | `pages/checkout/success/[id]/` |
| Login admin (JWT, 1 hora) | `pages/login/`, `api/auth/` |
| Admin inventario CRUD (productos + variantes + imágenes) | `pages/admin/inventory/`, `api/products/` |
| Admin ventas (lista + detalle + cambio de estado) | `pages/admin/sales/`, `api/orders/` |
| Middleware de sesión de carrito | `middleware.ts` |

---

## Lo que está incompleto / placeholder

| Feature | Archivo | Estado |
|---------|---------|--------|
| Dashboard admin | `pages/admin/dashboard/index.tsx` | Datos hardcodeados, sin protección (getServerSideProps comentado) |
| Gestión de clientes | `pages/admin/customers/index.tsx` | Página vacía |
| Ajustes | `pages/admin/settings/index.tsx` | Página vacía |
| Notificaciones por email | — | No existe |
| Pago automatizado | — | Manual (SINPE/IBAN) |
| Tracking de envíos | — | No existe |
| Refresh token | — | Solo 1h, no hay renovación |

---

## Datos mockeados (hardcoded)

### Dashboard admin (`pages/admin/dashboard/index.tsx:11-13`)
```tsx
{ label: 'Ventas de hoy', value: '$12,400', color: 'text-success' },
{ label: 'Pedidos pendientes', value: '8', color: 'text-warning' },
{ label: 'Stock bajo', value: '3 items', color: 'text-danger' }
```
**Sin consulta real a base de datos.**

---

## Bugs conocidos

Ver [audits/bugs.md](../audits/bugs.md) para la lista completa.

**Crítico:**
- Dashboard admin NO está protegido (`getServerSideProps` comentado en línea 29).

**Menor:**
- 4 strings UI hardcodeados sin pasar por i18n (ver [audits/i18n-gaps.md](../audits/i18n-gaps.md)).
- Paginación en sales list muestra "Página X de Y" hardcodeado.

---

## Strings legacy de dominio médico en i18n

En `src/static/texts/es.json` y `src/static/texts/i18n.ts` existen claves del dominio médico:
- `users.list.create.form.specialty` → "Especialidad / Área"
- placeholder: "Audiología Clínica"

Ver [audits/i18n-gaps.md](../audits/i18n-gaps.md).

---

## Prioridades para cerrar el MVP

1. **Crítico**: Restaurar protección del dashboard admin (`getServerSideProps`)
2. **Alta**: Conectar dashboard con datos reales (queries a `orders` y `products`)
3. **Media**: Migrar strings hardcodeados a `es.json`
4. **Media**: Limpiar terminología médica de `es.json` e `i18n.ts`
5. **Baja**: Implementar página de clientes (lista de `customer_name` + `customer_whatsapp` únicos por pedido)
6. **Baja**: Confirmar y trackear `middleware.ts` en git

---

## Lo que agregaríamos post-MVP

- Notificaciones por email al crear pedido
- Panel de reportes (ventas por período, productos más vendidos)
- Gestión de marcas independiente
- Wishlist / favoritos
- Reseñas de productos
- Descuentos / cupones
- Integración con pasarela de pago (SINPE automatizado o Stripe)
- Roles de usuario (admin vs staff)
