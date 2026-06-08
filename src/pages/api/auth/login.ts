import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/shared/api/services/auth.service';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const loginResponse = await AuthService.login({ email, password });
    return response.status(200).json(loginResponse);
  } catch (error: any) {
    return response.status(401).json({ message: error.message });
  }
}
