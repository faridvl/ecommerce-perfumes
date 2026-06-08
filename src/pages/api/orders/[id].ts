import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenFromRequest } from '@/shared/api/api-auth';

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  const bearerToken = getTokenFromRequest(request);
  if (!bearerToken) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  if (request.method === 'GET' || request.method === 'PUT') {
    return response.status(404).json({ message: 'Order not found' });
  }

  return response.status(405).json({ message: 'Method not allowed' });
}
