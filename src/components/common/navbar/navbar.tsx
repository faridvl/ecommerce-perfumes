import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { tailwind } from '@/utils/tailwind-utils';
import { useCartQuery } from '@/shared/api/querys/cart/use-cart-query';
import { useCartDrawer } from '@/shared/context/cart-drawer-context';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: cart } = useCartQuery();
  const { open: openCartDrawer } = useCartDrawer();

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-10 bg-warm-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/catalog" className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-xl text-primary tracking-tight">
              Scent<span className="text-accent">Stack</span>
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/catalog"
              className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors"
            >
              Catálogo
            </Link>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">

            {/* Carrito */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-neutral-600 hover:text-primary transition-colors"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span className={tailwind(
                  'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1',
                  'bg-accent text-white text-[10px] font-bold rounded-full',
                  'flex items-center justify-center leading-none',
                )}>
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Hamburguesa mobile */}
            <button
              className="md:hidden p-2 text-neutral-600 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menú mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 py-4 flex flex-col gap-3">
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-700 hover:text-primary px-2 py-1 transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-neutral-700 hover:text-primary px-2 py-1 transition-colors"
            >
              Mi carrito {cartItemCount > 0 && `(${cartItemCount})`}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
