# Feature: Admin — Gestión de Inventario

## Estado: Funcional ✅

---

## Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/pages/admin/inventory/index.tsx` | Lista de productos (protegida) |
| `src/pages/admin/inventory/create.tsx` | Crear producto (protegida) |
| `src/pages/admin/inventory/edit/[id].tsx` | Editar producto (protegida) |
| `src/components/containers/admin/inventory/list/inventory-list-container.tsx` | UI tabla de productos |
| `src/components/containers/admin/inventory/create/inventory-create-container.tsx` | Formulario creación |
| `src/components/containers/admin/inventory/edit/inventory-edit-container.tsx` | Formulario edición |
| `src/shared/api/mutations/inventory/use-create-product-mutation.ts` | Mutation crear |
| `src/shared/api/mutations/inventory/use-update-product-mutation.ts` | Mutation actualizar |
| `src/shared/api/mutations/inventory/use-delete-product-mutation.ts` | Mutation soft-delete |
| `src/shared/api/querys/inventory/use-products-query.ts` | Query lista |
| `src/shared/api/querys/inventory/use-product-detail-query.ts` | Query detalle |

---

## Protección

Todas las páginas admin usan:
```ts
export const getServerSideProps = authorizeServerSidePage();
```
Redirige a `/login` si no hay JWT válido.

---

## Formulario de producto

Campos:
- `name` (requerido)
- `brand` (requerido)
- `description`
- `slug` (único, requerido)
- `variants[]`: `size_ml`, `concentration`, `price_usd`, `stock`, `sku`
- `images[]`: `url`, `alt_text`, `is_primary`, `sort_order`

Validación: React Hook Form + Yup

El formulario de edición pre-carga datos del producto existente via `use-product-detail-query`.

---

## API Endpoints usados

| Método | Ruta | Acción |
|--------|------|--------|
| `GET` | `/api/products` | Lista con search + paginación |
| `POST` | `/api/products` | Crear producto |
| `GET` | `/api/products/[id]` | Detalle para edición |
| `PUT` | `/api/products/[id]` | Actualizar |
| `DELETE` | `/api/products/[id]` | Soft delete |

---

## i18n Keys usadas

```
admin.inventory.list.title
admin.inventory.list.search_placeholder
admin.inventory.list.create_button
admin.inventory.list.col_*
admin.inventory.list.units
admin.inventory.list.status_active / status_inactive
admin.inventory.list.empty / error
admin.inventory.list.action_edit / action_delete

admin.inventory.create.title / subtitle
admin.inventory.create.section_info / section_variants / section_images
admin.inventory.create.field_name / field_brand / field_description / field_slug
admin.inventory.create.field_price / field_stock / field_sku / field_size / field_concentration
admin.inventory.create.field_image_url / field_alt_text / field_is_primary
admin.inventory.create.add_variant / add_image / remove
admin.inventory.create.submit / cancel / success
admin.inventory.create.edit_title / edit_submit / edit_success
```
