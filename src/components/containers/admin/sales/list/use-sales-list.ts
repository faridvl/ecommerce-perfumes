import { useState } from 'react';
import { useOrdersQuery } from '@/shared/api/querys/orders/use-orders-query';
import { useNavigation } from '@/hooks/use-navigation';
import { OrderStatus } from '@/types/order/order.types';

const PAGE_LIMIT = 10;

export function useSalesList() {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);

  const { data: paginatedOrders, isLoading, isError } = useOrdersQuery({
    pageNumber: currentPage,
    pageLimit: PAGE_LIMIT,
    status: statusFilter,
  });

  const totalPages = paginatedOrders
    ? Math.ceil(paginatedOrders.total / PAGE_LIMIT)
    : 0;

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleStatusFilter = (orderStatus: OrderStatus | undefined) => {
    setStatusFilter(orderStatus);
    setCurrentPage(1);
  };

  const handleViewOrder = (orderUuid: string) => navigation.admin.sales.detail(orderUuid);

  return {
    orders: paginatedOrders?.data ?? [],
    totalOrders: paginatedOrders?.total ?? 0,
    currentPage,
    totalPages,
    statusFilter,
    isLoading,
    isError,
    handlePageChange,
    handleStatusFilter,
    handleViewOrder,
  };
}
