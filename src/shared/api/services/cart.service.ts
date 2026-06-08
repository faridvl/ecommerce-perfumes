import { CartRepo } from '@/shared/api/repositories/cart.repo';
import { CartItemInput } from '@/types/cart/cart.types';

export const CartService = {
  getCart: (sessionId: string) =>
    CartRepo.findBySessionId(sessionId),

  addItem: (sessionId: string, cartItemInput: CartItemInput) =>
    CartRepo.addItem(sessionId, cartItemInput),

  updateItemQuantity: async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) throw new Error('La cantidad debe ser mayor a cero');
    return CartRepo.updateItemQuantity(cartItemId, newQuantity);
  },

  removeItem: (cartItemId: number) =>
    CartRepo.removeItem(cartItemId),

  clearCart: (sessionId: string) =>
    CartRepo.clearCart(sessionId),
};
