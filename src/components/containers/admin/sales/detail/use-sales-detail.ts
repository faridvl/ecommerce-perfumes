import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrderDetailQuery, ORDER_DETAIL_QUERY_KEY } from '@/shared/api/querys/orders/use-order-detail-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { useNavigation } from '@/hooks/use-navigation';
import { OrderStatus } from '@/types/order/order.types';

export function useSalesDetail() {
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const orderUuid = router.query.id as string;

  const { data: order, isLoading, isError } = useOrderDetailQuery(orderUuid);

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(undefined);

  useEffect(() => {
    if (order) setSelectedStatus(order.status);
  }, [order]);

  const { mutate: executeUpdateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationKey: ['order-update-status', orderUuid],
    mutationFn: (newStatus: OrderStatus) =>
      ApiServiceClient(CATALOG_API_URL).put(`/orders/${orderUuid}`, { status: newStatus }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL_QUERY_KEY, orderUuid] }),
  });

  const handleStatusChange = (newStatus: OrderStatus) => {
    setSelectedStatus(newStatus);
    executeUpdateStatus(newStatus);
  };

  const handleBack = () => navigation.admin.sales.index();

  return {
    order,
    selectedStatus,
    isLoading,
    isError,
    isUpdatingStatus,
    handleStatusChange,
    handleBack,
  };
}
