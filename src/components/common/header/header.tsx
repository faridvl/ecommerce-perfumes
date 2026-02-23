import React from 'react';
import { LogOut, ChevronLeft, ShoppingBag } from 'lucide-react';
import { Typography, TypographyVariant } from '../typography/typography';
import { Button, ButtonVariant } from '../button/button';
import { useNavigation } from '@/hooks/use-navigation';

interface HeaderProps {
  title?: string;
  isAdmin?: boolean; // Define si muestra controles de admin o de tienda
  hasBackButton?: boolean;
  onBack?: () => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({
  title,
  isAdmin = false,
  hasBackButton,
  onBack,
  primaryAction
}: HeaderProps) {
  const { auth, shop, back } = useNavigation();
  return (
    <header className="h-20 border-b border-neutral-100 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

        {/* Lado Izquierdo: Logo o Volver */}
        <div className="flex items-center gap-6">
          {hasBackButton ? (
            <button
              onClick={onBack}
              className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all group"
            >
              <ChevronLeft size={22} className="text-neutral-500 group-hover:text-primary" />
            </button>
          ) : (
            <div className="cursor-pointer" onClick={() => shop.home()}>
              <Typography variant={TypographyVariant.SUBTITLE} className="font-display tracking-tighter text-2xl">
                SCENT<span className="text-primary font-black">STACK</span>
              </Typography>
            </div>
          )}

          {/* Título de página (Solo si no es el home) */}
          {title && (
            <div className="hidden md:block">
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-2 inline-block align-middle mr-4" />
              <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="inline-block align-middle">
                {title}
              </Typography>
            </div>
          )}
        </div>

        {/* Lado Derecho: Tienda (Carrito) vs Admin (Logout/Acciones) */}
        <div className="flex items-center gap-4">
          {!isAdmin ? (
            /* VISTA TIENDA */
            <div className="flex items-center gap-6">
              <nav className="hidden lg:flex gap-8 mr-4">
                <Typography variant={TypographyVariant.LINK_TEXT} className="text-neutral-500 hover:text-primary cursor-pointer transition-colors">Hombre</Typography>
                <Typography variant={TypographyVariant.LINK_TEXT} className="text-neutral-500 hover:text-primary cursor-pointer transition-colors">Mujer</Typography>
                <Typography variant={TypographyVariant.LINK_TEXT} className="text-neutral-500 hover:text-primary cursor-pointer transition-colors">Nicho</Typography>
              </nav>
              <div
                className="relative cursor-pointer hover:scale-105 transition-transform p-2 bg-neutral-50 rounded-full"
                onClick={() => shop.cart()}
              >
                <ShoppingBag size={24} className="text-neutral-800" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  2
                </span>
              </div>
            </div>
          ) : (
            /* VISTA ADMIN */
            <div className="flex items-center gap-3">
              {primaryAction && (
                <Button
                  variant={ButtonVariant.PRIMARY}
                  text={primaryAction.label}
                  onClick={primaryAction.onClick}
                  className="h-10 px-5 text-xs shadow-md"
                />
              )}
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-2" />
              <button
                onClick={() => auth.logout()}
                className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors group"
                title="Cerrar sesión"
              >
                <LogOut size={20} className="text-neutral-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}