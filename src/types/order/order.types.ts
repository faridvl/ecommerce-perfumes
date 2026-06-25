export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_name: string;
  variant_detail: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  uuid: string;
  session_id: string | null;
  customer_name: string;
  customer_whatsapp: string;
  customer_address: string;
  status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export interface CreateOrderInput {
  session_id: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_address: string;
  total_amount: number;
  items: Array<{
    product_name: string;
    variant_detail: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  pageNumber: number;
  pageLimit: number;
}
