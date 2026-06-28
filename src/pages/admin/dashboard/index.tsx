import React from 'react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { useDashboardStatsQuery } from '@/shared/api/querys/admin/use-dashboard-stats-query';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendiente',  color: 'text-yellow-600 bg-yellow-50' },
  confirmed: { label: 'Confirmado', color: 'text-blue-600 bg-blue-50' },
  shipped:   { label: 'Enviado',    color: 'text-purple-600 bg-purple-50' },
  delivered: { label: 'Entregado',  color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelado',  color: 'text-red-600 bg-red-50' },
};

const AdminDashboard = () => {
  const { data: stats, isLoading } = useDashboardStatsQuery();

  const statCards = [
    {
      label: 'Ventas de hoy',
      value: isLoading ? '—' : `$${Number(stats?.salesToday ?? 0).toLocaleString('es-CR')}`,
      color: 'text-green-600',
    },
    {
      label: 'Pedidos pendientes',
      value: isLoading ? '—' : String(stats?.pendingOrders ?? 0),
      color: 'text-yellow-600',
    },
    {
      label: 'Variantes con stock bajo',
      value: isLoading ? '—' : String(stats?.lowStockCount ?? 0),
      color: 'text-red-500',
    },
  ];

  return (
    <DashboardLayout title="Panel de Control">
      <div className="flex flex-col gap-8">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <Typography variant={TypographyVariant.HELPER} className="mb-1">{stat.label}</Typography>
              <Typography variant={TypographyVariant.HEADER} className={stat.color}>
                {stat.value}
              </Typography>
            </div>
          ))}
        </div>

        {/* Últimos pedidos */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-50">
            <Typography variant={TypographyVariant.SUBTITLE}>Últimos pedidos</Typography>
          </div>
          {isLoading ? (
            <div className="p-4 flex flex-col gap-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-neutral-100 rounded-xl" />
              ))}
            </div>
          ) : (stats?.recentOrders ?? []).length === 0 ? (
            <div className="px-6 py-8 text-center text-neutral-400 italic text-sm">
              Aún no hay pedidos.
            </div>
          ) : (
            <>
              {/* Cards — mobile */}
              <div className="md:hidden divide-y divide-neutral-50">
                {stats?.recentOrders.map((order) => {
                  const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: 'text-neutral-500 bg-neutral-100' };
                  return (
                    <div key={order.id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs text-neutral-400">#{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm truncate">{order.customer_name}</Typography>
                      </div>
                      <div className="text-right shrink-0">
                        <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-primary" className="text-sm">
                          ${Number(order.total_amount).toLocaleString('es-CR')}
                        </Typography>
                        <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="text-[11px]">
                          {new Date(order.created_at).toLocaleDateString('es-CR')}
                        </Typography>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tabla — desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">Pedido</th>
                      <th className="px-6 py-3 text-left">Cliente</th>
                      <th className="px-6 py-3 text-left">Estado</th>
                      <th className="px-6 py-3 text-right">Total</th>
                      <th className="px-6 py-3 text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {stats?.recentOrders.map((order) => {
                      const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: 'text-neutral-500 bg-neutral-100' };
                      return (
                        <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3 font-mono text-xs text-neutral-500">#{order.id}</td>
                          <td className="px-6 py-3 font-medium">{order.customer_name}</td>
                          <td className="px-6 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>{statusInfo.label}</span></td>
                          <td className="px-6 py-3 text-right font-semibold">${Number(order.total_amount).toLocaleString('es-CR')}</td>
                          <td className="px-6 py-3 text-neutral-400 text-xs">{new Date(order.created_at).toLocaleDateString('es-CR')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps = authorizeServerSidePage();
export default AdminDashboard;
