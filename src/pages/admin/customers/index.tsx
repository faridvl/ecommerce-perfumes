import React from 'react';
import { Users } from 'lucide-react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useCustomersQuery } from '@/shared/api/querys/admin/use-customers-query';

const CustomersPage = () => {
  const { data: customers = [], isLoading, isError } = useCustomersQuery();

  return (
    <DashboardLayout title="Directorio de Clientes">
      <div className="flex flex-col gap-6">

        {/* Stats rápido */}
        {!isLoading && !isError && customers.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-wide text-[10px] font-bold mb-1">
                Clientes únicos
              </Typography>
              <Typography variant={TypographyVariant.HEADER} className="text-2xl">
                {customers.length}
              </Typography>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-wide text-[10px] font-bold mb-1">
                Total pedidos
              </Typography>
              <Typography variant={TypographyVariant.HEADER} className="text-2xl">
                {customers.reduce((sum, c) => sum + c.order_count, 0)}
              </Typography>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm col-span-2 sm:col-span-1">
              <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-wide text-[10px] font-bold mb-1">
                Revenue total
              </Typography>
              <Typography variant={TypographyVariant.HEADER} className="text-2xl text-accent">
                ${customers.reduce((sum, c) => sum + Number(c.total_spent), 0).toLocaleString('es-CR')}
              </Typography>
            </div>
          </div>
        )}

        {/* Tabla desktop / Cards mobile */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">

          {isLoading && (
            <div className="p-6 flex flex-col gap-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-neutral-100 rounded-xl" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-10 text-center">
              <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
                Error al cargar clientes.
              </Typography>
            </div>
          )}

          {!isLoading && !isError && customers.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center gap-3">
              <Users size={40} className="text-neutral-200" />
              <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
                Aún no hay clientes registrados.
              </Typography>
            </div>
          )}

          {!isLoading && !isError && customers.length > 0 && (
            <>
              {/* Tabla — solo desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100">
                    <tr>
                      {['Cliente', 'WhatsApp', 'Pedidos', 'Total gastado', 'Último pedido'].map((col) => (
                        <th key={col} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {customers.map((customer) => (
                      <tr
                        key={`${customer.customer_name}-${customer.customer_whatsapp}`}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-xs flex items-center justify-center shrink-0">
                              {customer.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm">
                              {customer.customer_name}
                            </Typography>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-500" className="font-mono">
                            {customer.customer_whatsapp}
                          </Typography>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-600">
                            {customer.order_count}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Typography variant={TypographyVariant.BODY_SEMIBOLD} textColor="text-accent">
                            ${Number(customer.total_spent).toLocaleString('es-CR')}
                          </Typography>
                        </td>
                        <td className="px-6 py-4">
                          <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                            {new Date(customer.last_order_at).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards — solo mobile */}
              <div className="md:hidden divide-y divide-neutral-50">
                {customers.map((customer) => (
                  <div
                    key={`${customer.customer_name}-${customer.customer_whatsapp}`}
                    className="p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center shrink-0">
                          {customer.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm leading-tight">
                            {customer.customer_name}
                          </Typography>
                          <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="font-mono text-xs">
                            {customer.customer_whatsapp}
                          </Typography>
                        </div>
                      </div>
                      <Typography variant={TypographyVariant.BODY_SEMIBOLD} textColor="text-accent">
                        ${Number(customer.total_spent).toLocaleString('es-CR')}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-3 pl-12">
                      <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-600">
                        {customer.order_count} pedido{customer.order_count !== 1 ? 's' : ''}
                      </span>
                      <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="text-xs">
                        {new Date(customer.last_order_at).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default CustomersPage;
