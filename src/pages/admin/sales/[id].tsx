import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { SalesDetailContainer } from '@/components/containers/admin/sales/detail/sales-detail-container';
import { authorizeServerSidePage } from '@/hocs/auth';

const SalesDetailPage = () => (
  <DashboardLayout title="Detalle del Pedido" isMainPage={false}>
    <SalesDetailContainer />
  </DashboardLayout>
);

export const getServerSideProps = authorizeServerSidePage();
export default SalesDetailPage;
