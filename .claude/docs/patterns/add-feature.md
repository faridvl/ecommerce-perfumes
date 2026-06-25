# Patrón: Agregar una Nueva Feature

Este checklist aplica para agregar cualquier feature nueva con entidad propia (ej: Wishlist, Reseñas, Cupones, Marcas).

---

## Checklist de implementación (en orden)

### 1. Tipos (`src/types/{feature}/{feature}.types.ts`)

```ts
// Ejemplo: src/types/wishlist/wishlist.types.ts
export interface WishlistItem {
  id: number;
  uuid: string;
  product_id: number;
  product_name: string;
  created_at: string;
}
export interface Wishlist {
  id: number;
  session_id: string;
  items: WishlistItem[];
}
export interface AddToWishlistInput {
  product_id: number;
}
```

### 2. Repository (`src/shared/api/repositories/{feature}.repo.ts`)

- Solo SQL puro con `sql` de `@/lib/db`
- Una función `mapRowTo{Entity}` para conversiones de tipo
- Exportar como objeto `{Feature}Repo`

```ts
import sql from '@/lib/db';
import { Wishlist } from '@/types/wishlist/wishlist.types';

export const WishlistRepo = {
  findBySession: async (sessionId: string): Promise<Wishlist | null> => { ... },
  addItem: async (sessionId: string, productId: number): Promise<WishlistItem> => { ... },
  removeItem: async (itemId: number): Promise<void> => { ... },
};
```

### 3. Service (`src/shared/api/services/{feature}.service.ts`)

- Lógica de negocio, validaciones, cálculos
- Llama al repository, nunca a SQL directo
- Lanza `Error` con mensajes en español

```ts
import { WishlistRepo } from '@/shared/api/repositories/wishlist.repo';

export const WishlistService = {
  addItem: async (sessionId: string, productId: number) => {
    const exists = await WishlistRepo.findItem(sessionId, productId);
    if (exists) throw new Error('El producto ya está en la lista de deseos');
    return WishlistRepo.addItem(sessionId, productId);
  },
};
```

### 4. API Routes (`src/pages/api/{feature}/index.ts`, `[id].ts`)

Estructura estándar de un route handler:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { WishlistService } from '@/shared/api/services/wishlist.service';
import { getCartSessionId } from '@/shared/api/api-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const sessionId = getCartSessionId(req);
    if (!sessionId) return res.status(400).json({ message: 'Sesión requerida' });
    try {
      const wishlist = await WishlistService.getBySession(sessionId);
      return res.status(200).json(wishlist);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  return res.status(405).json({ message: 'Método no permitido' });
}
```

Reglas:
- Auth pública: usar `getCartSessionId`
- Auth admin: usar `getTokenFromRequest` + `AuthService.verifyToken`
- Siempre manejar 405 al final
- Errores con `error: any` y `error.message`

### 5. Queries (`src/shared/api/querys/{feature}/use-{feature}-query.ts`)

```ts
import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';

export const WISHLIST_QUERY_KEY = 'wishlist';

export function useWishlistQuery() {
  return useQuery({
    queryKey: [WISHLIST_QUERY_KEY],
    queryFn: () => ApiServiceClient(CATALOG_API_URL).get('/wishlist'),
  });
}
```

### 6. Mutations (`src/shared/api/mutations/{feature}/use-add-{feature}-mutation.ts`)

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { WISHLIST_QUERY_KEY } from '@/shared/api/querys/wishlist/use-wishlist-query';

export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) =>
      ApiServiceClient(CATALOG_API_URL).post('/wishlist/items', { product_id: productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY] });
    },
  });
}
```

### 7. Hook del container (`src/components/containers/{feature}/use-{feature}.ts`)

- Compone queries y mutations
- Maneja estado local (paginación, filtros, modales)
- Retorna todo lo que necesita el container

```ts
export function useWishlist() {
  const { data: wishlist, isLoading, isError } = useWishlistQuery();
  const addMutation = useAddToWishlistMutation();
  const removeMutation = useRemoveFromWishlistMutation();

  return {
    items: wishlist?.items ?? [],
    isLoading,
    isError,
    handleAdd: (productId: number) => addMutation.mutate(productId),
    handleRemove: (itemId: number) => removeMutation.mutate(itemId),
  };
}
```

### 8. Container (`src/components/containers/{feature}/{feature}-container.tsx`)

- Solo presentación + orchestración via el hook
- Usa `Typography` con `TypographyVariant.*` para todo texto visible
- Usa `t(TEXT.{FEATURE}.*)` para todas las cadenas
- No llama APIs directamente

```tsx
export function WishlistContainer() {
  const { items, isLoading, handleRemove } = useWishlist();
  const { t } = useTranslation();
  return (
    <div>
      <Typography variant={TypographyVariant.SUBTITLE}>{t(TEXT.WISHLIST.TITLE)}</Typography>
      {/* ... */}
    </div>
  );
}
```

### 9. Página (`src/pages/{feature}/index.tsx`)

```tsx
import { WishlistContainer } from '@/components/containers/wishlist/wishlist-container';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';

export default function WishlistPage() {
  return (
    <StoreLayout>
      <WishlistContainer />
    </StoreLayout>
  );
}
```

### 10. i18n

1. Agregar claves en `src/static/texts/es.json`:
```json
{
  "wishlist": {
    "title": "Lista de Deseos",
    "empty": "Tu lista de deseos está vacía",
    "add": "Añadir a lista de deseos",
    "remove": "Quitar"
  }
}
```

2. Exportar keys en `src/static/texts/i18n.ts`:
```ts
WISHLIST: {
  TITLE:  'wishlist.title',
  EMPTY:  'wishlist.empty',
  ADD:    'wishlist.add',
  REMOVE: 'wishlist.remove',
},
```

### 11. Doc de feature

Crear `.claude/docs/features/{feature}.md` siguiendo el formato de los docs existentes.

---

## Reglas generales

- Nunca usar `h1/h2/h3/p` directamente — siempre `<Typography variant={TypographyVariant.*}>`
- Nunca hardcodear texto visible — siempre `t(TEXT.*)` 
- Nunca hacer fetch dentro de un componente — siempre via hook + query/mutation
- Nombres descriptivos: `productUuid`, `pageNumber`, `orderStatus` (no `p`, `n`, `s`)
- Comentarios solo si el "por qué" no es obvio
