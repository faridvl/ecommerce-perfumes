import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';
import { CartContainer } from '@/components/containers/cart/cart-container';

const CartPage = () => (
  <StoreLayout title="Mi Carrito">
    <CartContainer />
  </StoreLayout>
);

export default CartPage;
