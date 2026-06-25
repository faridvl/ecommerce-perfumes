# Patrón: Agregar Queries y Mutations

TanStack Query v5 es el estándar. Queries y mutations viven en `src/shared/api/`.

---

## Estructura de directorios

```
src/shared/api/
├── querys/
│   └── {feature}/
│       ├── use-{feature}-query.ts         # lista
│       └── use-{feature}-detail-query.ts  # detalle por id
└── mutations/
    └── {feature}/
        ├── use-create-{feature}-mutation.ts
        ├── use-update-{feature}-mutation.ts
        └── use-delete-{feature}-mutation.ts
```

---

## Query de lista con parámetros

```ts
// src/shared/api/querys/wishlist/use-wishlist-query.ts
import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { Wishlist } from '@/types/wishlist/wishlist.types';

export const WISHLIST_QUERY_KEY = 'wishlist';

export function useWishlistQuery() {
  return useQuery<Wishlist>({
    queryKey: [WISHLIST_QUERY_KEY],
    queryFn: () => ApiServiceClient(CATALOG_API_URL).get<Wishlist>('/wishlist'),
  });
}
```

## Query de lista paginada con filtros

```ts
export interface WishlistQueryParams {
  pageNumber?: number;
  pageLimit?: number;
  status?: string;
}

export function useWishlistQuery(queryParams: WishlistQueryParams = {}) {
  const { pageNumber = 1, pageLimit = 10, status } = queryParams;

  const queryString = new URLSearchParams({
    page: String(pageNumber),
    limit: String(pageLimit),
    ...(status && { status }),
  });

  return useQuery<PaginatedWishlist>({
    queryKey: [WISHLIST_QUERY_KEY, pageNumber, pageLimit, status],
    queryFn: () =>
      ApiServiceClient(CATALOG_API_URL).get<PaginatedWishlist>(`/wishlist?${queryString}`),
    placeholderData: (previousData) => previousData, // mantiene datos anteriores durante re-fetch
  });
}
```

---

## Query de detalle

```ts
// src/shared/api/querys/wishlist/use-wishlist-item-query.ts
export const WISHLIST_ITEM_QUERY_KEY = 'wishlist-item';

export function useWishlistItemQuery(itemId: string | undefined) {
  return useQuery<WishlistItem>({
    queryKey: [WISHLIST_ITEM_QUERY_KEY, itemId],
    queryFn: () =>
      ApiServiceClient(CATALOG_API_URL).get<WishlistItem>(`/wishlist/items/${itemId}`),
    enabled: !!itemId, // no ejecutar si no hay id
  });
}
```

---

## Mutation de creación

```ts
// src/shared/api/mutations/wishlist/use-add-to-wishlist-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { WISHLIST_QUERY_KEY } from '@/shared/api/querys/wishlist/use-wishlist-query';
import { WishlistItem } from '@/types/wishlist/wishlist.types';

export function useAddToWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<WishlistItem, Error, { productId: number }>({
    mutationFn: ({ productId }) =>
      ApiServiceClient(CATALOG_API_URL).post<WishlistItem>('/wishlist/items', {
        product_id: productId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY] });
    },
  });
}
```

---

## Mutation de eliminación

```ts
export function useRemoveFromWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (itemId) =>
      ApiServiceClient(CATALOG_API_URL).delete(`/wishlist/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY] });
    },
  });
}
```

---

## ApiServiceClient

`src/shared/api/api-service-client.ts` — cliente HTTP que inyecta el Bearer token automáticamente.

```ts
// Uso
ApiServiceClient(CATALOG_API_URL).get<T>(path)
ApiServiceClient(CATALOG_API_URL).post<T>(path, body)
ApiServiceClient(CATALOG_API_URL).put<T>(path, body)
ApiServiceClient(CATALOG_API_URL).delete(path)
```

- `AUTH_API_URL`: para endpoints de autenticación
- `CATALOG_API_URL`: para todo lo demás (productos, carrito, órdenes)

Ambas URLs vienen de `src/shared/api/config.ts` → `NEXT_PUBLIC_AUTH_API_URL` y `NEXT_PUBLIC_CATALOG_API_URL`.

---

## Reglas

- Los query keys deben ser constantes exportadas (`export const X_QUERY_KEY = 'x'`)
- Siempre invalidar el query key relevante en `onSuccess`
- Usar `enabled: !!param` para queries condicionales (evita llamadas con undefined)
- Usar `placeholderData: (prev) => prev` en listas paginadas para evitar flash de loading
- Tipar el genérico: `useQuery<ResponseType>`, `useMutation<Response, Error, Variables>`
