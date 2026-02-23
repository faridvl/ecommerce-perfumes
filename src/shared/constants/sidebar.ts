// import { INavigationPath } from '@/types/system/navigation-path';
import { routesPrivate } from '../navigation/routes';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  PlusCircle,
  Truck,
} from 'lucide-react';

export const NAVIGATION_PATHS: any[] = [
  {
    menuKey: 'dashboard',
    default: false,
    icon: LayoutDashboard,
    labelKey: 'Panel General',
    route: routesPrivate.dashboard,
  },
  {
    menuKey: 'inventory',
    default: true,
    icon: Package,
    labelKey: 'Inventario',
    route: routesPrivate.inventory.index,
  },
  {
    menuKey: 'sales',
    default: false,
    icon: ShoppingCart,
    labelKey: 'Ventas y Pedidos',
    route: routesPrivate.sales.index,
  },
  {
    menuKey: 'customers',
    default: false,
    icon: Users,
    labelKey: 'Clientes',
    route: routesPrivate.customers.index,
  },
  {
    menuKey: 'settings',
    default: false,
    icon: Settings,
    labelKey: 'Configuración',
    route: routesPrivate.settings,
  },
];
