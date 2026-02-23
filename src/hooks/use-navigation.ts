import { useRouter } from 'next/router';
import { routesPrivate, routesPublic } from '@/shared/navigation/routes';

export const useNavigation = () => {
  const router = useRouter();

  return {
    shop: {
      home: () => router.push(routesPublic.home),
      catalog: () => router.push(routesPublic.catalog),
      product: (slug: string) => router.push(routesPublic.productDetail(slug)),
      cart: () => router.push(routesPublic.cart),
      checkout: () => router.push(routesPublic.checkout),
      checkoutSuccess: (id: string) => router.push(routesPublic.orderSuccess(id)),
    },
    auth: {
      login: () => router.push(routesPublic.login),
      register: () => router.push(routesPublic.register),
      logout: () => {
        // Aquí agregarías la lógica de borrar cookies
        router.push(routesPublic.login);
      },
    },
    admin: {
      dashboard: () => router.push(routesPrivate.dashboard),
      inventory: {
        list: () => router.push(routesPrivate.inventory.index),
        create: () => router.push(routesPrivate.inventory.create),
        edit: (id: string) => router.push(routesPrivate.inventory.edit(id)),
      },
      sales: {
        list: () => router.push(routesPrivate.sales.index),
        detail: (id: string) => router.push(routesPrivate.sales.detail(id)),
      },
    },
    back: () => router.back(),
  };
};
