# Feature: Carrito de Compras

## Estado: Funcional ✅ — Cart Drawer implementado ✅

---

## Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/shared/context/cart-drawer-context.tsx` | Context + Provider + hook `useCartDrawer` |
| `src/components/common/cart-drawer/cart-drawer.tsx` | Drawer lateral: overlay, panel, skeleton, footer |
| `src/components/common/cart-drawer/cart-drawer-item.tsx` | Item con controles +/-, precio por línea, eliminar |
| `src/components/common/cart-drawer/cart-drawer-empty.tsx` | Estado vacío con CTA al catálogo |
| `src/pages/cart/index.tsx` | Página carrito (composición únicamente) |
| `src/components/containers/cart/cart-container.tsx` | UI: lista de items, resumen, vaciar |
| `src/shared/api/querys/cart/use-cart-query.ts` | TanStack Query para obtener carrito |
| `src/shared/api/mutations/cart/use-add-cart-item-mutation.ts` | Mutation: agregar item |
| `src/shared/api/mutations/cart/use-update-cart-item-mutation.ts` | Mutation: actualizar cantidad |
| `src/shared/api/mutations/cart/use-remove-cart-item-mutation.ts` | Mutation: eliminar item |
| `src/pages/api/cart/index.ts` | GET carrito / DELETE vaciar |
| `src/pages/api/cart/items/index.ts` | POST agregar item |
| `src/pages/api/cart/items/[id].ts` | PUT actualizar / DELETE eliminar |
| `src/shared/api/repositories/cart.repo.ts` | SQL: findBySessionId, findOrCreate, addItem, updateItemQuantity, removeItem, clearCart |
| `src/shared/api/services/cart.service.ts` | Lógica de carrito |

---

## Mecanismo de sesión

La sesión del carrito se maneja con la cookie `CART_SESSION_ID`:

1. `middleware.ts` inyecta el UUID al primer request si no existe (30 días)
2. El `session_id` se lee en API routes con `getCartSessionId(request)` de `src/shared/api/api-auth.ts`
3. El carrito se crea `findOrCreate` — si no existe para esa sesión, se crea automáticamente

**Sin login requerido.**

---

## API Endpoints

### `GET /api/cart`
Headers: Cookie `CART_SESSION_ID`  
Devuelve: `Cart { id, uuid, session_id, items: CartItem[] }`

### `DELETE /api/cart`
Vacía todos los items del carrito (no elimina el carrito).  
Usado internamente al crear un pedido.

### `POST /api/cart/items`
Body: `{ product_id, variant_id, quantity }`  
Agrega item o incrementa cantidad si ya existe.

### `PUT /api/cart/items/[id]`
Body: `{ quantity }`  
Actualiza cantidad de un item específico.

### `DELETE /api/cart/items/[id]`
Elimina un item del carrito.

---

## Tipos clave

```ts
// src/types/cart/cart.types.ts
interface CartItem {
  id: number; cart_id: number;
  product_id: number; variant_id: number;
  product_name: string; variant_detail: string;
  quantity: number; unit_price: number;
}
interface Cart {
  id: number; uuid: string; session_id: string;
  items: CartItem[];
}
```

---

## i18n Keys usadas

```
cart.title
cart.empty
cart.see_catalog
cart.summary
cart.subtotal
cart.shipping
cart.shipping_free
cart.total
cart.checkout
cart.whatsapp_note
cart.error
```

---

## Cart Drawer

- Se monta en `_app.tsx` fuera del árbol de páginas — disponible en toda la app
- Se controla desde cualquier componente con `useCartDrawer()` (open / close / isOpen)
- El header (`header.tsx`) abre el drawer al click en el ícono del carrito y muestra el badge con la cantidad real desde `useCartQuery`
- Al agregar al carrito desde el detalle de producto, el `onSuccess` llama a `openCartDrawer()` en lugar de navegar a `/cart`
- Bloquea scroll del body mientras está abierto
- Animación: `slide-in-right` (keyframe en `tailwind.config.js`)

---

## Strings hardcodeados pendientes de migrar

Ver [audits/i18n-gaps.md](../../audits/i18n-gaps.md):
- `"Vaciar"` en `cart-container.tsx`
- Strings en `cart-drawer.tsx` (Tu carrito, Ir al checkout, Ver carrito completo, Subtotal)
