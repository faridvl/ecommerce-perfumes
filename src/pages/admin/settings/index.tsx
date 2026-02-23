// pages/admin/settings.tsx
import { Button, ButtonVariant } from '@/components/common/button/button';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';

const SettingsPage = () => (
    <DashboardLayout title="Configuración del Sistema">
        <div className="max-w-2xl bg-white p-8 rounded-3xl border border-neutral-100">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2">Nombre de la Tienda</label>
                    <input className="w-full p-3 border rounded-xl" defaultValue="ScentStack Luxury" />
                </div>
                <Button variant={ButtonVariant.PRIMARY} text="Guardar Cambios" />
            </div>
        </div>
    </DashboardLayout>
);
export default SettingsPage;