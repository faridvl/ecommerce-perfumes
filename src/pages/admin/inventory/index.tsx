import React from 'react';
import { authorizeServerSidePage } from '@/hocs/auth';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { useNavigation } from '@/hooks/use-navigation';
import { Button, ButtonVariant } from '@/components/common/button/button';

const InventoryList = () => {
    const { admin } = useNavigation();

    return (
        <DashboardLayout title="Inventario">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Gestión de Stock</h2>
                <Button
                    variant={ButtonVariant.PRIMARY}
                    text="+ Nuevo Perfume"
                    onClick={() => admin.inventory.create()}
                />
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-neutral-500">Producto</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-neutral-500">Stock</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-neutral-500">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-neutral-500">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        <tr>
                            <td className="px-6 py-4 font-medium">Midnight Oud</td>
                            <td className="px-6 py-4 text-neutral-600">45 unidades</td>
                            <td className="px-6 py-4 font-bold text-primary">$1,200</td>
                            <td className="px-6 py-4">
                                <Button variant={ButtonVariant.CANCEL} text="Editar" onClick={() => admin.inventory.edit('1')} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

// export const getServerSideProps = authorizeServerSidePage();
export default InventoryList;