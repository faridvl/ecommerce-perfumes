import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { CART_QUERY_KEY } from '@/shared/api/querys/cart/use-cart-query';

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  const { mutate: executeRemoveItem, isPending, error, reset } =
    useApiMutation<void, number>({
      mutationKey: ['cart-remove-item'],
      mutationFn: (cartItemId) =>
        ApiServiceClient(CATALOG_API_URL).delete<void>(`/cart/items/${cartItemId}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] }),
    });

  return { executeRemoveItem, isPending, error: !!error, reset };
}
