import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/shared/api/services/auth.service';
import { getTokenFromRequest } from '@/shared/api/api-auth';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  const bearerToken = getTokenFromRequest(request);
  if (!bearerToken) {
    return response.status(401).json({ message: 'No autorizado' });
  }

  try {
    const authenticatedUser = await AuthService.getUserFromToken(bearerToken);
    return response.status(200).json(authenticatedUser);
  } catch {
    return response.status(401).json({ message: 'Token inválido o sesión expirada' });
  }
}
