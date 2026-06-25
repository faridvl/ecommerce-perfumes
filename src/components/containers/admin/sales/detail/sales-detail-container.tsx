import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Phone, MapPin, Calendar, Hash } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { OrderItem, OrderStatus } from '@/types/order/order.types';
import { useSalesDetail } from './use-sales-detail';

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

export function SalesDetailContainer() {
  const { t } = useTranslation();
  const {
    order,
    selectedStatus,
    isLoading,
    isError,
    isUpdatingStatus,
    handleStatusChange,
    handleBack,
  } = useSalesDetail();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 h-48" />
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 h-48" />
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 h-64" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col gap-4 py-20 text-center max-w-4xl">
        <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
          {isError ? t(TEXT.ADMIN.SALES.DETAIL.ERROR) : t(TEXT.ADMIN.SALES.DETAIL.NOT_FOUND)}
        </Typography>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-primary hover:underline mx-auto"
        >
          <ArrowLeft size={14} />
          {t(TEXT.ADMIN.SALES.DETAIL.BACK)}
        </button>
      </div>
    );
  }

  const orderTotal = order.items.reduce(
    (accumulator, orderItem) => accumulator + orderItem.unit_price * orderItem.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl">

      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-xl font-bold">
            {t(TEXT.ADMIN.SALES.DETAIL.TITLE)}
          </Typography>
          <Typography
            variant={TypographyVariant.BODY_SEMIBOLD}
            textColor="text-primary"
            className="font-mono"
          >
            #SS-{order.id}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Info del cliente */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col gap-4">
          <Typography variant={TypographyVariant.BODY_BOLD}>
            {t(TEXT.ADMIN.SALES.DETAIL.CUSTOMER)}
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                  {t(TEXT.ADMIN.SALES.DETAIL.CUSTOMER)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                  {order.customer_name}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                  {t(TEXT.ADMIN.SALES.DETAIL.WHATSAPP)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                  {order.customer_whatsapp}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                  {t(TEXT.ADMIN.SALES.DETAIL.ADDRESS)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                  {order.customer_address}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                  {t(TEXT.ADMIN.SALES.DETAIL.ORDER_NUMBER)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="font-mono">
                  #SS-{order.id}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                  {t(TEXT.ADMIN.SALES.DETAIL.DATE)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                  {new Date(order.created_at).toLocaleDateString('es-CR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col gap-4">
          <Typography variant={TypographyVariant.BODY_BOLD}>
            {t(TEXT.ADMIN.SALES.DETAIL.STATUS)}
          </Typography>

          {selectedStatus && (
            <span
              className={tailwind(
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide w-fit',
                STATUS_STYLES[selectedStatus],
              )}
            >
              {t(STATUS_LABEL_KEYS[selectedStatus])}
            </span>
          )}

          <div className="flex flex-col gap-2 mt-2">
            <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
              {t(TEXT.ADMIN.SALES.DETAIL.UPDATE_STATUS)}
            </Typography>
            <select
              value={selectedStatus ?? ''}
              onChange={(changeEvent) =>
                handleStatusChange(changeEvent.target.value as OrderStatus)
              }
              disabled={isUpdatingStatus}
              className={tailwind(
                'w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary transition-colors',
                isUpdatingStatus && 'opacity-60 cursor-not-allowed',
              )}
            >
              {ALL_STATUSES.map((orderStatus) => (
                <option key={orderStatus} value={orderStatus}>
                  {t(STATUS_LABEL_KEYS[orderStatus])}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-auto pt-4 border-t border-neutral-100">
            <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
              {t(TEXT.ADMIN.SALES.DETAIL.TOTAL)}
            </Typography>
            <Typography variant={TypographyVariant.HEADER} textColor="text-primary" className="text-2xl">
              ${orderTotal.toLocaleString('es-CR')}
            </Typography>
          </div>
        </div>
      </div>

      {/* Tabla de items */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100">
          <Typography variant={TypographyVariant.BODY_BOLD}>
            {t(TEXT.ADMIN.SALES.DETAIL.ITEMS_TITLE)}
          </Typography>
        </div>

        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              {[
                TEXT.ADMIN.SALES.DETAIL.COL_PRODUCT,
                TEXT.ADMIN.SALES.DETAIL.COL_VARIANT,
                TEXT.ADMIN.SALES.DETAIL.COL_QTY,
                TEXT.ADMIN.SALES.DETAIL.COL_PRICE,
                TEXT.ADMIN.SALES.DETAIL.COL_SUBTOTAL,
              ].map((columnKey) => (
                <th
                  key={columnKey}
                  className="px-6 py-3 text-xs font-bold uppercase text-neutral-500 tracking-wide"
                >
                  {t(columnKey)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {order.items.map((orderItem: OrderItem) => (
              <tr key={orderItem.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <Typography variant={TypographyVariant.BODY_BOLD}>
                    {orderItem.product_name}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography variant={TypographyVariant.BODY} textColor="text-neutral-600">
                    {orderItem.variant_detail}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography variant={TypographyVariant.BODY}>
                    {orderItem.quantity}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography variant={TypographyVariant.BODY}>
                    ${orderItem.unit_price.toLocaleString('es-CR')}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-primary">
                    ${(orderItem.unit_price * orderItem.quantity).toLocaleString('es-CR')}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="border-t-2 border-neutral-100">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-right">
                <Typography variant={TypographyVariant.BODY_BOLD}>
                  {t(TEXT.ADMIN.SALES.DETAIL.TOTAL)}
                </Typography>
              </td>
              <td className="px-6 py-4">
                <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-primary" className="text-lg">
                  ${orderTotal.toLocaleString('es-CR')}
                </Typography>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
