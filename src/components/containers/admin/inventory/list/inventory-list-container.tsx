import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, PackageX } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { Product } from '@/types/product/product.types';
import { useInventoryList } from './use-inventory-list';

export function InventoryListContainer() {
  const { t } = useTranslation();
  const {
    products,
    totalProducts,
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
  } = useInventoryList();

  const getProductTotalStock = (product: Product) =>
    product.variants.reduce((accumulator, productVariant) => accumulator + productVariant.stock, 0);

  const getProductMinPrice = (product: Product) =>
    product.variants.length > 0
      ? Math.min(...product.variants.map((productVariant) => productVariant.price_usd))
      : 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant={TypographyVariant.SUBTITLE} className="text-xl font-bold">
            {t(TEXT.ADMIN.INVENTORY.LIST.TITLE)}
          </Typography>
          {!isLoading && !isError && (
            <Typography variant={TypographyVariant.HELPER}>
              {totalProducts} {t(TEXT.ADMIN.INVENTORY.LIST.UNITS)}
            </Typography>
          )}
        </div>
        <Button
          variant={ButtonVariant.PRIMARY}
          text={t(TEXT.ADMIN.INVENTORY.LIST.CREATE_BUTTON)}
          onClick={handleCreate}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Buscador */}
      <div className="relative w-full sm:w-80">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          size={16}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(changeEvent) => handleSearchChange(changeEvent.target.value)}
          placeholder={t(TEXT.ADMIN.INVENTORY.LIST.SEARCH_PLACEHOLDER)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl outline-none border border-neutral-200 focus:border-primary transition-all text-sm"
        />
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-4 animate-pulse flex gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
              <div className="h-3 bg-neutral-200 rounded w-1/3" />
            </div>
            <div className="h-8 w-16 bg-neutral-200 rounded-xl" />
          </div>
        ))}

        {isError && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 text-center">
            <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
              {t(TEXT.ADMIN.INVENTORY.LIST.ERROR)}
            </Typography>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
            <PackageX size={36} className="mx-auto text-neutral-200 mb-3" />
            <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
              {t(TEXT.ADMIN.INVENTORY.LIST.EMPTY)}
            </Typography>
          </div>
        )}

        {!isLoading && !isError && products.map((product: Product) => {
          const totalStock = getProductTotalStock(product);
          const minPrice = getProductMinPrice(product);
          return (
            <div
              key={product.uuid}
              onClick={() => handleEdit(product.uuid)}
              className={tailwind(
                'bg-white rounded-2xl border border-neutral-100 p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all',
                isDeleting && 'opacity-60 pointer-events-none',
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm truncate">
                    {product.name}
                  </Typography>
                  <span className={tailwind(
                    'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                    product.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500',
                  )}>
                    {product.is_active ? t(TEXT.ADMIN.INVENTORY.LIST.STATUS_ACTIVE) : t(TEXT.ADMIN.INVENTORY.LIST.STATUS_INACTIVE)}
                  </span>
                </div>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="block">
                  {product.brand}
                </Typography>
                <div className="flex items-center gap-3 mt-1.5">
                  <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-primary" className="text-sm">
                    ${minPrice.toLocaleString('es-CR')}
                  </Typography>
                  <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                    {totalStock} {t(TEXT.ADMIN.INVENTORY.LIST.UNITS)}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(product.uuid)}
                  className="p-2.5 text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(product.uuid)}
                  className="p-2.5 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla — desktop */}
      <div className="hidden md:block bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              {[
                TEXT.ADMIN.INVENTORY.LIST.COL_PRODUCT,
                TEXT.ADMIN.INVENTORY.LIST.COL_STOCK,
                TEXT.ADMIN.INVENTORY.LIST.COL_PRICE,
                TEXT.ADMIN.INVENTORY.LIST.COL_STATUS,
                TEXT.ADMIN.INVENTORY.LIST.COL_ACTIONS,
              ].map((columnKey) => (
                <th key={columnKey} className="px-6 py-4 text-xs font-bold uppercase text-neutral-500 tracking-wide">
                  {t(columnKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading && Array.from({ length: 5 }).map((_, skeletonIndex) => (
              <tr key={skeletonIndex} className="animate-pulse">
                <td className="px-6 py-4"><div className="h-4 bg-neutral-200 rounded w-40 mb-1" /><div className="h-3 bg-neutral-200 rounded w-24" /></td>
                <td className="px-6 py-4"><div className="h-4 bg-neutral-200 rounded w-16" /></td>
                <td className="px-6 py-4"><div className="h-4 bg-neutral-200 rounded w-20" /></td>
                <td className="px-6 py-4"><div className="h-6 bg-neutral-200 rounded-full w-16" /></td>
                <td className="px-6 py-4"><div className="h-8 bg-neutral-200 rounded w-24" /></td>
              </tr>
            ))}
            {isError && (
              <tr><td colSpan={5} className="px-6 py-12 text-center"><Typography variant={TypographyVariant.BODY} textColor="text-red-500">{t(TEXT.ADMIN.INVENTORY.LIST.ERROR)}</Typography></td></tr>
            )}
            {!isLoading && !isError && products.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-16 text-center"><PackageX size={40} className="mx-auto text-neutral-200 mb-3" /><Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">{t(TEXT.ADMIN.INVENTORY.LIST.EMPTY)}</Typography></td></tr>
            )}
            {!isLoading && !isError && products.map((product: Product) => {
              const totalStock = getProductTotalStock(product);
              const minPrice = getProductMinPrice(product);
              return (
                <tr key={product.uuid} className={tailwind('hover:bg-neutral-50 transition-colors', isDeleting && 'opacity-60 pointer-events-none')}>
                  <td className="px-6 py-4">
                    <Typography variant={TypographyVariant.BODY_BOLD} className="leading-tight">{product.name}</Typography>
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">{product.brand}</Typography>
                  </td>
                  <td className="px-6 py-4"><Typography variant={TypographyVariant.BODY} textColor="text-neutral-600">{totalStock} {t(TEXT.ADMIN.INVENTORY.LIST.UNITS)}</Typography></td>
                  <td className="px-6 py-4"><Typography variant={TypographyVariant.BODY_BOLD} textColor="text-primary">${minPrice.toLocaleString('es-CR')}</Typography></td>
                  <td className="px-6 py-4">
                    <span className={tailwind('inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', product.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500')}>
                      {product.is_active ? t(TEXT.ADMIN.INVENTORY.LIST.STATUS_ACTIVE) : t(TEXT.ADMIN.INVENTORY.LIST.STATUS_INACTIVE)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(product.uuid)} className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title={t(TEXT.ADMIN.INVENTORY.LIST.ACTION_EDIT)}><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(product.uuid)} className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t(TEXT.ADMIN.INVENTORY.LIST.ACTION_DELETE)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
