import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenFromRequest } from '@/shared/api/api-auth';

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const bearerToken = getTokenFromRequest(request);
  if (!bearerToken) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  return response.status(200).json({ data: [], total: 0, pageNumber: 1, pageLimit: 10 });
}
