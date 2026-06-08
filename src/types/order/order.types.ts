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
  customer_id: string | null;
  customer_email: string;
  customer_name: string;
  status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  pageNumber: number;
  pageLimit: number;
}
