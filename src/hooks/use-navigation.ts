import { useRouter } from 'next/router';
import { routesPublic, routesPrivate } from '@/shared/navigation/routes';

export const useNavigation = () => {
  const router = useRouter();

  return {
    client: {
      home: () => router.push(routesPublic.home),
      catalog: () => router.push(routesPublic.catalog),
      productDetail: (slug: string) => router.push(routesPublic.productDetail(slug)),
      cart: () => router.push(routesPublic.cart),
      checkout: () => router.push(routesPublic.checkout),
      checkoutSuccess: (orderId: string) => router.push(routesPublic.checkoutSuccess(orderId)),
    },
    auth: {
      login: () => router.push(routesPublic.login),
      register: () => router.push(routesPublic.register),
    },
    admin: {
      dashboard: () => router.push(routesPrivate.admin.dashboard),
      inventory: {
        index: () => router.push(routesPrivate.admin.inventory.index),
        create: () => router.push(routesPrivate.admin.inventory.create),
        edit: (productUuid: string) =>
          router.push(routesPrivate.admin.inventory.edit(productUuid)),
      },
      sales: {
        index: () => router.push(routesPrivate.admin.sales.index),
        detail: (orderId: string) => router.push(routesPrivate.admin.sales.detail(orderId)),
      },
      customers: {
        index: () => router.push(routesPrivate.admin.customers.index),
      },
    },
    back: () => router.back(),
  };
};
