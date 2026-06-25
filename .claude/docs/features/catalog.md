# Feature: Catálogo de Productos

## Estado: Funcional ✅ — Carrusel hero mejorado (S1-A)

---

## Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/pages/catalog/index.tsx` | Página lista (composición únicamente) |
| `src/pages/catalog/[slug]/index.tsx` | Página detalle (composición únicamente) |
| `src/components/containers/catalog/product-list/product-list-container.tsx` | UI lista con hero carousel y grid |
| `src/components/containers/catalog/product-list/use-product-list.ts` | Hook: búsqueda, paginación, add to cart, auto-play carrusel |
| `src/components/containers/catalog/product-detail/product-detail-container.tsx` | UI detalle con selección de variante |
| `src/components/containers/catalog/product-detail/use-product-detail.ts` | Hook: variante seleccionada, add to cart |
| `src/shared/api/querys/inventory/use-products-query.ts` | TanStack Query para lista |
| `src/shared/api/querys/inventory/use-product-detail-query.ts` | TanStack Query para detalle |
| `src/pages/api/products/index.ts` | GET lista / POST crear (admin) |
| `src/pages/api/products/[id].ts` | GET por uuid/slug / PUT / DELETE |
| `src/shared/api/repositories/products.repo.ts` | SQL: findAll, findByUuid, create, update, softDelete |
| `src/shared/api/services/products.service.ts` | Lógica: CRUD + soft delete |

---

## API Endpoints

### `GET /api/products`
Parámetros: `page`, `limit`, `search`, `brand`  
Devuelve: `PaginatedProducts { data: Product[], total, pageNumber, pageLimit }`  
Auth: No requerida

### `POST /api/products`
Body: `ProductInput`  
Auth: JWT requerido  
Crea producto con variantes e imágenes en transacción.

### `GET /api/products/[id]`
Acepta UUID o slug.  
Devuelve: `Product` con `variants[]` e `images[]`.

### `PUT /api/products/[id]`
Body: `Partial<ProductInput>`  
Auth: JWT requerido

### `DELETE /api/products/[id]`
Soft delete (`is_active = false`).  
Auth: JWT requerido

---

## Tipos clave

```ts
// src/types/product/product.types.ts
interface ProductVariant {
  id: number; uuid: string; product_id: number;
  size_ml: number; concentration: string;
  price_usd: number; stock: number; sku: string; is_active: boolean;
}
interface ProductImage {
  id: number; product_id: number; url: string;
  alt_text: string; is_primary: boolean; sort_order: number;
}
interface Product {
  id: number; uuid: string; name: string; brand: string;
  description: string; slug: string; is_active: boolean;
  created_at: string; variants: ProductVariant[]; images: ProductImage[];
}
```

---

## i18n Keys usadas

```
catalog.list.hero_cta
catalog.list.title
catalog.list.subtitle         (interpolación: {{count}})
catalog.list.search_placeholder
catalog.list.loading
catalog.list.error
catalog.list.no_image
catalog.detail.error
catalog.detail.no_image
catalog.detail.select_variant
catalog.detail.out_of_stock
catalog.detail.add_to_cart
catalog.detail.adding
```

---

## Hero Carousel (S1-A)

- Auto-avance cada 5 segundos (`AUTOPLAY_INTERVAL_MS = 5000`)
- Pausa en `mouseenter`, reanuda en `mouseleave`
- Dot indicators centrados en `bottom-6`: dot activo `w-6 h-2 bg-accent`, inactivos `w-2 h-2 bg-white/50`
- Transición: `opacity` + `translate-x-8` (fade + desplazamiento horizontal, `duration-700`)
- Slides configurados en `HERO_SLIDES` dentro de `use-product-list.ts`
- Lógica de control: `goToSlide`, `pauseAutoPlay`, `resumeAutoPlay` exportados desde el hook

---

## Strings hardcodeados pendientes de migrar

Ver [audits/i18n-gaps.md](../../audits/i18n-gaps.md):
- `"Ver Catalogo"` en `product-list-container.tsx`
- `"Agregar al carrito"` en `product-list-container.tsx`
