import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartQuery } from '@/shared/api/querys/cart/use-cart-query';
import { useRemoveCartItemMutation } from '@/shared/api/mutations/cart/use-remove-cart-item-mutation';
import { useUpdateCartItemMutation } from '@/shared/api/mutations/cart/use-update-cart-item-mutation';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { CART_QUERY_KEY } from '@/shared/api/querys/cart/use-cart-query';
import { useNavigation } from '@/hooks/use-navigation';
import { CartItem } from '@/types/cart/cart.types';

export function useCart() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: cart, isLoading, isError } = useCartQuery();
  const { executeRemoveItem, isPending: isRemoving } = useRemoveCartItemMutation();
  const { executeUpdateItem, isPending: isUpdating } = useUpdateCartItemMutation();

  const { mutate: executeClearCart, isPending: isClearing } = useMutation({
    mutationKey: ['cart-clear'],
    mutationFn: () => ApiServiceClient(CATALOG_API_URL).delete('/cart'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] }),
  });

  const cartItems = cart?.items ?? [];

  const cartTotal = cartItems.reduce(
    (accumulator, cartItem) => accumulator + cartItem.unit_price * cartItem.quantity,
    0,
  );

  const handleIncreaseQuantity = (cartItem: CartItem) =>
    executeUpdateItem({ cartItemId: cartItem.id, quantity: cartItem.quantity + 1 });

  const handleDecreaseQuantity = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      executeUpdateItem({ cartItemId: cartItem.id, quantity: cartItem.quantity - 1 });
    } else {
      executeRemoveItem(cartItem.id);
    }
  };

  const handleRemoveItem = (cartItemId: number) => executeRemoveItem(cartItemId);

  const handleClearCart = () => executeClearCart();

  const handleCheckout = () => navigation.client.checkout();

  const handleGoToCatalog = () => navigation.client.catalog();

  return {
    cartItems,
    cartTotal,
    isLoading,
    isError,
    isMutating: isRemoving || isUpdating || isClearing,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
    handleCheckout,
    handleGoToCatalog,
  };
}
