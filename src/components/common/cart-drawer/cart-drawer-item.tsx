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
      {/* Miniatura del producto */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
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
