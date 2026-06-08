import sql from '@/lib/db';
import { Cart, CartItem, CartItemInput } from '@/types/cart/cart.types';

export const CartRepo = {
  findBySessionId: async (sessionId: string): Promise<Cart | null> => {
    const cartRows = await sql`
      SELECT
        cart.id,
        cart.uuid,
        cart.session_id,
        cart.customer_id,
        cart.created_at,
        COALESCE(
          json_agg(jsonb_build_object(
            'id',             cartItem.id,
            'cart_id',        cartItem.cart_id,
            'product_id',     cartItem.product_id,
            'variant_id',     cartItem.variant_id,
            'quantity',       cartItem.quantity,
            'unit_price',     cartItem.unit_price,
            'product_name',   cartItem.product_name,
            'variant_detail', cartItem.variant_detail
          )) FILTER (WHERE cartItem.id IS NOT NULL), '[]'
        ) AS items
      FROM carts cart
      LEFT JOIN cart_items cartItem ON cartItem.cart_id = cart.id
      WHERE cart.session_id = ${sessionId}
      GROUP BY cart.id
      LIMIT 1
    `;

    return (cartRows[0] as unknown as Cart) ?? null;
  },

  findOrCreate: async (sessionId: string): Promise<Cart> => {
    const existingCart = await CartRepo.findBySessionId(sessionId);
    if (existingCart) return existingCart;

    const [createdCart] = await sql`
      INSERT INTO carts (uuid, session_id)
      VALUES (gen_random_uuid(), ${sessionId})
      RETURNING *
    `;

    return { ...createdCart, items: [] } as unknown as Cart;
  },

  addItem: async (sessionId: string, cartItemInput: CartItemInput): Promise<Cart> => {
    const cart = await CartRepo.findOrCreate(sessionId);

    const existingItemRows = await sql`
      SELECT id, quantity
      FROM cart_items
      WHERE cart_id = ${cart.id} AND variant_id = ${cartItemInput.variant_id}
      LIMIT 1
    `;

    if (existingItemRows.length > 0) {
      const existingCartItem = existingItemRows[0];
      await sql`
        UPDATE cart_items
        SET quantity = ${existingCartItem.quantity + cartItemInput.quantity}
        WHERE id = ${existingCartItem.id}
      `;
    } else {
      const variantDetailRows = await sql`
        SELECT
          product.name AS product_name,
          CONCAT(variant.size_ml, 'ml ', variant.concentration) AS variant_detail
        FROM product_variants variant
        JOIN products product ON product.id = variant.product_id
        WHERE variant.id = ${cartItemInput.variant_id}
        LIMIT 1
      `;

      const variantDetail = variantDetailRows[0];

      await sql`
        INSERT INTO cart_items
          (cart_id, product_id, variant_id, quantity, unit_price, product_name, variant_detail)
        VALUES
          (${cart.id}, ${cartItemInput.product_id}, ${cartItemInput.variant_id},
           ${cartItemInput.quantity}, ${cartItemInput.unit_price},
           ${variantDetail?.product_name ?? ''},
           ${variantDetail?.variant_detail ?? ''})
      `;
    }

    return CartRepo.findBySessionId(sessionId) as Promise<Cart>;
  },

  updateItemQuantity: async (cartItemId: number, newQuantity: number): Promise<CartItem> => {
    const updatedItemRows = await sql`
      UPDATE cart_items
      SET quantity = ${newQuantity}
      WHERE id = ${cartItemId}
      RETURNING *
    `;

    return updatedItemRows[0] as unknown as CartItem;
  },

  removeItem: async (cartItemId: number): Promise<void> => {
    await sql`DELETE FROM cart_items WHERE id = ${cartItemId}`;
  },

  clearCart: async (sessionId: string): Promise<void> => {
    await sql`
      DELETE FROM cart_items
      WHERE cart_id = (
        SELECT id FROM carts WHERE session_id = ${sessionId} LIMIT 1
      )
    `;
  },
};
