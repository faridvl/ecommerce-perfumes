import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { Cart } from '@/types/cart/cart.types';

export const CART_QUERY_KEY = 'cart';

export function useCartQuery() {
  return useQuery<Cart>({
    queryKey: [CART_QUERY_KEY],
    queryFn: () => ApiServiceClient(CATALOG_API_URL).get<Cart>('/cart'),
    staleTime: 1000 * 60 * 5,
  });
}
