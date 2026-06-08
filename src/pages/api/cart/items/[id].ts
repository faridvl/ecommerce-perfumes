import type { NextApiRequest, NextApiResponse } from 'next';
import { CartService } from '@/shared/api/services/cart.service';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id: cartItemIdParam } = request.query;

  if (!cartItemIdParam || typeof cartItemIdParam !== 'string' || isNaN(Number(cartItemIdParam))) {
    return response.status(400).json({ message: 'ID de item inválido' });
  }

  const cartItemId = Number(cartItemIdParam);

  if (request.method === 'PUT') {
    try {
      const { quantity } = request.body;
      const updatedCartItem = await CartService.updateItemQuantity(cartItemId, quantity);
      return response.status(200).json(updatedCartItem);
    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }

  if (request.method === 'DELETE') {
    try {
      await CartService.removeItem(cartItemId);
      return response.status(204).end();
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  return response.status(405).json({ message: 'Método no permitido' });
}
