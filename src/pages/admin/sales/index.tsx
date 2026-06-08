import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { SalesListContainer } from '@/components/containers/admin/sales/list/sales-list-container';
import { authorizeServerSidePage } from '@/hocs/auth';

const SalesPage = () => (
  <DashboardLayout title="Ventas y Pedidos">
    <SalesListContainer />
  </DashboardLayout>
);

export const getServerSideProps = authorizeServerSidePage();
export default SalesPage;
