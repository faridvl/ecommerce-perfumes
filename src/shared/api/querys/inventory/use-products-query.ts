import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { PaginatedProducts } from '@/types/product/product.types';

export interface ProductsQueryParams {
  pageNumber?: number;
  pageLimit?: number;
  search?: string;
  brand?: string;
}

export const PRODUCTS_QUERY_KEY = 'products';

export function useProductsQuery(queryParams: ProductsQueryParams = {}) {
  const { pageNumber = 1, pageLimit = 10, search, brand } = queryParams;

  const queryString = new URLSearchParams({
    page: String(pageNumber),
    limit: String(pageLimit),
    ...(search && { search }),
    ...(brand && { brand }),
  });

  return useQuery<PaginatedProducts>({
    queryKey: [PRODUCTS_QUERY_KEY, pageNumber, pageLimit, search, brand],
    queryFn: () =>
      ApiServiceClient(CATALOG_API_URL).get<PaginatedProducts>(`/products?${queryString}`),
    placeholderData: (previousData) => previousData,
  });
}
