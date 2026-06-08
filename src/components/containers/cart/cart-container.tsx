import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { CartItem } from '@/types/cart/cart.types';
import { useCart } from './use-cart';

export function CartContainer() {
  const { t } = useTranslation();
  const {
    cartItems,
    cartTotal,
    isLoading,
    isError,
    isMutating,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
    handleCheckout,
    handleGoToCatalog,
  } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-10 bg-neutral-200 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, skeletonIndex) => (
              <div key={skeletonIndex} className="flex gap-4 border-b border-neutral-100 pb-6">
                <div className="w-24 h-24 bg-neutral-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  <div className="h-8 bg-neutral-200 rounded w-28 mt-2" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-neutral-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
          {t(TEXT.CART.ERROR)}
        </Typography>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <ShoppingBag size={64} className="mx-auto text-neutral-200" />
        <Typography variant={TypographyVariant.BODY_SEMIBOLD} textColor="text-neutral-400">
          {t(TEXT.CART.EMPTY)}
        </Typography>
        <Button
          variant={ButtonVariant.PRIMARY}
          text={t(TEXT.CART.SEE_CATALOG)}
          onClick={handleGoToCatalog}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Typography variant={TypographyVariant.HEADER} className="font-display">
          {t(TEXT.CART.TITLE)}
        </Typography>
        <button
          onClick={handleClearCart}
          disabled={isMutating}
          className="text-sm text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1 disabled:opacity-40"
        >
          <Trash2 size={14} />
          Vaciar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((cartItem: CartItem) => (
            <div
              key={cartItem.id}
              className={tailwind(
                'flex gap-4 border-b border-neutral-100 pb-6 items-center transition-opacity',
                isMutating && 'opacity-60 pointer-events-none',
              )}
            >
              <div className="w-24 h-24 bg-neutral-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-300">
                  {cartItem.variant_detail}
                </Typography>
              </div>

              <div className="flex-1">
                <Typography variant={TypographyVariant.BODY_BOLD}>
                  {cartItem.product_name}
                </Typography>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-500" className="mb-2">
                  {cartItem.variant_detail}
                </Typography>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => handleDecreaseQuantity(cartItem)}
                    className="p-1 border rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                    {cartItem.quantity}
                  </Typography>
                  <button
                    onClick={() => handleIncreaseQuantity(cartItem)}
                    className="p-1 border rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-primary">
                  ${(cartItem.unit_price * cartItem.quantity).toLocaleString('es-CR')}
                </Typography>
                <button
                  onClick={() => handleRemoveItem(cartItem.id)}
                  className="text-red-400 hover:text-red-600 mt-2 transition-colors block ml-auto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-neutral-50 rounded-3xl p-8 h-fit space-y-6">
          <Typography variant={TypographyVariant.SUBTITLE} className="text-lg">
            {t(TEXT.CART.SUMMARY)}
          </Typography>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography variant={TypographyVariant.BODY} textColor="text-neutral-500">
                {t(TEXT.CART.SUBTOTAL)}
              </Typography>
              <Typography variant={TypographyVariant.BODY_SEMIBOLD}>
                ${cartTotal.toLocaleString('es-CR')}
              </Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant={TypographyVariant.BODY} textColor="text-neutral-500">
                {t(TEXT.CART.SHIPPING)}
              </Typography>
              <Typography
                variant={TypographyVariant.BODY_SEMIBOLD}
                className="text-green-600 font-bold uppercase text-[10px] bg-green-100 px-2 py-1 rounded"
              >
                {t(TEXT.CART.SHIPPING_FREE)}
              </Typography>
            </div>
          </div>

          <div className="h-px bg-neutral-200 w-full" />

          <div className="flex justify-between items-end">
            <Typography variant={TypographyVariant.BODY_BOLD}>
              {t(TEXT.CART.TOTAL)}
            </Typography>
            <Typography variant={TypographyVariant.HEADER} textColor="text-primary" className="text-2xl">
              ${cartTotal.toLocaleString('es-CR')}
            </Typography>
          </div>

          <Button
            variant={ButtonVariant.PRIMARY}
            text={t(TEXT.CART.CHECKOUT)}
            className="w-full h-14 text-lg shadow-xl shadow-primary/20"
            onClick={handleCheckout}
            disabled={isMutating}
          />

          <Typography
            variant={TypographyVariant.CAPTION}
            className="text-center block italic"
            textColor="text-neutral-400"
          >
            {t(TEXT.CART.WHATSAPP_NOTE)}
          </Typography>
        </div>
      </div>
    </div>
  );
}
