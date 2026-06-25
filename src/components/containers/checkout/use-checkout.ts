import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { ApiServiceClient } from '@/shared/api/api-service-client';
import { CATALOG_API_URL } from '@/shared/api/config';
import { useCartQuery } from '@/shared/api/querys/cart/use-cart-query';
import { useNavigation } from '@/hooks/use-navigation';
import { TEXT } from '@/static/texts/i18n';
import { Order } from '@/types/order/order.types';

export interface CheckoutFormValues {
  customer_name: string;
  customer_whatsapp: string;
  customer_address: string;
}

export function useCheckout() {
  const { t } = useTranslation();
  const { client } = useNavigation();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();

  const checkoutSchema = useMemo(
    () =>
      yup.object({
        customer_name: yup.string().required(t(TEXT.CHECKOUT.VALIDATION_NAME_REQUIRED)),
        customer_whatsapp: yup.string().required(t(TEXT.CHECKOUT.VALIDATION_WHATSAPP_REQUIRED)),
        customer_address: yup.string().required(t(TEXT.CHECKOUT.VALIDATION_ADDRESS_REQUIRED)),
      }),
    [t],
  );

  const form = useForm<CheckoutFormValues>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: { customer_name: '', customer_whatsapp: '', customer_address: '' },
  });

  const { mutate: executeCreateOrder, isPending, error } = useMutation({
    mutationKey: ['create-order'],
    mutationFn: (formValues: CheckoutFormValues) =>
      ApiServiceClient(CATALOG_API_URL).post<Order>('/orders', formValues),
    onSuccess: (createdOrder: Order) => {
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
