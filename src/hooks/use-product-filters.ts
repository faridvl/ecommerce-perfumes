import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { ProductGender, OlfactoryFamily, PresentationType, ProductSort } from '@/types/product/product.types';

export interface ProductFilters {
  gender?: ProductGender;
  brand?: string;
  olfactory_family?: OlfactoryFamily;
  presentation_type?: PresentationType;
  min_price?: number;
  max_price?: number;
  sort?: ProductSort;
}

export function useProductFilters() {
  const router = useRouter();

  const filters: ProductFilters = {
    gender: (router.query.gender as ProductGender) || undefined,
    brand: (router.query.brand as string) || undefined,
    olfactory_family: (router.query.olfactory_family as OlfactoryFamily) || undefined,
    presentation_type: (router.query.presentation_type as PresentationType) || undefined,
    min_price: router.query.min_price ? Number(router.query.min_price) : undefined,
    max_price: router.query.max_price ? Number(router.query.max_price) : undefined,
    sort: (router.query.sort as ProductSort) || undefined,
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined).length;

  const setFilter = useCallback(
    (key: keyof ProductFilters, value: string | number | undefined) => {
      const updatedQuery = { ...router.query };
      if (value === undefined || value === '') {
        delete updatedQuery[key];
      } else {
        updatedQuery[key] = String(value);
      }
      router.push({ query: updatedQuery }, undefined, { shallow: true });
    },
    [router],
  );

  const clearFilter = useCallback(
    (key: keyof ProductFilters) => {
      const updatedQuery = { ...router.query };
      delete updatedQuery[key];
      router.push({ query: updatedQuery }, undefined, { shallow: true });
    },
    [router],
  );

  const clearAllFilters = useCallback(() => {
    const { search } = router.query;
    router.push({ query: search ? { search } : {} }, undefined, { shallow: true });
  }, [router]);

  return {
    filters,
    activeFilterCount,
    setFilter,
    clearFilter,
    clearAllFilters,
  };
}
