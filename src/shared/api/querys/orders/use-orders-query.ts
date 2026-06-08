import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { PaginatedOrders, OrderStatus } from '@/types/order/order.types';

export const ORDERS_QUERY_KEY = 'orders';

export interface OrdersQueryParams {
  pageNumber?: number;
  pageLimit?: number;
  status?: OrderStatus;
}

export function useOrdersQuery(queryParams: OrdersQueryParams = {}) {
  const { pageNumber = 1, pageLimit = 10, status } = queryParams;

  const queryString = new URLSearchParams({
    page: String(pageNumber),
    limit: String(pageLimit),
    ...(status && { status }),
  });

  return useQuery<PaginatedOrders>({
    queryKey: [ORDERS_QUERY_KEY, pageNumber, pageLimit, status],
    queryFn: () =>
      ApiServiceClient(CATALOG_API_URL).get<PaginatedOrders>(`/orders?${queryString}`),
    placeholderData: (previousData) => previousData,
  });
}
