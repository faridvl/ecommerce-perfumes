# Feature: Checkout y Pedidos

## Estado: Funcional ✅

---

## Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/pages/checkout/index.tsx` | Página checkout (composición únicamente) |
| `src/pages/checkout/success/[id]/index.tsx` | Página confirmación (composición únicamente) |
| `src/components/containers/checkout/checkout-container.tsx` | Formulario + resumen de carrito |
| `src/components/containers/checkout/use-checkout.ts` | Hook: form, mutation, redirección |
| `src/shared/api/querys/orders/use-order-detail-query.ts` | TanStack Query para detalle de orden |
| `src/shared/api/querys/orders/use-orders-query.ts` | TanStack Query para lista admin |
| `src/pages/api/orders/index.ts` | POST crear pedido / GET listar (admin) |
| `src/pages/api/orders/[id].ts` | GET detalle / PUT actualizar estado |
| `src/shared/api/repositories/orders.repo.ts` | SQL: create, findAll, findByUuid, findByUuidAndSession, updateStatus |
| `src/shared/api/services/orders.service.ts` | createFromCart, list, getByUuid, updateStatus |

---

## Flujo de checkout

```
1. CheckoutContainer carga el carrito actual
2. Cliente llena: nombre, WhatsApp, dirección
3. POST /api/orders con session_id (cookie) + datos del form
4. OrdersService.createFromCart():
   a. Obtiene carrito por session_id
   b. Valida que no esté vacío
   c. Calcula total_amount (reduce sobre cart items)
   d. Crea orden + order_items en DB
   e. Limpia el carrito (CartRepo.clearCart)
5. Responde con el objeto Order creado (uuid)
6. Frontend redirige a /checkout/success/[uuid]
```

---

## Página de confirmación (`/checkout/success/[id]`)

Muestra:
- Número de orden `#SS-{order.id}`
- Instrucciones de pago (SINPE Móvil + IBAN desde env vars)
- Total a depositar
- Botón "Enviar Comprobante por WhatsApp" → abre `wa.me/{NEXT_PUBLIC_WHATSAPP_BUSINESS}` con mensaje pre-escrito
- Botón "Volver a la tienda"

El cliente puede acceder a esta página con su `session_id` (cookie), no requiere login.

---

## API Endpoints

### `POST /api/orders`
```
Cookie: CART_SESSION_ID (requerido)
Body: { customer_name, customer_whatsapp, customer_address }
Response 201: Order
Response 400: { message: 'El carrito está vacío' | 'Todos los campos son requeridos' }
```

### `GET /api/orders`
```
Header: Authorization: Bearer {token} (requerido)
Query: page, limit, status (opcional)
Response 200: PaginatedOrders
Response 401: No autorizado
```

### `GET /api/orders/[id]`
```
Acceso admin: Header Authorization: Bearer {token}
Acceso cliente: Cookie CART_SESSION_ID (solo puede ver su propio pedido)
Response 200: Order con items[]
Response 404: Orden no encontrada
```

### `PUT /api/orders/[id]`
```
Header: Authorization: Bearer {token} (requerido)
Body: { status: OrderStatus }
Response 200: Order actualizado
```

---

## Tipos clave

```ts
// src/types/order/order.types.ts
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: number; order_id: number;
  product_name: string; variant_detail: string;
  quantity: number; unit_price: number;
}
interface Order {
  id: number; uuid: string; session_id: string | null;
  customer_name: string; customer_whatsapp: string; customer_address: string;
  status: OrderStatus; total_amount: number;
  items: OrderItem[]; created_at: string;
}
interface CreateOrderInput {
  session_id: string;
  customer_name: string; customer_whatsapp: string; customer_address: string;
  total_amount: number;
  items: Array<{ product_name: string; variant_detail: string; quantity: number; unit_price: number }>;
}
```

---

## i18n Keys usadas

```
checkout.title / subtitle / section_delivery
checkout.field_name / field_whatsapp / field_address (+ _placeholder)
checkout.submit / submitting / error
checkout.shipping_note / shipping_caption
checkout.summary_title / total_label
checkout.payment_title / payment_caption
checkout.empty_cart / go_to_catalog
checkout.validation_*

checkout_success.title / heading / order_label
checkout_success.instructions_title / instructions_note
checkout_success.sinpe_label / iban_label / total_label
checkout_success.whatsapp_button / back_to_store
checkout_success.loading / not_found
```

---

## Validaciones del formulario (Yup)

- `customer_name`: requerido
- `customer_whatsapp`: requerido
- `customer_address`: requerido
