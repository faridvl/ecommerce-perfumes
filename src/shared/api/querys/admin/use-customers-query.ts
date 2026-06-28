import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';

export interface Customer {
  customer_name: string;
  customer_whatsapp: string;
  order_count: number;
  total_spent: number;
  last_order_at: string;
}

export const CUSTOMERS_QUERY_KEY = 'admin-customers';

export function useCustomersQuery() {
  return useQuery<Customer[]>({
    queryKey: [CUSTOMERS_QUERY_KEY],
    queryFn: () => ApiServiceClient(CATALOG_API_URL).get<Customer[]>('/admin/customers'),
  });
}
