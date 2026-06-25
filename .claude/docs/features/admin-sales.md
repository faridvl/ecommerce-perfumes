# Feature: Admin — Ventas y Pedidos

## Estado: Funcional ✅

---

## Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/pages/admin/sales/index.tsx` | Lista de pedidos (protegida) |
| `src/pages/admin/sales/[id].tsx` | Detalle de pedido (protegida) |
| `src/components/containers/admin/sales/list/sales-list-container.tsx` | UI tabla + filtro de estado |
| `src/components/containers/admin/sales/list/use-sales-list.ts` | Hook: paginación, filtro, navegación |
| `src/components/containers/admin/sales/detail/sales-detail-container.tsx` | UI detalle + actualización de estado |
| `src/components/containers/admin/sales/detail/use-sales-detail.ts` | Hook: carga orden, actualiza estado |
| `src/shared/api/querys/orders/use-orders-query.ts` | TanStack Query lista de órdenes |
| `src/shared/api/querys/orders/use-order-detail-query.ts` | TanStack Query detalle |

---

## Funcionalidades

### Lista de ventas
- Tabla con columnas: Pedido (#SS-{id}), Cliente, Fecha, Total, Estado, Acciones
- Filtros por estado: todos | pending | confirmed | shipped | delivered | cancelled
- Paginación (10 items por página)
- Skeleton loading

### Detalle de pedido
- Info del cliente: nombre, WhatsApp, dirección
- Tabla de productos del pedido (snapshot)
- Total del pedido
- Selector de estado con actualización inmediata

---

## Estados de un pedido

```
pending → confirmed → shipped → delivered
                    ↘ cancelled (desde cualquier estado)
```

Estilos por estado:
```ts
pending:   'bg-amber-100 text-amber-700'
confirmed: 'bg-blue-100 text-blue-700'
shipped:   'bg-indigo-100 text-indigo-700'
delivered: 'bg-green-100 text-green-700'
cancelled: 'bg-neutral-100 text-neutral-500'
```

---

## Número de pedido

Los pedidos se muestran como `#SS-{order.id}` (id numérico secuencial, no uuid).  
El UUID se usa en URLs. Ej: `/admin/sales/550e8400-e29b-41d4-a716-446655440000`

---

## Strings hardcodeados pendientes de migrar

Ver [audits/i18n-gaps.md](../../audits/i18n-gaps.md):
- `"Todos"` (botón de filtro sin estado) — línea 70 en `sales-list-container.tsx`
- `"Página {currentPage} de {totalPages}"` — líneas 221-222

---

## i18n Keys usadas

```
admin.sales.list.title
admin.sales.list.col_order / col_customer / col_date / col_total / col_status / col_actions
admin.sales.list.status_pending / confirmed / shipped / delivered / cancelled
admin.sales.list.empty / error / action_view

admin.sales.detail.title / order_number / customer / whatsapp / address / date / status
admin.sales.detail.items_title
admin.sales.detail.col_product / col_variant / col_qty / col_price / col_subtotal
admin.sales.detail.total / update_status / error / not_found / back
```
