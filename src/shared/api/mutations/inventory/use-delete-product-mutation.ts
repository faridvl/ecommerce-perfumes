import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';

export function useDeleteProductMutation() {
  const {
    mutate: executeDelete,
    isPending,
    isSuccess,
    error,
    reset,
  } = useApiMutation<null, string>({
    mutationKey: ['product-delete'],
    mutationFn: (productUuid) =>
      ApiServiceClient(CATALOG_API_URL).delete(`/products/${productUuid}`),
  });

  return { executeDelete, isPending, isSuccess, error: !!error, reset };
}
