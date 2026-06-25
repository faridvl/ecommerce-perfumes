import { CartRepo } from '@/shared/api/repositories/cart.repo';
import { OrdersRepo } from '@/shared/api/repositories/orders.repo';
import { Order, OrderStatus, PaginatedOrders } from '@/types/order/order.types';

interface CheckoutInput {
  session_id: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_address: string;
}

export const OrdersService = {
  createFromCart: async (checkoutInput: CheckoutInput): Promise<Order> => {
    const cart = await CartRepo.findBySessionId(checkoutInput.session_id);
    if (!cart || cart.items.length === 0) throw new Error('El carrito está vacío');

    const totalAmount = cart.items.reduce(
      (accumulator, cartItem) => accumulator + cartItem.unit_price * cartItem.quantity,
      0,
    );

    const createdOrder = await OrdersRepo.create({
      session_id: checkoutInput.session_id,
      customer_name: checkoutInput.customer_name,
      customer_whatsapp: checkoutInput.customer_whatsapp,
      customer_address: checkoutInput.customer_address,
      total_amount: totalAmount,
      items: cart.items.map((cartItem) => ({
        product_name: cartItem.product_name,
        variant_detail: cartItem.variant_detail,
        quantity: cartItem.quantity,
        unit_price: cartItem.unit_price,
      })),
    });

    await CartRepo.clearCart(checkoutInput.session_id);

    return createdOrder;
  },

  list: (
    pageNumber: number,
    pageLimit: number,
    status?: OrderStatus,
  ): Promise<PaginatedOrders> =>
    OrdersRepo.findAll({ pageNumber, pageLimit, status }),

  getByUuid: async (orderUuid: string): Promise<Order> => {
    const order = await OrdersRepo.findByUuid(orderUuid);
    if (!order) throw new Error('Orden no encontrada');
    return order;
  },

  getByUuidAndSession: async (orderUuid: string, sessionId: string): Promise<Order> => {
    const order = await OrdersRepo.findByUuidAndSession(orderUuid, sessionId);
    if (!order) throw new Error('Orden no encontrada');
    return order;
  },

  updateStatus: (orderUuid: string, newStatus: OrderStatus): Promise<Order | null> =>
    OrdersRepo.updateStatus(orderUuid, newStatus),
};
