export const routesPublic = {
  home: '/',
  login: '/login',
  register: '/register',
  catalog: '/catalog',
  productDetail: (slug: string) => `/catalog/${slug}`,
  cart: '/cart',
  checkout: '/checkout',
  checkoutSuccess: (orderId: string) => `/checkout/success/${orderId}`,
};

export const routesPrivate = {
  admin: {
    dashboard: '/admin/dashboard',
    inventory: {
      index: '/admin/inventory',
      create: '/admin/inventory/create',
      edit: (productUuid: string) => `/admin/inventory/edit/${productUuid}`,
    },
    sales: {
      index: '/admin/sales',
      detail: (orderId: string) => `/admin/sales/${orderId}`,
    },
    customers: {
      index: '/admin/customers',
    },
    settings: '/admin/settings',
  },
};
