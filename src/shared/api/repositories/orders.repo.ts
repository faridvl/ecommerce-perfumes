import sql from '@/lib/db';
import { Order, OrderStatus, CreateOrderInput, PaginatedOrders } from '@/types/order/order.types';

function mapRowToOrder(row: any): Order {
  return {
    ...row,
    total_amount: Number(row.total_amount),
    items: (row.items ?? []).map((orderItem: any) => ({
      ...orderItem,
      unit_price: Number(orderItem.unit_price),
    })),
  };
}

const ORDER_SELECT = sql`
  SELECT
    orders.id,
    orders.uuid,
    orders.session_id,
    orders.customer_name,
    orders.customer_whatsapp,
    orders.customer_address,
    orders.status,
    orders.total_amount,
    orders.created_at,
    COALESCE(
      json_agg(jsonb_build_object(
        'id',             orderItem.id,
        'order_id',       orderItem.order_id,
        'product_name',   orderItem.product_name,
        'variant_detail', orderItem.variant_detail,
        'quantity',       orderItem.quantity,
        'unit_price',     orderItem.unit_price
      )) FILTER (WHERE orderItem.id IS NOT NULL), '[]'
    ) AS items
  FROM orders
  LEFT JOIN order_items orderItem ON orderItem.order_id = orders.id
`;

export const OrdersRepo = {
  create: async (input: CreateOrderInput): Promise<Order> => {
    const [createdOrder] = await sql`
      INSERT INTO orders (session_id, customer_name, customer_whatsapp, customer_address, total_amount)
      VALUES (
        ${input.session_id},
        ${input.customer_name},
        ${input.customer_whatsapp},
        ${input.customer_address},
        ${input.total_amount}
      )
      RETURNING *
    `;

    for (const orderItem of input.items) {
      await sql`
        INSERT INTO order_items (order_id, product_name, variant_detail, quantity, unit_price)
        VALUES (
          ${createdOrder.id},
          ${orderItem.product_name},
          ${orderItem.variant_detail},
          ${orderItem.quantity},
          ${orderItem.unit_price}
        )
      `;
    }

    return OrdersRepo.findByUuid(createdOrder.uuid) as Promise<Order>;
  },

  findAll: async ({
    pageNumber,
    pageLimit,
    status,
  }: {
    pageNumber: number;
    pageLimit: number;
    status?: OrderStatus;
  }): Promise<PaginatedOrders> => {
    const offset = (pageNumber - 1) * pageLimit;

    const [countResult] = await sql`
      SELECT COUNT(*)::int AS total
      FROM orders
      WHERE (${status ?? null}::text IS NULL OR orders.status = ${status ?? null}::text)
    `;

    const orderRows = await sql`
      ${ORDER_SELECT}
      WHERE (${status ?? null}::text IS NULL OR orders.status = ${status ?? null}::text)
      GROUP BY orders.id
      ORDER BY orders.created_at DESC
      LIMIT ${pageLimit} OFFSET ${offset}
    `;

    return {
      data: orderRows.map(mapRowToOrder),
      total: countResult.total,
      pageNumber,
      pageLimit,
    };
  },

  findByUuid: async (orderUuid: string): Promise<Order | null> => {
    const orderRows = await sql`
      ${ORDER_SELECT}
      WHERE orders.uuid = ${orderUuid}
      GROUP BY orders.id
      LIMIT 1
    `;

    return orderRows[0] ? mapRowToOrder(orderRows[0]) : null;
  },

  findByUuidAndSession: async (orderUuid: string, sessionId: string): Promise<Order | null> => {
    const orderRows = await sql`
      ${ORDER_SELECT}
      WHERE orders.uuid = ${orderUuid} AND orders.session_id = ${sessionId}
      GROUP BY orders.id
      LIMIT 1
    `;

    return orderRows[0] ? mapRowToOrder(orderRows[0]) : null;
  },

  updateStatus: async (orderUuid: string, newStatus: OrderStatus): Promise<Order | null> => {
    await sql`UPDATE orders SET status = ${newStatus} WHERE uuid = ${orderUuid}`;
    return OrdersRepo.findByUuid(orderUuid);
  },
};
