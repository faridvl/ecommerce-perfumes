import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';
import { CheckoutContainer } from '@/components/containers/checkout/checkout-container';

const CheckoutPage = () => (
  <StoreLayout title="Finalizar Compra">
    <CheckoutContainer />
  </StoreLayout>
);

export default CheckoutPage;
