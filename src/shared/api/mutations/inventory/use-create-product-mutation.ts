import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { Product, ProductInput } from '@/types/product/product.types';

export function useCreateProductMutation() {
  const {
    mutate: executeCreate,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation<Product, ProductInput>({
    mutationKey: ['product-create'],
    mutationFn: (productInput) =>
      ApiServiceClient(CATALOG_API_URL).post<Product>('/products', productInput),
  });

  return { executeCreate, isPending, isSuccess, error: !!error, reset };
}
