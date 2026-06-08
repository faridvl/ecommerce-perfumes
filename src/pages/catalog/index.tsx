import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';
import { ProductListContainer } from '@/components/containers/catalog/product-list/product-list-container';

const CatalogPage = () => (
  <StoreLayout title="Catálogo Exclusivo">
    <ProductListContainer />
  </StoreLayout>
);

export default CatalogPage;
