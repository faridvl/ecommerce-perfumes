# Feature: Admin — Dashboard

## Estado: Placeholder ⚠️

---

## Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/pages/admin/dashboard/index.tsx` | Página dashboard (NO protegida actualmente) |

---

## Bug crítico

```ts
// src/pages/admin/dashboard/index.tsx:29
// export const getServerSideProps = authorizeServerSidePage();
```

El `getServerSideProps` está comentado. Cualquier usuario puede acceder a `/admin/dashboard` sin login.

**Fix**: Descomentar esa línea.

---

## Estado actual

Los 3 stats del dashboard son datos hardcodeados:

```tsx
{ label: 'Ventas de hoy', value: '$12,400', color: 'text-success' },
{ label: 'Pedidos pendientes', value: '8', color: 'text-warning' },
{ label: 'Stock bajo', value: '3 items', color: 'text-danger' }
```

El gráfico de ventas muestra un placeholder: *"Gráfico de ventas mensuales (Próximamente)"*

---

## Para implementar correctamente

1. Descomentar `getServerSideProps` (fix inmediato)
2. Crear query para métricas reales:
   - `COUNT(*) FROM orders WHERE DATE(created_at) = TODAY` → pedidos hoy
   - `SUM(total_amount) FROM orders WHERE DATE(created_at) = TODAY AND status != 'cancelled'` → ventas hoy
   - `COUNT(*) FROM orders WHERE status = 'pending'` → pedidos pendientes
   - `COUNT(*) FROM product_variants WHERE stock <= 5 AND is_active = true` → stock bajo
3. Agregar endpoint `GET /api/admin/metrics`
4. Conectar con TanStack Query
5. Agregar i18n keys para las etiquetas del dashboard
