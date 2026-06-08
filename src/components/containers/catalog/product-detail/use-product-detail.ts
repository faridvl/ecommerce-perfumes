import { useState } from 'react';
import { useRouter } from 'next/router';
import { useProductDetailQuery } from '@/shared/api/querys/inventory/use-product-detail-query';
import { useAddCartItemMutation } from '@/shared/api/mutations/cart/use-add-cart-item-mutation';
import { useNavigation } from '@/hooks/use-navigation';
import { ProductVariant } from '@/types/product/product.types';

export function useProductDetail() {
  const router = useRouter();
  const navigation = useNavigation();
  const productSlug = router.query.slug as string;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const { data: product, isLoading, isError } = useProductDetailQuery(productSlug);
  const { executeAddItem, isPending: isAddingToCart } = useAddCartItemMutation();

  const activeVariant = selectedVariant ?? product?.variants[0] ?? null;

  const handleVariantSelect = (productVariant: ProductVariant) =>
    setSelectedVariant(productVariant);

  const handleAddToCart = () => {
    if (!product || !activeVariant) return;
    executeAddItem(
      {
        product_id: product.id,
        variant_id: activeVariant.id,
        quantity: 1,
        unit_price: activeVariant.price_usd,
      },
      { onSuccess: () => navigation.client.cart() },
    );
  };

  return {
    product,
    activeVariant,
    isLoading,
    isError,
    isAddingToCart,
    handleVariantSelect,
    handleAddToCart,
  };
}
