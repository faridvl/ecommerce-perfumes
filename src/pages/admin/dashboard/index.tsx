import React from 'react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

const AdminDashboard = () => {
    return (
        <DashboardLayout title="Panel de Control">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Ventas de hoy', value: '$12,400', color: 'text-success' },
                    { label: 'Pedidos pendientes', value: '8', color: 'text-warning' },
                    { label: 'Stock bajo', value: '3 items', color: 'text-danger' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <Typography variant={TypographyVariant.HELPER}>{stat.label}</Typography>
                        <Typography variant={TypographyVariant.HEADER} className={stat.color}>{stat.value}</Typography>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-white p-8 rounded-2xl border border-neutral-100 h-96 flex items-center justify-center italic text-neutral-400">
                Gráfico de ventas mensuales (Próximamente)
            </div>
        </DashboardLayout>
    );
};

// export const getServerSideProps = authorizeServerSidePage();
export default AdminDashboard;