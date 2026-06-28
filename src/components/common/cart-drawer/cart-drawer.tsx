import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCartDrawer } from '@/shared/context/cart-drawer-context';
import { useCartQuery } from '@/shared/api/querys/cart/use-cart-query';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { CartDrawerItem } from './cart-drawer-item';
import { CartDrawerEmpty } from './cart-drawer-empty';

export function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const { data: cart, isLoading } = useCartQuery();

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-neutral-900 z-50 flex flex-col shadow-2xl animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Typography variant={TypographyVariant.BODY_BOLD}>Tu carrito</Typography>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold">
                {itemCount}
              </span>
            )}
          </div>

          <button
            onClick={close}
            className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5">
          {isLoading ? (
            <div className="flex flex-col gap-4 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-14 h-14 rounded-md bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <CartDrawerEmpty />
          ) : (
            <div>
              {items.map((item) => (
                <CartDrawerItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 pt-4 pb-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3 safe-area-inset-bottom">
            <div className="flex items-center justify-between">
              <Typography variant={TypographyVariant.BODY}>Subtotal</Typography>
              <Typography variant={TypographyVariant.BODY_BOLD}>${subtotal.toFixed(2)}</Typography>
            </div>

            <Link href="/checkout" onClick={close} className="block w-full">
              <span className="flex items-center justify-center w-full px-5 py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors">
                Ir al checkout
              </span>
            </Link>

            <Link href="/cart" onClick={close} className="block w-full text-center">
              <Typography
                variant={TypographyVariant.HELPER}
                className="hover:underline cursor-pointer"
              >
                Ver carrito completo
              </Typography>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
