import type { NextApiRequest, NextApiResponse } from 'next';
import { CartService } from '@/shared/api/services/cart.service';
import { getCartSessionId } from '@/shared/api/api-auth';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const sessionId = getCartSessionId(request);

  if (!sessionId) {
    return response.status(200).json({ items: [] });
  }

  if (request.method === 'GET') {
    try {
      const cart = await CartService.getCart(sessionId);
      return response.status(200).json(cart ?? { items: [] });
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  if (request.method === 'DELETE') {
    try {
      await CartService.clearCart(sessionId);
      return response.status(204).end();
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  return response.status(405).json({ message: 'Método no permitido' });
}
