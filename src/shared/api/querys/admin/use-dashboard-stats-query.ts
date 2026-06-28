import { useQuery } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';

export interface DashboardStats {
  salesToday: number;
  pendingOrders: number;
  lowStockCount: number;
  recentOrders: {
    id: number;
    uuid: string;
    customer_name: string;
    customer_whatsapp: string;
    status: string;
    total_amount: number;
    created_at: string;
  }[];
}

export const DASHBOARD_STATS_QUERY_KEY = 'dashboard-stats';

export function useDashboardStatsQuery() {
  return useQuery<DashboardStats>({
    queryKey: [DASHBOARD_STATS_QUERY_KEY],
    queryFn: () => ApiServiceClient(CATALOG_API_URL).get<DashboardStats>('/admin/stats'),
    refetchInterval: 60 * 1000,
  });
}
