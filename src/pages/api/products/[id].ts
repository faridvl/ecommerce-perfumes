import type { NextApiRequest, NextApiResponse } from 'next';
import { ProductsService } from '@/shared/api/services/products.service';
import { getTokenFromRequest } from '@/shared/api/api-auth';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { id: productUuid } = request.query;

  if (!productUuid || typeof productUuid !== 'string') {
    return response.status(400).json({ message: 'UUID de producto inválido' });
  }

  if (request.method === 'GET') {
    try {
      const product = await ProductsService.getByUuid(productUuid);
      return response.status(200).json(product);
    } catch (error: any) {
      const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
      return response.status(statusCode).json({ message: error.message });
    }
  }

  const bearerToken = getTokenFromRequest(request);
  if (!bearerToken) {
    return response.status(401).json({ message: 'No autorizado' });
  }

  if (request.method === 'PUT') {
    try {
      const updatedProduct = await ProductsService.update(productUuid, request.body);
      return response.status(200).json(updatedProduct);
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  if (request.method === 'DELETE') {
    try {
      await ProductsService.delete(productUuid);
      return response.status(204).end();
    } catch (error: any) {
      return response.status(500).json({ message: error.message });
    }
  }

  return response.status(405).json({ message: 'Método no permitido' });
}
