import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { CART_QUERY_KEY } from '@/shared/api/querys/cart/use-cart-query';

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  const { mutate: executeClearCart, isPending } = useApiMutation<void, void>({
    mutationKey: ['cart-clear'],
    mutationFn: () => ApiServiceClient(CATALOG_API_URL).delete<void>('/cart'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] }),
  });

  return { executeClearCart, isPending };
}
