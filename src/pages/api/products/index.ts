import type { NextApiRequest, NextApiResponse } from 'next';
import { ProductsService } from '@/shared/api/services/products.service';
import { getTokenFromRequest } from '@/shared/api/api-auth';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    try {
      const {
        page: pageParam = '1',
        limit: limitParam = '10',
        search,
        brand,
      } = request.query;

      const paginatedProducts = await ProductsService.list({
        pageNumber: Number(pageParam),
        pageLimit: Number(limitParam),
        search: search as string | undefined,
        brand: brand as string | undefined,
      });

      return response.status(200).json(paginatedProducts);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  if (request.method === 'POST') {
    const bearerToken = getTokenFromRequest(request);
    if (!bearerToken) {
      return response.status(401).json({ message: 'No autorizado' });
    }

    try {
      const createdProduct = await ProductsService.create(request.body);
      return response.status(201).json(createdProduct);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  return response.status(405).json({ message: 'Método no permitido' });
}
