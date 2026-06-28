import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { ProductGallery } from './product-gallery';
import { VariantSelector } from './variant-selector';
import { useProductDetail } from './use-product-detail';

const GENDER_LABELS: Record<string, string> = {
  hombre: 'Hombre',
  mujer: 'Mujer',
  unisex: 'Unisex',
};

const FAMILY_LABELS: Record<string, string> = {
  floral: 'Floral',
  oriental: 'Oriental',
  fresco: 'Fresco',
  madero: 'Madero',
  'cítrico': 'Cítrico',
  gourmand: 'Gourmand',
  amaderado: 'Amaderado',
  'acuático': 'Acuático',
};

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
      <div className="flex flex-col gap-4 py-6 animate-pulse">
        <div className="h-3 bg-neutral-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-2">
          <div className="aspect-[4/5] bg-neutral-200 rounded-[32px]" />
          <div className="flex flex-col gap-4">
            <div className="h-3 bg-neutral-200 rounded w-1/4" />
            <div className="h-10 bg-neutral-200 rounded w-3/4" />
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
            <div className="h-24 bg-neutral-200 rounded" />
            <div className="flex gap-3 mt-4">
              {[1,2,3].map((s) => <div key={s} className="h-12 bg-neutral-200 rounded-2xl w-28" />)}
            </div>
            <div className="h-14 bg-neutral-200 rounded-xl mt-4" />
          </div>
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

  const canAddToCart = !!activeVariant && activeVariant.stock > 0;

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-10">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/catalog' },
          { label: 'Catálogo', href: '/catalog' },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

        {/* Galería */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Info */}
        <div className="flex flex-col gap-5">

          {/* Marca + nombre */}
          <div>
            <Typography variant={TypographyVariant.OVERLINE} className="mb-1 text-neutral-400">
              {product.brand}
            </Typography>
            <Typography variant={TypographyVariant.HEADER} className="text-3xl md:text-4xl leading-tight">
              {product.name}
            </Typography>
          </div>

          {/* Badges género + familia olfativa */}
          {(product.gender || product.olfactory_family) && (
            <div className="flex flex-wrap gap-2">
              {product.gender && (
                <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                  {GENDER_LABELS[product.gender] ?? product.gender}
                </span>
              )}
              {product.olfactory_family && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                  {FAMILY_LABELS[product.olfactory_family] ?? product.olfactory_family}
                </span>
              )}
            </div>
          )}

          {/* Precio */}
          {activeVariant && (
            <Typography variant={TypographyVariant.ACCENT} className="text-3xl font-bold">
              ${Number(activeVariant.price_usd).toLocaleString('es-CR')}
            </Typography>
          )}

          {/* Descripción */}
          <Typography variant={TypographyVariant.BODY} textColor="text-neutral-600" className="leading-relaxed">
            {product.description}
          </Typography>

          {/* Selector de variantes */}
          {product.variants.length > 0 && (
            <div className="flex flex-col gap-2">
              <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm">
                {t(TEXT.CATALOG.DETAIL.SELECT_VARIANT)}
              </Typography>
              <VariantSelector
                variants={product.variants}
                selectedVariant={activeVariant}
                onSelect={handleVariantSelect}
              />
            </div>
          )}

          {/* Stock badge */}
          {activeVariant && activeVariant.stock > 0 && activeVariant.stock <= 5 && (
            <span className="text-xs text-orange-500 font-medium">
              Solo {activeVariant.stock} unidad{activeVariant.stock !== 1 ? 'es' : ''} disponible{activeVariant.stock !== 1 ? 's' : ''}
            </span>
          )}

          {/* CTA desktop */}
          <Button
            variant={ButtonVariant.ACCENT}
            text={isAddingToCart ? t(TEXT.CATALOG.DETAIL.ADDING) : t(TEXT.CATALOG.DETAIL.ADD_TO_CART)}
            className="hidden md:flex h-14 text-base"
            onClick={handleAddToCart}
            disabled={isAddingToCart || !canAddToCart}
          />

          {!canAddToCart && !isAddingToCart && (
            <Typography
              variant={TypographyVariant.CAPTION}
              textColor="text-neutral-400"
              className="hidden md:block text-sm italic"
            >
              {t(TEXT.CATALOG.DETAIL.OUT_OF_STOCK)}
            </Typography>
          )}
        </div>
      </div>

      {/* Sticky CTA mobile */}
      <div className={tailwind(
        'fixed bottom-0 left-0 right-0 z-20 md:hidden',
        'bg-white border-t border-neutral-100 px-4 py-3 shadow-2xl',
      )}>
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !canAddToCart}
          className={tailwind(
            'w-full flex items-center justify-center gap-2 h-13 rounded-2xl font-semibold text-base transition-all',
            canAddToCart
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
          )}
        >
          <ShoppingCart size={18} />
          {isAddingToCart
            ? t(TEXT.CATALOG.DETAIL.ADDING)
            : canAddToCart
              ? t(TEXT.CATALOG.DETAIL.ADD_TO_CART)
              : t(TEXT.CATALOG.DETAIL.OUT_OF_STOCK)}
        </button>
      </div>
    </div>
  );
}
