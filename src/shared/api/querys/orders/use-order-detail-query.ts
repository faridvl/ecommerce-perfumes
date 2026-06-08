import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { Order } from '@/types/order/order.types';

export const ORDER_DETAIL_QUERY_KEY = 'order-detail';

export function useOrderDetailQuery(orderUuid: string) {
  return useQuery<Order>({
    queryKey: [ORDER_DETAIL_QUERY_KEY, orderUuid],
    queryFn: () => ApiServiceClient(CATALOG_API_URL).get<Order>(`/orders/${orderUuid}`),
    enabled: !!orderUuid,
    retry: false,
  });
}
