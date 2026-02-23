import React from 'react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

const CustomersPage = () => {
    return (
        <DashboardLayout title="Directorio de Clientes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                        <Typography variant={TypographyVariant.OVERLINE} className="mb-1">Cliente VIP</Typography>
                        <Typography variant={TypographyVariant.SUBTITLE} className="mb-2 text-lg">Nombre del Cliente {i}</Typography>
                        <Typography variant={TypographyVariant.HELPER} className="mb-4 italic">cliente{i}@email.com</Typography>
                        <div className="pt-4 border-t border-neutral-50 dark:border-neutral-800">
                            <Typography variant={TypographyVariant.LINK_TEXT} className="text-xs">Ver historial de compras</Typography>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

// export const getServerSideProps = authorizeServerSidePage();
export default CustomersPage;