import React from 'react';
import Link from 'next/link';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useCartDrawer } from '@/shared/context/cart-drawer-context';

export function CartDrawerEmpty() {
  const { close } = useCartDrawer();

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>

      <div className="space-y-1">
        <Typography variant={TypographyVariant.BODY_BOLD}>Tu carrito está vacío</Typography>
        <Typography variant={TypographyVariant.HELPER}>
          Explora nuestro catálogo y agrega tus fragancias favoritas.
        </Typography>
      </div>

      <Link href="/catalog" onClick={close}>
        <span className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
          Ver catálogo
        </span>
      </Link>
    </div>
  );
}
