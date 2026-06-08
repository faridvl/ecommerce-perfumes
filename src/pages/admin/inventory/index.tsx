import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { InventoryListContainer } from '@/components/containers/admin/inventory/list/inventory-list-container';
import { authorizeServerSidePage } from '@/hocs/auth';

const InventoryPage = () => (
  <DashboardLayout title="Inventario">
    <InventoryListContainer />
  </DashboardLayout>
);

export const getServerSideProps = authorizeServerSidePage();
export default InventoryPage;
