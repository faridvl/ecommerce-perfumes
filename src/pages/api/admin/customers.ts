import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokenFromRequest } from '@/shared/api/api-auth';
import sql from '@/lib/db';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  const token = getTokenFromRequest(request);
  if (!token) {
    return response.status(401).json({ message: 'No autorizado' });
  }

  try {
    const customers = await sql`
      SELECT
        customer_name,
        customer_whatsapp,
        COUNT(*)::int          AS order_count,
        SUM(total_amount)::numeric AS total_spent,
        MAX(created_at)        AS last_order_at
      FROM orders
      GROUP BY customer_name, customer_whatsapp
      ORDER BY last_order_at DESC
    `;

    return response.status(200).json(customers);
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
}
