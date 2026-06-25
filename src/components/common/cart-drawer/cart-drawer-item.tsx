import React from 'react';
import { CartItem } from '@/types/cart/cart.types';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useUpdateCartItemMutation } from '@/shared/api/mutations/cart/use-update-cart-item-mutation';
import { useRemoveCartItemMutation } from '@/shared/api/mutations/cart/use-remove-cart-item-mutation';

interface CartDrawerItemProps {
  item: CartItem;
}

export function CartDrawerItem({ item }: CartDrawerItemProps) {
  const { executeUpdateItem, isPending: isUpdating } = useUpdateCartItemMutation();
  const { executeRemoveItem, isPending: isRemoving } = useRemoveCartItemMutation();

  const isBusy = isUpdating || isRemoving;

  function handleDecrement() {
    if (item.quantity <= 1) {
      executeRemoveItem(item.id);
    } else {
      executeUpdateItem({ cartItemId: item.id, quantity: item.quantity - 1 });
    }
  }

  function handleIncrement() {
    executeUpdateItem({ cartItemId: item.id, quantity: item.quantity + 1 });
  }

  const lineTotal = (item.unit_price * item.quantity).toFixed(2);

  return (
    <div className="flex gap-3 py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      {/* Placeholder imagen */}
      <div className="w-14 h-14 rounded-md bg-cream dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-neutral-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 3v1m0 0H7a2 2 0 00-2 2v2a4 4 0 001.5 3.12M9 4h6m0 0h2a2 2 0 012 2v2a4 4 0 01-1.5 3.12M15 4v1m-3 8v8m0 0H9m3 0h3"
          />
        </svg>
      </div>

      {/* Info + controles */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="truncate text-sm">
              {item.product_name}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} className="mt-0.5">
              {item.variant_detail}
            </Typography>
          </div>

          <button
            onClick={() => executeRemoveItem(item.id)}
            disabled={isBusy}
            className="flex-shrink-0 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40"
            aria-label="Eliminar producto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Controles +/- */}
          <div className="flex items-center gap-1 border border-neutral-200 dark:border-neutral-700 rounded-md">
            <button
              onClick={handleDecrement}
              disabled={isBusy}
              className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-md transition-colors disabled:opacity-40"
              aria-label="Reducir cantidad"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
            </button>

            <span className="w-7 text-center text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrement}
              disabled={isBusy}
              className="w-7 h-7 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-md transition-colors disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm">
            ${lineTotal}
          </Typography>
        </div>
      </div>
    </div>
  );
}
