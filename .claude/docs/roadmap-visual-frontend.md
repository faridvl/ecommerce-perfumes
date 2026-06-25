# Roadmap — Frontend Visual ScentStack

Plan de desarrollo por sesiones cortas (1–3h cada una), organizado por prioridad de negocio.  
Al completar cada sesión: marcar el checkbox en `README.md` y actualizar el doc de feature afectado.

---

## Decisiones de diseño base

**Paleta actual:**
- `accent` `#D4AF37` (dorado) ✅ correcto para fragancias de lujo — no tocar
- `primary` `#2563EB` (azul) ❌ legado médico — reemplazar por negro carbón
- Fondos admin: `#0F172A` dark navy — mantener para admin
- Fondos ecommerce público: cremas/blancos rotos — estandarizar

**Campos que faltan en la BD:**
- `products.gender`: `'hombre' | 'mujer' | 'unisex'`
- `products.olfactory_family`: `'floral' | 'oriental' | 'fresco' | 'madero' | 'cítrico' | 'gourmand' | 'amaderado'`
- `product_variants.presentation_type`: `'decant' | 'botella'`

---

## P1 — Design System & Carrusel `[pre-requisito visual]`

### S0-A — Paleta de colores estandarizada `[½h]`

**Objetivo:** eliminar el azul legacy y definir la identidad visual de lujo.

Cambios en `tailwind.config.js`:
- `primary` → `#1A1A1A` (negro carbón elegante) con `light: #2D2D2D`, `soft: #F5F5F5`
- Añadir `warm-white: '#FAF9F6'` — fondo principal del ecommerce
- Añadir `cream: '#F5F0E8'` — fondo de tarjetas y superficies
- `accent` `#D4AF37` permanece sin cambios
- Revisar y corregir usos de `text-primary`, `bg-primary`, `border-primary` en componentes de catálogo y checkout

Archivos:
- `tailwind.config.js`
- Componentes de catálogo y checkout que usen clases `primary`

---

### S1-A — Carrusel hero mejorado `[1h]`

**Objetivo:** auto-play elegante con indicadores visuales.

Mejoras sobre el carrusel actual:
- Auto-avance cada 5 segundos
- Pausa en `mouseenter`, reanuda en `mouseleave`
- Dots/bullets indicators centrados en la parte inferior
- Animación de transición: fade + leve desplazamiento horizontal (más fluido que el opacity puro actual)
- Slides siguen siendo configurables desde `use-product-list.ts`

Archivos:
- `src/components/containers/catalog/product-list/use-product-list.ts`
- `src/components/containers/catalog/product-list/product-list-container.tsx`

---

## P2 — Campos de filtro en BD y Admin `[pre-requisito para filtros]`

### S0-B — Migraciones SQL `[½h]`

```sql
ALTER TABLE products
  ADD COLUMN gender VARCHAR(10) DEFAULT 'unisex',
  ADD COLUMN olfactory_family VARCHAR(50);

ALTER TABLE product_variants
  ADD COLUMN presentation_type VARCHAR(10) DEFAULT 'botella';
```

Ejecutar directamente en Neon Console o vía script.  
Actualizar `02-database-schema.md` al completar.

---

### S0-C — Types + Repo + Service + API `[1h]`

**Orden de cambios (dependencia descendente):**

1. `src/types/product/product.types.ts`
   - `Product`: añadir `gender`, `olfactory_family`
   - `ProductVariant`: añadir `presentation_type`
   - `ProductListParams`: añadir `gender?`, `olfactory_family?`, `presentation_type?`, `min_price?`, `max_price?`, `sort?`

2. `src/shared/api/repositories/products.repo.ts`
   - SELECT: incluir nuevas columnas en `findAll` y `findByUuid`/`findBySlug`
   - WHERE: aplicar filtros nullable con el patrón existente:
     ```sql
     AND (${gender ?? null}::text IS NULL OR p.gender = ${gender ?? null}::text)
     ```

3. `src/shared/api/services/products.service.ts`
   - Pasar `gender`, `olfactory_family`, `presentation_type`, `min_price`, `max_price`, `sort` al repo

4. `src/pages/api/products/index.ts`
   - Leer nuevos query params de `req.query`
   - Pasarlos al service

5. `src/shared/api/querys/inventory/use-products-query.ts`
   - Incluir nuevos params en la query key y en el fetch

---

