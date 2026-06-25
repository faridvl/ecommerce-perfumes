# Patrón: Agregar un Container Component

Los containers viven en `src/components/containers/{area}/{feature}/`.  
Cada container tiene exactamente dos archivos: el componente y su hook.

---

## Estructura de archivos

```
src/components/containers/{area}/{feature}/
├── {feature}-container.tsx     # Solo presentación
└── use-{feature}.ts            # Estado y lógica
```

---

## Hook (`use-{feature}.ts`)

- Compone queries y mutations de TanStack Query
- Maneja estado local del UI (página actual, filtros, modales abiertos)
- Retorna un objeto plano con todo lo que necesita el container
- Sin JSX, sin imports de React (salvo `useState`, `useCallback`)

```ts
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useWishlistQuery } from '@/shared/api/querys/wishlist/use-wishlist-query';
import { useRemoveFromWishlistMutation } from '@/shared/api/mutations/wishlist/use-remove-from-wishlist-mutation';

export function useWishlist() {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { data: wishlist, isLoading, isError } = useWishlistQuery();
  const removeMutation = useRemoveFromWishlistMutation();

  function handleRemove(itemId: number) {
    removeMutation.mutate(itemId);
  }

  return {
    items: wishlist?.items ?? [],
    isLoading,
    isError,
    confirmDeleteId,
    setConfirmDeleteId,
    handleRemove,
  };
}
```

---

## Container (`{feature}-container.tsx`)

- Solo presentación y orquestación via el hook
- Nunca llama queries/mutations directamente
- Todo texto visible: `t(TEXT.{FEATURE}.*)`
- Todo texto: `<Typography variant={TypographyVariant.*}>`

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { useWishlist } from './use-wishlist';

export function WishlistContainer() {
  const { t } = useTranslation();
  const { items, isLoading, isError, handleRemove } = useWishlist();

  if (isLoading) {
    return <div className="animate-pulse">{/* skeleton */}</div>;
  }

  if (isError) {
    return (
      <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
        {t(TEXT.WISHLIST.ERROR)}
      </Typography>
    );
  }

  if (items.length === 0) {
    return (
      <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
        {t(TEXT.WISHLIST.EMPTY)}
      </Typography>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography variant={TypographyVariant.SUBTITLE}>{t(TEXT.WISHLIST.TITLE)}</Typography>
      {items.map((item) => (
        <div key={item.id}>
          <Typography variant={TypographyVariant.BODY_BOLD}>{item.product_name}</Typography>
          <button onClick={() => handleRemove(item.id)}>
            {t(TEXT.WISHLIST.REMOVE)}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Página que lo usa

```tsx
// src/pages/wishlist/index.tsx
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

Para páginas admin: usar `DashboardLayout` y agregar `getServerSideProps = authorizeServerSidePage()`.

---

## Reglas de presentación

| Prohibido | Usar en su lugar |
|-----------|-----------------|
| `<h1>`, `<h2>`, `<p>` | `<Typography variant={TypographyVariant.*}>` |
| Texto hardcodeado | `t(TEXT.{NAMESPACE}.{KEY})` |
| `style={{ ... }}` | Clases Tailwind |
| Clases Tailwind condicionales complejas | `tailwind(base, condition && 'clase')` |
| `fetch()` directo | Hook con query/mutation |
| Lógica de negocio | Mover al hook o al service |

---

## TypographyVariant disponibles

```ts
HEADER          // Títulos principales
SUBTITLE        // Subtítulos / sección
BODY            // Texto normal
BODY_BOLD       // Texto con peso
BODY_SEMIBOLD   // Texto semi-bold
CAPTION         // Texto pequeño secundario
HELPER          // Etiquetas, hints
```
