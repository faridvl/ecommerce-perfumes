import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { Product, ProductInput } from '@/types/product/product.types';

export interface UpdateProductPayload {
  productUuid: string;
  productData: Partial<Omit<ProductInput, 'variants' | 'images'>>;
}

export function useUpdateProductMutation() {
  const {
    mutate: executeUpdate,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation<Product, UpdateProductPayload>({
    mutationKey: ['product-update'],
    mutationFn: ({ productUuid, productData }) =>
      ApiServiceClient(CATALOG_API_URL).put<Product>(`/products/${productUuid}`, productData),
  });

  return { executeUpdate, isPending, isSuccess, error: !!error, reset };
}
