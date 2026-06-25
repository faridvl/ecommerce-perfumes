import type { NextApiRequest, NextApiResponse } from 'next';
import { OrdersService } from '@/shared/api/services/orders.service';
import { AuthService } from '@/shared/api/services/auth.service';
import { getTokenFromRequest, getCartSessionId } from '@/shared/api/api-auth';
import { OrderStatus } from '@/types/order/order.types';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id: orderUuid } = request.query;
  if (typeof orderUuid !== 'string') {
    return response.status(400).json({ message: 'ID de orden inválido' });
  }

  if (request.method === 'GET') {
    const bearerToken = getTokenFromRequest(request);
    const sessionId = getCartSessionId(request);

    if (!bearerToken && !sessionId) {
      return response.status(401).json({ message: 'No autorizado' });
    }

    try {
      // Admin con token: acceso completo
      if (bearerToken) {
        AuthService.verifyToken(bearerToken);
        const order = await OrdersService.getByUuid(orderUuid);
        return response.status(200).json(order);
      }

      // Cliente con session_id: solo su propia orden
      const order = await OrdersService.getByUuidAndSession(orderUuid, sessionId!);
      return response.status(200).json(order);
    } catch (error: any) {
      return response.status(404).json({ message: error.message });
    }
  }

  if (request.method === 'PUT') {
    const bearerToken = getTokenFromRequest(request);
    if (!bearerToken) {
      return response.status(401).json({ message: 'No autorizado' });
    }

    try {
      AuthService.verifyToken(bearerToken);
    } catch {
      return response.status(401).json({ message: 'Token inválido' });
    }

    const { status } = request.body;
    if (!status) {
      return response.status(400).json({ message: 'Estado requerido' });
    }

    try {
      const updatedOrder = await OrdersService.updateStatus(orderUuid, status as OrderStatus);
      return response.status(200).json(updatedOrder);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  return response.status(405).json({ message: 'Método no permitido' });
}
