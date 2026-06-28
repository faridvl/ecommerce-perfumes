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
    const [salesToday] = await sql`
      SELECT COALESCE(SUM(total_amount), 0)::numeric AS total
      FROM orders
      WHERE DATE(created_at AT TIME ZONE 'America/Costa_Rica') = CURRENT_DATE AT TIME ZONE 'America/Costa_Rica'
        AND status != 'cancelled'
    `;

    const [pendingOrders] = await sql`
      SELECT COUNT(*)::int AS count FROM orders WHERE status = 'pending'
    `;

    const [lowStock] = await sql`
      SELECT COUNT(*)::int AS count
      FROM product_variants
      WHERE is_active = true AND stock > 0 AND stock <= 5
    `;

    const recentOrders = await sql`
      SELECT id, uuid, customer_name, customer_whatsapp, status, total_amount, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return response.status(200).json({
      salesToday: Number(salesToday.total),
      pendingOrders: pendingOrders.count,
      lowStockCount: lowStock.count,
      recentOrders,
    });
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
}
