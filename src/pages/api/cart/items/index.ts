import type { NextApiRequest, NextApiResponse } from 'next';
import { CartService } from '@/shared/api/services/cart.service';
import { getCartSessionId } from '@/shared/api/api-auth';
const CART_SESSION_COOKIE = 'CART_SESSION_ID';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  let sessionId = getCartSessionId(request);
  let isNewSession = false;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    isNewSession = true;
  }

  try {
    const updatedCart = await CartService.addItem(sessionId, request.body);

    if (isNewSession) {
      response.setHeader('Set-Cookie', [
        `${CART_SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
      ]);
    }

    return response.status(201).json(updatedCart);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
}
