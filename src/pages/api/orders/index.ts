import type { NextApiRequest, NextApiResponse } from 'next';
import { OrdersService } from '@/shared/api/services/orders.service';
import { AuthService } from '@/shared/api/services/auth.service';
import { getTokenFromRequest, getCartSessionId } from '@/shared/api/api-auth';
import { OrderStatus } from '@/types/order/order.types';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const sessionId = getCartSessionId(request);
    if (!sessionId) {
      return response.status(400).json({ message: 'Sesión de carrito requerida' });
    }

    const { customer_name, customer_whatsapp, customer_address } = request.body;
    if (!customer_name || !customer_whatsapp || !customer_address) {
      return response.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
      const createdOrder = await OrdersService.createFromCart({
        session_id: sessionId,
        customer_name,
        customer_whatsapp,
        customer_address,
      });
      return response.status(201).json(createdOrder);
    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }

  if (request.method === 'GET') {
    const bearerToken = getTokenFromRequest(request);
    if (!bearerToken) {
      return response.status(401).json({ message: 'No autorizado' });
    }

    try {
      AuthService.verifyToken(bearerToken);
    } catch {
      return response.status(401).json({ message: 'Token inválido' });
    }

    const {
      page: pageParam = '1',
      limit: limitParam = '10',
      status,
    } = request.query;

    try {
      const paginatedOrders = await OrdersService.list(
        Number(pageParam),
        Number(limitParam),
        status as OrderStatus | undefined,
      );
      return response.status(200).json(paginatedOrders);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  return response.status(405).json({ message: 'Método no permitido' });
}