### S1-B — Admin: formularios con campos nuevos `[1–2h]`

**Objetivo:** el admin puede configurar gender, familia olfativa y tipo de presentación al crear/editar productos.

Cambios en el formulario de producto (crear/editar):
- Select `gender`: Hombre / Mujer / Unisex
- Select `olfactory_family`: Floral / Oriental / Fresco / Madero / Cítrico / Gourmand / Amaderado

Cambios en el formulario de variante:
- Select `presentation_type`: Decant / Botella

Archivos:
- `src/pages/admin/inventory/` — formulario de producto
- `src/static/texts/es.json` — i18n de opciones de los selects
- Tipos `ProductInput` en `product.types.ts`

---

## P3 — Filtros Avanzados en Catálogo `[feature principal]`

### S2-A — Hook de filtros + URL params `[1h]`

**Objetivo:** estado de filtros sincronizado con la URL para deep-linking.

- Hook `use-product-filters.ts` con:
  - Estado de cada filtro (gender, brand, olfactory_family, concentration, presentation_type, min_price, max_price, sort)
  - Leer desde `router.query` al montar
  - Escribir a `router.query` al cambiar (shallow routing)
  - Función `clearFilter(key)` y `clearAllFilters()`
- Pasar estado de filtros al hook `use-product-list.ts` existente

Archivos nuevos:
- `src/components/containers/catalog/product-list/product-filters/use-product-filters.ts`

Archivos modificados:
- `src/components/containers/catalog/product-list/use-product-list.ts`

---

### S2-B — UI: filtros de género y marca `[1–2h]`

**Objetivo:** panel de filtros visible con los dos filtros más importantes.

- Componente `ProductFiltersSidebar` o `ProductFiltersBar` (decidir layout: sidebar o top chips)
- Filtro género: radio buttons (Todos / Hombre / Mujer / Unisex)
- Filtro marca: checkboxes multi-select (lista de marcas únicas desde la API)
- Skeleton loader mientras cargan las opciones
- i18n de todos los labels

Archivos nuevos:
- `src/components/containers/catalog/product-list/product-filters/product-filters-panel.tsx`
- `src/components/containers/catalog/product-list/product-filters/gender-filter.tsx`
- `src/components/containers/catalog/product-list/product-filters/brand-filter.tsx`

---

### S2-C — Filtros avanzados + precio + ordenamiento `[1–2h]`

Añadir al panel:
- Familia olfativa: checkboxes (Floral / Oriental / Fresco / Madero / Cítrico / Gourmand / Amaderado)
- Concentración: checkboxes (EDP / EDT / Parfum / Colonia)
- Tipo de presentación: toggle (Decant / Botella / Todos)
- Rango de precio: dos inputs numéricos (min / max) en USD
- Ordenar por: select (Relevancia / Precio ↑ / Precio ↓ / Más nuevo / A–Z)

---

### S2-D — Active filters bar + chips removibles `[½–1h]`

- Barra de chips activos debajo del panel de filtros
- Cada filtro activo muestra su valor + botón "×" para removerlo
- Botón "Limpiar todos" visible solo cuando hay filtros activos
- Cuenta de resultados actualizada en tiempo real

Archivos nuevos:
- `src/components/containers/catalog/product-list/product-filters/active-filters-bar.tsx`

---

## P4 — Cart Drawer `[experiencia de compra]`

### S3-A — CartDrawerContext `[½h]`

**Objetivo:** contexto global para abrir/cerrar el drawer desde cualquier parte de la app.

```tsx
// src/context/cart-drawer-context.tsx
interface CartDrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
```

- Crear `CartDrawerContext` y `CartDrawerProvider`
- Envolver la app en `_app.tsx` con el provider

Archivos nuevos:
- `src/context/cart-drawer-context.tsx`

Archivos modificados:
- `src/pages/_app.tsx`

---

### S3-B — Componente Cart Drawer UI `[1–2h]`

**Objetivo:** drawer deslizante desde la derecha con la lista del carrito.

Estructura del drawer:
- Overlay semitransparente con click-outside para cerrar
- Panel deslizante desde la derecha (animación `translate-x`)
- Header: "Tu carrito" + badge con cantidad + botón cerrar
- Lista de items: imagen miniatura, nombre, variante, precio, controles +/-
- Botón eliminar por item
- Footer: subtotal + "Ir al checkout" + "Ver carrito completo"
- Estado vacío con mensaje e ilustración mínima
- Usa queries y mutations de carrito ya existentes

