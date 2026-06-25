# ScentStack — Esquema de Base de Datos

Base de datos: PostgreSQL (Neon serverless)  
Conexión: `src/lib/db.ts` via `ECOMMERCE_DB_POSTGRES_URL`  
Driver: `@neondatabase/serverless` (SQL template literals)

---

## Tablas

### `users`
Administradores del backoffice.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | |
| uuid | uuid | identificador público |
| email | varchar | único |
| password | varchar | hash bcrypt |
| full_name | varchar | |
| role | varchar | 'admin', 'owner', 'staff' |
| is_active | boolean | |
| created_at | timestamp | |

---

### `products`
Catálogo de fragancias.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | |
| uuid | uuid | identificador público |
| name | varchar | nombre del perfume |
| brand | varchar | marca |
| description | text | notas olfativas, ocasión |
| slug | varchar | único, usado en URL |
| is_active | boolean | soft delete |
| created_at | timestamp | |

---

### `product_variants`
Presentaciones de cada producto (tamaño + concentración).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | |
| uuid | uuid | |
| product_id | int FK → products.id | |
| size_ml | int | ej. 50, 100 |
| concentration | varchar | ej. EDP, EDT, Parfum |
| price_usd | decimal | precio en USD |
| stock | int | unidades disponibles |
| sku | varchar | código de referencia |
| is_active | boolean | |

---

### `product_images`
Imágenes de producto.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | |
| product_id | int FK → products.id | |
| url | varchar | URL externa o path |
| alt_text | varchar | texto alternativo |
| is_primary | boolean | imagen principal |
| sort_order | int | orden de galería |

---

### `carts`
Carritos de compra por sesión.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | |
| uuid | uuid | |
| session_id | varchar | cookie `CART_SESSION_ID` |
| customer_id | int nullable | no usado actualmente |
| created_at | timestamp | |

---

### `cart_items`
Items dentro de un carrito.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | |
| cart_id | int FK → carts.id | |
| product_id | int FK → products.id | |
| variant_id | int FK → product_variants.id | |
| quantity | int | |
| unit_price | decimal | precio al momento de agregar |
| product_name | varchar | snapshot del nombre |
| variant_detail | varchar | snapshot de la presentación |

---

### `orders`
Pedidos realizados por clientes.

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | mostrado como `#SS-{id}` |
| uuid | uuid | identificador en URLs |
| session_id | varchar | vincula con carrito |
| customer_name | varchar | nombre de entrega |
| customer_whatsapp | varchar | contacto del cliente |
| customer_address | text | dirección de entrega |
| status | varchar | ver OrderStatus |
| total_amount | decimal | |
| created_at | timestamp | |

**OrderStatus**: `pending` → `confirmed` → `shipped` → `delivered` | `cancelled`

---

### `order_items`
Líneas de un pedido (snapshot al momento de la compra).

| Columna | Tipo | Notas |
|---------|------|-------|
| id | serial PK | |
| order_id | int FK → orders.id | |
| product_name | varchar | snapshot |
| variant_detail | varchar | snapshot (ej. "100ml EDP") |
| quantity | int | |
| unit_price | decimal | precio snapshot |

---

## Patrones SQL usados

No hay ORM. Se usa SQL puro con template literals de Neon:

```ts
import sql from '@/lib/db';

// Query con parámetros seguros (evita SQL injection)
const rows = await sql`SELECT * FROM products WHERE uuid = ${uuid}`;

// Query con condición nullable
const rows = await sql`
  SELECT * FROM orders
  WHERE (${status ?? null}::text IS NULL OR status = ${status ?? null}::text)
`;
```

### Patrón de mapeo de filas

Cada repository define una función `mapRowTo{Entity}` para:
1. Convertir tipos DB → tipos TS (ej. `numeric` → `Number()`)
2. Parsear JSON aggregations (ej. `json_agg` para items anidados)

```ts
function mapRowToOrder(row: any): Order {
  return {
    ...row,
    total_amount: Number(row.total_amount),
    items: (row.items ?? []).map((item: any) => ({
      ...item,
      unit_price: Number(item.unit_price),
    })),
  };
}
```
