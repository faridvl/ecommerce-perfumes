import type { NextApiRequest, NextApiResponse } from 'next';
import { ProductsRepo } from '@/shared/api/repositories/products.repo';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const brands = await ProductsRepo.findAll_brands();
    return response.status(200).json(brands);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
}
