# Audit: Bugs Conocidos

---

## 🔴 Crítico

### Bug 1: Dashboard admin sin protección
**Archivo**: `src/pages/admin/dashboard/index.tsx:29`  
**Problema**: El `getServerSideProps` que verifica el JWT está comentado.  
Cualquier usuario puede acceder a `/admin/dashboard` sin estar autenticado.

```ts
// LÍNEA 29 — DESCOMENTAR:
// export const getServerSideProps = authorizeServerSidePage();
```

**Fix**: Descomentar esa línea.

---

## 🟡 Moderado

### Bug 2: `middleware.ts` no está en git
**Archivo**: `middleware.ts` (raíz del proyecto)  
**Problema**: El archivo no está trackeado en git. Es crítico para el funcionamiento del carrito ya que inyecta la cookie `CART_SESSION_ID`.  
Sin este middleware, la sesión del carrito no se crea y el checkout falla.

**Fix**: `git add middleware.ts` y hacer commit.

### Bug 3: `.claudeignore` no está en git
**Archivo**: `.claudeignore` (raíz del proyecto)  
**Problema**: No está trackeado en git. Si se trabaja en otro entorno, Claude no sabrá qué ignorar.

**Fix**: `git add .claudeignore` y hacer commit.

---

## 🟢 Menor

### Bug 4: Uso excesivo de `any` en tipos
**Archivos**: repositories, table.tsx, dashboard-layout.tsx  
**Problema**: Se usa `any` en mapeos de filas DB y en componentes genéricos, lo que reduce la seguridad de tipos.  
No es un bug funcional pero puede enmascarar errores.

Ejemplos:
- `orders.repo.ts:4` — `function mapRowToOrder(row: any): Order`
- `cart.repo.ts:32` — `return cart as unknown as Cart`

### Bug 5: Order items insertados en loop (no en batch)
**Archivo**: `src/shared/api/repositories/orders.repo.ts:54-65`  
**Problema**: Los `order_items` se insertan con un `for` loop de `await sql` individuales, no en un bulk insert.  
En pedidos con muchos items puede ser lento. No es un bug funcional.

```ts
// Actual — N queries individuales:
for (const orderItem of input.items) {
  await sql`INSERT INTO order_items ...`;
}
// Mejor: un INSERT con VALUES múltiples
```

### Bug 6: `es.json` tiene clave `menu.sidebar.business.name` = "Zynka"
**Archivo**: `src/static/texts/es.json:22`  
**Problema**: El nombre del negocio en el sidebar está hardcodeado como "Zynka", que parece ser un nombre de prueba.  
No corresponde a ScentStack.

---

## Consideraciones de arquitectura

- No hay refresh token: la sesión admin expira en 1 hora sin posibilidad de renovación. El usuario tiene que volver a hacer login.
- No hay persistencia de sesión de carrito en DB más allá de la cookie (30 días). Si el usuario borra cookies, pierde el carrito.
- El `session_id` del carrito se reutiliza como vínculo con la orden. No hay anonimización post-checkout.
