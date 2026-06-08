import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { CartItem } from '@/types/cart/cart.types';
import { CART_QUERY_KEY } from '@/shared/api/querys/cart/use-cart-query';

export interface UpdateCartItemPayload {
  cartItemId: number;
  quantity: number;
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  const { mutate: executeUpdateItem, isPending, error, reset } =
    useApiMutation<CartItem, UpdateCartItemPayload>({
      mutationKey: ['cart-update-item'],
      mutationFn: ({ cartItemId, quantity }) =>
        ApiServiceClient(CATALOG_API_URL).put<CartItem>(
          `/cart/items/${cartItemId}`,
          { quantity },
        ),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] }),
    });

  return { executeUpdateItem, isPending, error: !!error, reset };
}
