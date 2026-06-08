import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { InventoryCreateContainer } from '@/components/containers/admin/inventory/create/inventory-create-container';
import { authorizeServerSidePage } from '@/hocs/auth';

const InventoryCreatePage = () => (
  <DashboardLayout title="Nuevo Perfume" isMainPage={false}>
    <InventoryCreateContainer />
  </DashboardLayout>
);

export const getServerSideProps = authorizeServerSidePage();
export default InventoryCreatePage;
