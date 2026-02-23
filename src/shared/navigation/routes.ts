export const routesPublic = {
  home: '/',
  login: '/login',
  register: '/register',
  catalog: '/catalog',
  productDetail: (slug: string) => `/catalog/${slug}`,
  cart: '/cart',
  checkout: '/checkout',
  orderSuccess: (id: string) => `/checkout/success/${id}`,
};

export const routesPrivate = {
  // Sección Cliente
  profile: '/profile',
  myOrders: '/orders',
  orderDetail: (id: string | number) => `/orders/${id}`,

  // Sección Admin (Backoffice)
  dashboard: '/admin/dashboard',
  inventory: {
    index: '/admin/inventory',
    create: '/admin/inventory/create',
    edit: (id: string | number) => `/admin/inventory/edit/${id}`,
  },
  sales: {
    index: '/admin/sales',
    detail: (id: string | number) => `/admin/sales/${id}`,
  },
  customers: {
    index: '/admin/customers',
    detail: (id: string | number) => `/admin/customers/${id}`,
  },
  settings: '/admin/settings',
};
