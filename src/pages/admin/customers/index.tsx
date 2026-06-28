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

        {/* Stats */}
        {!isLoading && !isError && customers.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
              <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-wide text-[10px] font-bold mb-1 block">
                Clientes
              </Typography>
              <Typography variant={TypographyVariant.HEADER} className="text-2xl">
                {customers.length}
              </Typography>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
              <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-wide text-[10px] font-bold mb-1 block">
                Pedidos
              </Typography>
              <Typography variant={TypographyVariant.HEADER} className="text-2xl">
                {customers.reduce((sum, c) => sum + c.order_count, 0)}
              </Typography>
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
              <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-wide text-[10px] font-bold mb-1 block">
                Revenue
              </Typography>
              <Typography variant={TypographyVariant.HEADER} className="text-2xl text-accent">
                ${customers.reduce((sum, c) => sum + Number(c.total_spent), 0).toLocaleString('es-CR')}
              </Typography>
            </div>
          </div>
        )}

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-px bg-neutral-100" />
                <div className="flex justify-between">
                  <div className="h-3 bg-neutral-200 rounded w-1/3" />
                  <div className="h-3 bg-neutral-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-10 text-center">
            <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
              Error al cargar clientes.
            </Typography>
          </div>
        )}

        {!isLoading && !isError && customers.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-16 text-center flex flex-col items-center gap-3">
            <Users size={40} className="text-neutral-200" />
            <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
              Aún no hay clientes registrados.
            </Typography>
          </div>
        )}

        {/* Cards grid */}
        {!isLoading && !isError && customers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <a
                key={`${customer.customer_name}-${customer.customer_whatsapp}`}
                href={`https://wa.me/${customer.customer_whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-neutral-100 p-5 hover:border-accent/30 hover:shadow-md transition-all flex flex-col gap-4"
              >
                {/* Avatar + nombre */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent/10 text-accent font-black text-base flex items-center justify-center shrink-0">
                    {customer.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm leading-tight truncate">
                      {customer.customer_name}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="font-mono">
                      {customer.customer_whatsapp}
                    </Typography>
                  </div>
                </div>

                <div className="h-px bg-neutral-50" />

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-accent" className="text-base leading-none">
                      ${Number(customer.total_spent).toLocaleString('es-CR')}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="text-[10px] mt-0.5">
                      total gastado
                    </Typography>
                  </div>
                  <div>
                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-base leading-none text-center">
                      {customer.order_count}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="text-[10px] mt-0.5">
                      pedido{customer.order_count !== 1 ? 's' : ''}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-600" className="text-xs font-semibold leading-none">
                      {new Date(customer.last_order_at).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                    </Typography>
                    <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="text-[10px] mt-0.5">
                      último pedido
                    </Typography>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default CustomersPage;
