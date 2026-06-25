import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { Order, OrderStatus } from '@/types/order/order.types';
import { useSalesList } from './use-sales-list';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-neutral-100 text-neutral-500',
};

const STATUS_LABEL_KEYS: Record<OrderStatus, string> = {
  pending:   TEXT.ADMIN.SALES.LIST.STATUS_PENDING,
  confirmed: TEXT.ADMIN.SALES.LIST.STATUS_CONFIRMED,
  shipped:   TEXT.ADMIN.SALES.LIST.STATUS_SHIPPED,
  delivered: TEXT.ADMIN.SALES.LIST.STATUS_DELIVERED,
  cancelled: TEXT.ADMIN.SALES.LIST.STATUS_CANCELLED,
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export function SalesListContainer() {
  const { t } = useTranslation();
  const {
    orders,
    totalOrders,
    currentPage,
    totalPages,
    statusFilter,
    isLoading,
    isError,
    handlePageChange,
    handleStatusFilter,
    handleViewOrder,
  } = useSalesList();

  return (
    <div className="flex flex-col gap-6">

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-xl font-bold">
            {t(TEXT.ADMIN.SALES.LIST.TITLE)}
          </Typography>
          {!isLoading && !isError && (
            <Typography variant={TypographyVariant.HELPER}>
              {totalOrders} {t(TEXT.ADMIN.INVENTORY.LIST.UNITS)}
            </Typography>
          )}
        </div>

        {/* Filtro por estado */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter(undefined)}
            className={tailwind(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
              statusFilter === undefined
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary',
            )}
          >
            Todos
          </button>
          {ALL_STATUSES.map((orderStatus) => (
            <button
              key={orderStatus}
              onClick={() => handleStatusFilter(orderStatus)}
              className={tailwind(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
                statusFilter === orderStatus
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary',
              )}
            >
              {t(STATUS_LABEL_KEYS[orderStatus])}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              {[
                TEXT.ADMIN.SALES.LIST.COL_ORDER,
                TEXT.ADMIN.SALES.LIST.COL_CUSTOMER,
                TEXT.ADMIN.SALES.LIST.COL_DATE,
                TEXT.ADMIN.SALES.LIST.COL_TOTAL,
                TEXT.ADMIN.SALES.LIST.COL_STATUS,
                TEXT.ADMIN.SALES.LIST.COL_ACTIONS,
              ].map((columnKey) => (
                <th
                  key={columnKey}
                  className="px-6 py-4 text-xs font-bold uppercase text-neutral-500 tracking-wide"
                >
                  {t(columnKey)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {isLoading &&
              Array.from({ length: 5 }).map((_, skeletonIndex) => (
                <tr key={skeletonIndex} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-neutral-200 rounded w-20" /></td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-neutral-200 rounded w-32 mb-1" />
                    <div className="h-3 bg-neutral-200 rounded w-40" />
                  </td>
                  <td className="px-6 py-4"><div className="h-4 bg-neutral-200 rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-neutral-200 rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-6 bg-neutral-200 rounded-full w-24" /></td>
                  <td className="px-6 py-4"><div className="h-8 bg-neutral-200 rounded w-10" /></td>
                </tr>
              ))}

            {isError && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
                    {t(TEXT.ADMIN.SALES.LIST.ERROR)}
                  </Typography>
                </td>
              </tr>
            )}

            {!isLoading && !isError && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <ShoppingBag size={40} className="mx-auto text-neutral-200 mb-3" />
                  <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
                    {t(TEXT.ADMIN.SALES.LIST.EMPTY)}
                  </Typography>
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              orders.map((order: Order) => (
                <tr
                  key={order.uuid}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Typography
                      variant={TypographyVariant.BODY_SEMIBOLD}
                      textColor="text-primary"
                      className="font-mono text-sm"
                    >
                      #SS-{order.id}
                    </Typography>
                  </td>

                  <td className="px-6 py-4">
                    <Typography variant={TypographyVariant.BODY_BOLD} className="leading-tight">
                      {order.customer_name}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                      {order.customer_whatsapp}
                    </Typography>
                  </td>

                  <td className="px-6 py-4">
                    <Typography variant={TypographyVariant.BODY} textColor="text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString('es-CR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Typography>
                  </td>

                  <td className="px-6 py-4">
                    <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-primary">
                      ${order.total_amount.toLocaleString('es-CR')}
                    </Typography>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={tailwind(
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
                        STATUS_STYLES[order.status],
                      )}
                    >
                      {t(STATUS_LABEL_KEYS[order.status])}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewOrder(order.uuid)}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      title={t(TEXT.ADMIN.SALES.LIST.ACTION_VIEW)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
            Página {currentPage} de {totalPages}
          </Typography>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
