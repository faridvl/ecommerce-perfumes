import React from 'react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';

const SalesPage = () => {
    return (
        <DashboardLayout title="Ventas y Pedidos">
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase">ID Pedido</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase">Cliente</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {[1024, 1025].map((id) => (
                            <tr key={id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-primary">#SS-{id}</td>
                                <td className="px-6 py-4">Cliente Mock {id}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold rounded-full uppercase">Completado</span>
                                </td>
                                <td className="px-6 py-4 font-bold">$2,400.00</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

// export const getServerSideProps = authorizeServerSidePage();
export default SalesPage;