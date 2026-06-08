import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { InventoryEditContainer } from '@/components/containers/admin/inventory/edit/inventory-edit-container';
import { authorizeServerSidePage } from '@/hocs/auth';

const InventoryEditPage = () => (
  <DashboardLayout title="Editar Perfume" isMainPage={false}>
    <InventoryEditContainer />
  </DashboardLayout>
);

export const getServerSideProps = authorizeServerSidePage();
export default InventoryEditPage;
