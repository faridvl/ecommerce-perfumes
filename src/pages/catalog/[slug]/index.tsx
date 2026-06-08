import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';
import { ProductDetailContainer } from '@/components/containers/catalog/product-detail/product-detail-container';

const ProductDetailPage = () => (
  <StoreLayout title="Detalle de Perfume">
    <ProductDetailContainer />
  </StoreLayout>
);

export default ProductDetailPage;
