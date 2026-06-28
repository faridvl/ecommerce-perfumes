export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  product_name: string;
  variant_detail: string;
  image_url: string | null;
}

export interface Cart {
  id: number;
  uuid: string;
  session_id: string;
  customer_id: string | null;
  items: CartItem[];
  created_at: string;
}

export interface CartItemInput {
  product_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
}
