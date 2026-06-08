import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/shared/api/mutations/use-api-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { Cart, CartItemInput } from '@/types/cart/cart.types';
import { CART_QUERY_KEY } from '@/shared/api/querys/cart/use-cart-query';

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();

  const { mutate: executeAddItem, isPending, error, reset } =
    useApiMutation<Cart, CartItemInput>({
      mutationKey: ['cart-add-item'],
      mutationFn: (cartItemInput) =>
        ApiServiceClient(CATALOG_API_URL).post<Cart>('/cart/items', cartItemInput),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] }),
    });

  return { executeAddItem, isPending, error: !!error, reset };
}
