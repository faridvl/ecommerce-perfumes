import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DashboardLayoutContent } from './dasboard-content';
import { BoxedLayoutStyle } from './boxed-container/boxed-container';
import { SuccessAlert } from '../alerts/success-alert';
import { tailwind } from '@/utils/tailwind-utils';
import { Typography, TypographyVariant } from '../typography/typography';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { useNavigation } from '@/hooks/use-navigation';
import DesktopSidebar from '../sidebar/desktop-sidebar/desktop-sidebar';
import { NAVIGATION_PATHS } from '@/shared/constants/sidebar';

export type UseDashboardLayoutHook = {
  setPageTitle: (title: string) => void;
  setHasBackButton: (value: boolean) => void;
  setHeaderMenu: (actionButtonProps: any) => void;
  setActionsButton: (actionButtonProps: any) => void;
  setBackNavigationHandler: (handler: () => void) => void;
  setContentClassNames: (classNames: string) => void;
  setDashBoardPadding: (bottomPadding: string) => void;
  setBoxClassName: (classnames: string) => void;
  setShowSuccess: (value: boolean) => void;
};

type LayoutProps = {
  title?: string;
  contentStyle?: BoxedLayoutStyle;
  isMainPage?: boolean;
  children?: React.ReactNode | ((useDashboardLayout: UseDashboardLayoutHook) => React.ReactNode);
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  hideSidebar?: boolean;
};

export function DashboardLayout({
  children,
  isMainPage = true,
  title,
  contentStyle = BoxedLayoutStyle.BOXED,
  onScroll,
  hideSidebar = false,
}: LayoutProps) {
  const [pageTitle, setPageTitle] = useState(title);
  const [contentClassNames, setContentClassNames] = useState('');
  const [bottomPadding, setDashBoardPadding] = useState('');
  const [backNavigationHandler, setBackNavigationHandler] = useState<() => void>();
  const [hasBackButton, setHasBackButton] = useState(!isMainPage);
  const [boxClassName, setBoxClassName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { auth } = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (title) setPageTitle(title);
  }, [title]);

  const layoutControls: UseDashboardLayoutHook = {
    setPageTitle,
    setHasBackButton,
    setBackNavigationHandler,
    setHeaderMenu: () => {},
    setActionsButton: () => {},
    setContentClassNames,
    setDashBoardPadding,
    setBoxClassName,
    setShowSuccess,
  };

  const renderedChildren = typeof children === 'function'
    ? (children(layoutControls) as React.ReactElement)
    : (children as React.ReactElement);

  const handleLogout = () => {
    CookiesManager.clearAll();
    auth.login();
  };

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden relative bg-neutral-50 dark:bg-background">

      {/* Notificaciones */}
      <div className="absolute top-4 right-4 z-[100] pointer-events-none">
        {showSuccess && (
          <div className="pointer-events-auto">
            <SuccessAlert onClose={() => setShowSuccess(false)} />
          </div>
        )}
      </div>

      {/* Sidebar desktop */}
      {!hideSidebar && (
        <div className="hidden md:flex h-full shrink-0">
          <DesktopSidebar />
        </div>
      )}

      {/* Sidebar mobile — drawer */}
      {!hideSidebar && (
        <>
          <div
            className={tailwind(
              'fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-200',
              isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
            )}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className={tailwind(
            'fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}>
            <DesktopSidebar />
          </div>
        </>
      )}

      {/* Contenido principal */}
      <div className={tailwind(
        'flex flex-col flex-1 h-full min-w-0',
        !hideSidebar && 'md:border-l border-neutral-200 dark:border-neutral-800',
      )}>

        {/* Header admin */}
        <header className="h-16 border-b border-neutral-100 bg-white sticky top-0 z-30 flex items-center px-4 md:px-6 justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburguesa mobile */}
            {!hideSidebar && (
              <button
                className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors shrink-0"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu size={20} className="text-neutral-600" />
              </button>
            )}
            {/* Volver */}
            {hasBackButton && backNavigationHandler && (
              <button
                onClick={backNavigationHandler}
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors shrink-0"
              >
                <ChevronLeft size={20} className="text-neutral-500" />
              </button>
            )}
            {/* Título */}
            {pageTitle && (
              <Typography
                variant={TypographyVariant.BODY_SEMIBOLD}
                className="truncate text-sm md:text-base"
              >
                {pageTitle}
              </Typography>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-50 transition-colors group shrink-0"
            title="Cerrar sesión"
          >
            <LogOut size={18} className="text-neutral-400 group-hover:text-red-500 transition-colors" />
          </button>
        </header>

        <DashboardLayoutContent
          contentClassNames={tailwind(contentClassNames, bottomPadding)}
          onScroll={onScroll}
          contentStyle={contentStyle}
          boxClassName={boxClassName}
        >
          {renderedChildren}
        </DashboardLayoutContent>
      </div>

      {/* Bottom nav — solo mobile */}
      {!hideSidebar && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-100 safe-area-inset-bottom">
          <div className="flex items-stretch h-16">
            {NAVIGATION_PATHS.slice(0, 5).map((item) => {
              const isActive = router.pathname.startsWith(item.route);
              const Icon = item.icon;
              return (
                <Link
                  key={item.menuKey}
                  href={item.route}
                  className={tailwind(
                    'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors text-[10px] font-semibold',
                    isActive ? 'text-accent' : 'text-neutral-400',
                  )}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="truncate max-w-[56px] text-center leading-tight">
                    {item.labelKey.split(' ')[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
