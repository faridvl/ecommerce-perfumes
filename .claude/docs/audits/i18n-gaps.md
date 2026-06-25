# Audit: Gaps de i18n

Strings visibles en UI que no pasan por el sistema de traducción (`t(TEXT.*)`).

---

## Strings hardcodeados a migrar

### 1. Botón "Todos" en filtro de ventas
**Archivo**: `src/components/containers/admin/sales/list/sales-list-container.tsx:70`

```tsx
// Actual:
<button onClick={() => handleStatusFilter(undefined)}>
  Todos
</button>

// Correcto:
<button onClick={() => handleStatusFilter(undefined)}>
  {t(TEXT.ADMIN.SALES.LIST.FILTER_ALL)}
</button>
```

**Agregar en `es.json`**: `"admin.sales.list.filter_all": "Todos"`  
**Agregar en `i18n.ts`**: `FILTER_ALL: 'admin.sales.list.filter_all'`

---

### 2. Paginación "Página X de Y" en ventas
**Archivo**: `src/components/containers/admin/sales/list/sales-list-container.tsx:221-222`

```tsx
// Actual:
<Typography>Página {currentPage} de {totalPages}</Typography>

// Correcto:
<Typography>{t(TEXT.ADMIN.SALES.LIST.PAGINATION, { current: currentPage, total: totalPages })}</Typography>
```

**Agregar en `es.json`**: `"admin.sales.list.pagination": "Página {{current}} de {{total}}"`  
**Agregar en `i18n.ts`**: `PAGINATION: 'admin.sales.list.pagination'`

---

### 3. "Ver Catalogo" en product-list-container
**Archivo**: `src/components/containers/catalog/product-list/product-list-container.tsx` (aproximado)

```tsx
// Actual:
"Ver Catalogo"
// Correcto:
{t(TEXT.CATALOG.LIST.SEE_CATALOG)}
// o reutilizar: TEXT.CART.SEE_CATALOG que ya existe como "Ver Catálogo"
```

Verificar si existe en i18n antes de agregar nueva clave.

---

### 4. "Agregar al carrito" en product-list-container
**Archivo**: `src/components/containers/catalog/product-list/product-list-container.tsx` (aproximado)

```tsx
// Actual:
"Agregar al carrito"
// Correcto:
{t(TEXT.CATALOG.DETAIL.ADD_TO_CART)}
// La clave ya existe: 'catalog.detail.add_to_cart' = "Añadir al Carrito"
```

Reutilizar la clave existente en lugar de agregar una nueva.

---

## Terminología médica legacy en i18n

Estos campos son herencia del fork médico. No se usan actualmente en ningún componente visible, pero existen en los archivos de texto y generan confusión.

### 5. `users.list.create.form.specialty`
**Archivo**: `src/static/texts/es.json:221-226`
```json
"specialty": "Especialidad / Área",
"specialtyPlaceholder": "Ej. Audiología Clínica"
```

**Archivo**: `src/static/texts/i18n.ts:225-226`
```ts
SPECIALTY: 'users.create.form.specialty',
SPECIALTY_PLACEHOLDER: 'users.create.form.specialtyPlaceholder',
```

**Acción**: Si el módulo de usuarios no está implementado aún, renombrar estas claves a algo neutro del dominio ecommerce cuando se implemente. Por ejemplo: `department` / `area`.

---

## Nombre incorrecto en sidebar

### 6. Business name "Zynka"
**Archivo**: `src/static/texts/es.json:22`
```json
"business": {
  "name": "Zynka"
}
```

**Problema**: "Zynka" parece ser un nombre de prueba. El proyecto es ScentStack.  
**Acción**: Cambiar a `"ScentStack"` o al nombre correcto de la marca del cliente.

---

## Cómo agregar una clave i18n nueva

1. Agregar en `src/static/texts/es.json` bajo el namespace correcto
2. Exportar la clave en `src/static/texts/i18n.ts` en el objeto `TEXT`
3. Usar en componente: `t(TEXT.NAMESPACE.KEY)`

Siempre mantener la jerarquía `namespace.section.key` consistente con la estructura existente.