Archivos nuevos:
- `src/components/common/cart-drawer/cart-drawer.tsx`
- `src/components/common/cart-drawer/cart-drawer-item.tsx`
- `src/components/common/cart-drawer/cart-drawer-empty.tsx`

Archivos modificados:
- `src/pages/_app.tsx` — montar `<CartDrawer />` en el layout global

---

### S3-C — Navbar cart badge + integración `[1h]`

**Objetivo:** el carrito es accesible desde cualquier página y se abre automáticamente al agregar un producto.

- Badge en el navbar/header con la cantidad de items del carrito
- Al hacer "Agregar al carrito" desde la lista → llama `CartDrawerContext.open()`
- Al hacer "Agregar al carrito" desde el detalle → llama `CartDrawerContext.open()`
- Migrar el string "Agregar al carrito" hardcodeado a i18n

Archivos:
- `src/components/common/navbar/` — añadir cart badge
- `src/components/containers/catalog/product-list/use-product-list.ts`
- `src/components/containers/catalog/product-detail/use-product-detail.ts`

---

## P5 — Detalle de Producto Mejorado `[cierre de experiencia]`

### S4-A — Galería de imágenes `[1–2h]`

**Objetivo:** galería de nivel luxury con thumbnails y zoom.

- Imagen principal grande (aspecto 4/5 o 1/1)
- Thumbnails horizontales deslizables debajo
- Click en thumbnail actualiza la imagen principal
- Zoom en hover (desktop): lente o lightbox simple
- Flechas prev/next para navegar entre imágenes
- Fallback elegante si no hay imágenes

Archivos:
- `src/components/containers/catalog/product-detail/product-gallery.tsx` (nuevo)
- `src/components/containers/catalog/product-detail/product-detail-container.tsx`

---

### S4-B — Chips de variante + precio dinámico `[1h]`

**Objetivo:** la selección de variante es visual y diferencia decants de botellas.

- Chips de presentación: "Decant 5ml" / "Botella 50ml" / "Botella 100ml"
- Ícono diferenciado: gota para decant, frasco para botella
- Chips agrupados por tipo: sección "Decants" y sección "Botellas" si existen ambas
- Precio en el header se actualiza al cambiar variante seleccionada
- Chip deshabilitado + badge "Agotado" si `stock === 0`

Archivos:
- `src/components/containers/catalog/product-detail/variant-selector.tsx` (nuevo)
- `src/components/containers/catalog/product-detail/product-detail-container.tsx`
- `src/components/containers/catalog/product-detail/use-product-detail.ts`

---

### S4-C — Breadcrumb + badges + mobile sticky CTA `[1h]`

**Objetivo:** contexto de navegación y accesibilidad mobile.

- Breadcrumb: Inicio → Catálogo → {Marca} → {Nombre}
- Badges inline: familia olfativa + género (chips visuales, no clicables)
- Mobile: botón "Agregar al carrito" sticky en `position: fixed bottom-0`
- Descripción del producto: formatear notas olfativas si existen separadas por coma

Archivos:
- `src/components/common/breadcrumb/breadcrumb.tsx` (nuevo)
- `src/components/containers/catalog/product-detail/product-detail-container.tsx`

---

## Orden de ejecución y dependencias

```
P1: S0-A → S1-A           (independientes entre sí, empezar por S0-A)
P2: S0-B → S0-C → S1-B    (secuencial, BD primero)
P3: S2-A → S2-B → S2-C → S2-D  (secuencial, requiere P2 completo)
P4: S3-A → S3-B → S3-C    (secuencial, S3-A primero)
P5: S4-A → S4-B → S4-C    (secuencial, requiere P2 para S4-B)

P1 y P2 se pueden trabajar en paralelo.
P3 requiere P2 completo.
P4 es independiente de P2/P3 — se puede hacer en paralelo con P3.
P5 requiere P1 (visual) y P2 (campos de variante).
```

---

## Regla de cierre de sesión

Al terminar cualquier sesión (S*):
1. Marcar los checkboxes completados en `README.md`
2. Actualizar el doc de feature afectado en `.claude/docs/features/`
3. Si se modificó el schema de BD, actualizar `02-database-schema.md`
4. Si se añadió un patrón nuevo, documentarlo en `.claude/docs/patterns/`
