# Patrón: Agregar un API Route

Todos los API routes viven en `src/pages/api/` (Next.js Pages Router).

---

## Estructura base

```ts
// src/pages/api/{resource}/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { {Resource}Service } from '@/shared/api/services/{resource}.service';
import { getTokenFromRequest, getCartSessionId } from '@/shared/api/api-auth';
import { AuthService } from '@/shared/api/services/auth.service';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    // lógica GET
  }

  if (request.method === 'POST') {
    // lógica POST
  }

  return response.status(405).json({ message: 'Método no permitido' });
}
```

---

## Autenticación

### Ruta pública (carrito, checkout)
```ts
const sessionId = getCartSessionId(request);
if (!sessionId) return response.status(400).json({ message: 'Sesión requerida' });
```

### Ruta protegida admin
```ts
const bearerToken = getTokenFromRequest(request);
if (!bearerToken) return response.status(401).json({ message: 'No autorizado' });

try {
  AuthService.verifyToken(bearerToken);
} catch {
  return response.status(401).json({ message: 'Token inválido' });
}
```

---

## Manejo de errores

```ts
try {
  const result = await {Resource}Service.doSomething(input);
  return response.status(200).json(result);
} catch (error: any) {
  return response.status(400).json({ message: error.message });
  // o 500 para errores de infraestructura
}
```

- `400`: errores de validación o negocio (datos incorrectos, carrito vacío, etc.)
- `401`: no autenticado
- `403`: autenticado pero sin permiso
- `404`: recurso no encontrado
- `500`: error interno / DB
- `405`: método no soportado (siempre al final)

---

## Ruta con parámetro dinámico

```ts
// src/pages/api/{resource}/[id].ts
const { id } = request.query;
if (!id || typeof id !== 'string') {
  return response.status(400).json({ message: 'ID requerido' });
}
```

---

## Query params de paginación (patrón estándar)

```ts
const {
  page: pageParam = '1',
  limit: limitParam = '10',
  status,
} = request.query;

const paginatedResult = await {Resource}Service.list(
  Number(pageParam),
  Number(limitParam),
  status as string | undefined,
);
```

---

## Respuestas estándar

| Situación | Status | Body |
|-----------|--------|------|
| Creación exitosa | 201 | Objeto creado |
| Consulta exitosa | 200 | Datos |
| Actualización exitosa | 200 | Objeto actualizado |
| Error de validación | 400 | `{ message: string }` |
| No autorizado | 401 | `{ message: 'No autorizado' }` |
| No encontrado | 404 | `{ message: 'X no encontrado' }` |
| Error interno | 500 | `{ message: string }` |
| Método no permitido | 405 | `{ message: 'Método no permitido' }` |

---

## Lo que NO hacer en un API route

- No importar componentes React
- No usar `fetch` interno para llamar otros routes propios (llamar Service directamente)
- No escribir SQL — usar el Service/Repository correspondiente
- No devolver stacks de error al cliente en producción
