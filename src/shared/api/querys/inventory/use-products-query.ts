import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { PaginatedProducts, ProductGender, OlfactoryFamily, PresentationType, ProductSort } from '@/types/product/product.types';

export interface ProductsQueryParams {
  pageNumber?: number;
  pageLimit?: number;
  search?: string;
  brand?: string;
  gender?: ProductGender;
  olfactory_family?: OlfactoryFamily;
  presentation_type?: PresentationType;
  min_price?: number;
  max_price?: number;
  sort?: ProductSort;
}

export const PRODUCTS_QUERY_KEY = 'products';
export const BRANDS_QUERY_KEY = 'product-brands';

export function useProductsQuery(queryParams: ProductsQueryParams = {}) {
  const {
    pageNumber = 1,
    pageLimit = 10,
    search,
    brand,
    gender,
    olfactory_family,
    presentation_type,
    min_price,
    max_price,
    sort,
  } = queryParams;

  const queryString = new URLSearchParams({
    page: String(pageNumber),
    limit: String(pageLimit),
    ...(search && { search }),
    ...(brand && { brand }),
    ...(gender && { gender }),
    ...(olfactory_family && { olfactory_family }),
    ...(presentation_type && { presentation_type }),
    ...(min_price != null && { min_price: String(min_price) }),
    ...(max_price != null && { max_price: String(max_price) }),
    ...(sort && { sort }),
  });

  return useQuery<PaginatedProducts>({
    queryKey: [PRODUCTS_QUERY_KEY, pageNumber, pageLimit, search, brand, gender, olfactory_family, presentation_type, min_price, max_price, sort],
    queryFn: () =>
      ApiServiceClient(CATALOG_API_URL).get<PaginatedProducts>(`/products?${queryString}`),
    placeholderData: (previousData) => previousData,
  });
}

export function useBrandsQuery() {
  return useQuery<string[]>({
    queryKey: [BRANDS_QUERY_KEY],
    queryFn: () =>
      ApiServiceClient(CATALOG_API_URL).get<string[]>('/products/brands'),
    staleTime: 5 * 60 * 1000,
  });
}
