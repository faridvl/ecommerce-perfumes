import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { Product } from '@/types/product/product.types';

export const PRODUCT_DETAIL_QUERY_KEY = 'product-detail';

export function useProductDetailQuery(productUuid: string) {
  return useQuery<Product>({
    queryKey: [PRODUCT_DETAIL_QUERY_KEY, productUuid],
    queryFn: () =>
      ApiServiceClient(CATALOG_API_URL).get<Product>(`/products/${productUuid}`),
    enabled: !!productUuid,
  });
}
