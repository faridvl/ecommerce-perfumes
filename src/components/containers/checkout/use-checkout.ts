import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { useCartQuery } from '@/shared/api/querys/cart/use-cart-query';
import { useClearCartMutation } from '@/shared/api/mutations/cart/use-clear-cart-mutation';
import { useNavigation } from '@/hooks/use-navigation';
import { Order } from '@/types/order/order.types';

export interface CheckoutFormValues {
  customer_name: string;
  customer_whatsapp: string;
  customer_address: string;
}

const checkoutSchema = yup.object({
  customer_name: yup.string().required('El nombre es requerido'),
  customer_whatsapp: yup.string().required('El WhatsApp es requerido'),
  customer_address: yup.string().required('La dirección es requerida'),
});

export function useCheckout() {
  const { client } = useNavigation();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { executeClearCart } = useClearCartMutation();

  const form = useForm<CheckoutFormValues>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: { customer_name: '', customer_whatsapp: '', customer_address: '' },
  });

  const { mutate: executeCreateOrder, isPending, error } = useMutation({
    mutationKey: ['create-order'],
    mutationFn: (formValues: CheckoutFormValues) =>
      ApiServiceClient(CATALOG_API_URL).post<Order>('/orders', formValues),
    onSuccess: (createdOrder: Order) => {
      executeClearCart();
      client.checkoutSuccess(createdOrder.uuid);
    },
  });

  const cartItems = cart?.items ?? [];
  const cartTotal = cartItems.reduce(
    (accumulator, cartItem) => accumulator + cartItem.unit_price * cartItem.quantity,
    0,
  );
  const hasItems = cartItems.length > 0;

  return {
    form,
    cartItems,
    cartTotal,
    hasItems,
    isCartLoading,
    isPending,
    hasError: !!error,
    handleSubmit: form.handleSubmit((formValues) => executeCreateOrder(formValues)),
  };
}
