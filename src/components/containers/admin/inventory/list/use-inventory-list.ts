import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProductsQuery, PRODUCTS_QUERY_KEY } from '@/shared/api/querys/inventory/use-products-query';
import { useDeleteProductMutation } from '@/shared/api/mutations/inventory/use-delete-product-mutation';
import { useNavigation } from '@/hooks/use-navigation';

const PAGE_LIMIT = 10;

export function useInventoryList() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paginatedProducts, isLoading, isError } = useProductsQuery({
    search: searchQuery || undefined,
    pageNumber: currentPage,
    pageLimit: PAGE_LIMIT,
  });

  const { executeDelete, isPending: isDeleting } = useDeleteProductMutation();

  const handleSearchChange = (searchValue: string) => {
    setSearchQuery(searchValue);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleCreate = () => navigation.admin.inventory.create();

  const handleEdit = (productUuid: string) => navigation.admin.inventory.edit(productUuid);

  const handleDelete = (productUuid: string) =>
    executeDelete(productUuid, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] }),
    });

  const totalPages = paginatedProducts
    ? Math.ceil(paginatedProducts.total / PAGE_LIMIT)
    : 0;

  return {
    products: paginatedProducts?.data ?? [],
    totalProducts: paginatedProducts?.total ?? 0,
    searchQuery,
    currentPage,
    totalPages,
    isLoading,
    isError,
    isDeleting,
    handleSearchChange,
    handlePageChange,
    handleCreate,
    handleEdit,
    handleDelete,
  };
}
