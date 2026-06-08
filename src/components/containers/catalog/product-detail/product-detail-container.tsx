import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { ProductVariant } from '@/types/product/product.types';
import { useProductDetail } from './use-product-detail';

export function ProductDetailContainer() {
  const { t } = useTranslation();
  const {
    product,
    activeVariant,
    isLoading,
    isError,
    isAddingToCart,
    handleVariantSelect,
    handleAddToCart,
  } = useProductDetail();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10 animate-pulse">
        <div className="aspect-square bg-neutral-200 rounded-3xl" />
        <div className="flex flex-col gap-4">
          <div className="h-3 bg-neutral-200 rounded w-1/4" />
          <div className="h-10 bg-neutral-200 rounded w-3/4" />
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-24 bg-neutral-200 rounded" />
          <div className="flex gap-3 mt-4">
            <div className="h-12 bg-neutral-200 rounded-xl w-28" />
            <div className="h-12 bg-neutral-200 rounded-xl w-28" />
          </div>
          <div className="h-14 bg-neutral-200 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-20">
        <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
          {t(TEXT.CATALOG.DETAIL.ERROR)}
        </Typography>
      </div>
    );
  }

  const primaryImage = product.images.find((productImage) => productImage.is_primary);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10">

      {/* Imagen */}
      <div className="aspect-square bg-neutral-50 rounded-3xl overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-300">
            {t(TEXT.CATALOG.DETAIL.NO_IMAGE)}
          </Typography>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">

        <div>
          <Typography variant={TypographyVariant.OVERLINE} className="mb-1">
            {product.brand}
          </Typography>
          <Typography variant={TypographyVariant.HEADER}>
            {product.name}
          </Typography>
        </div>

        {activeVariant && (
          <Typography variant={TypographyVariant.ACCENT} className="text-2xl">
            ${activeVariant.price_usd.toLocaleString('es-CR')}
          </Typography>
        )}

        <Typography variant={TypographyVariant.BODY}>
          {product.description}
        </Typography>

        {/* Selector de variantes */}
        {product.variants.length > 0 && (
          <div className="flex flex-col gap-3">
            <Typography variant={TypographyVariant.BODY_BOLD}>
              {t(TEXT.CATALOG.DETAIL.SELECT_VARIANT)}
            </Typography>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((productVariant: ProductVariant) => (
                <button
                  key={productVariant.uuid}
                  onClick={() => handleVariantSelect(productVariant)}
                  disabled={productVariant.stock === 0}
                  className={tailwind(
                    'px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all',
                    activeVariant?.uuid === productVariant.uuid
                      ? 'border-primary bg-primary text-white'
                      : 'border-neutral-200 text-neutral-700 hover:border-primary',
                    productVariant.stock === 0 && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  {productVariant.size_ml}ml · {productVariant.concentration}
                  {productVariant.stock === 0 && ` · ${t(TEXT.CATALOG.DETAIL.OUT_OF_STOCK)}`}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          variant={ButtonVariant.ACCENT}
          text={isAddingToCart ? t(TEXT.CATALOG.DETAIL.ADDING) : t(TEXT.CATALOG.DETAIL.ADD_TO_CART)}
          className="h-14 text-lg"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !activeVariant || activeVariant.stock === 0}
        />
      </div>
    </div>
  );
}
