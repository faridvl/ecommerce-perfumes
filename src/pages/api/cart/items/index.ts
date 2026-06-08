import type { NextApiRequest, NextApiResponse } from 'next';
import { CartService } from '@/shared/api/services/cart.service';
import { getCartSessionId } from '@/shared/api/api-auth';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  const sessionId = getCartSessionId(request);
  if (!sessionId) {
    return response.status(400).json({ message: 'Sesión de carrito no encontrada' });
  }

  try {
    const updatedCart = await CartService.addItem(sessionId, request.body);
    return response.status(201).json(updatedCart);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
}
