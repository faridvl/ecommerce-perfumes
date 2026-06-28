import React from 'react';
import { Droplets, Package } from 'lucide-react';
import { ProductVariant } from '@/types/product/product.types';
import { tailwind } from '@/utils/tailwind-utils';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  const decants = variants.filter((v) => v.presentation_type === 'decant');
  const bottles = variants.filter((v) => v.presentation_type !== 'decant');

  const renderVariantChip = (variant: ProductVariant) => {
    const isSelected = selectedVariant?.id === variant.id;
    const isOutOfStock = variant.stock === 0;
    const isDecant = variant.presentation_type === 'decant';

    return (
      <button
        key={variant.id}
        onClick={() => !isOutOfStock && onSelect(variant)}
        disabled={isOutOfStock}
        className={tailwind(
          'relative flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-medium transition-all',
          isSelected
            ? 'border-primary bg-primary text-white shadow-md'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400',
          isOutOfStock && 'opacity-40 cursor-not-allowed',
        )}
      >
        {isDecant ? <Droplets size={14} /> : <Package size={14} />}
        <span>{variant.size_ml}ml {variant.concentration}</span>
        {isOutOfStock && (
          <span className="absolute -top-2 -right-2 text-[10px] bg-neutral-400 text-white px-1.5 py-0.5 rounded-full font-semibold">
            Agotado
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {decants.length > 0 && (
        <div className="flex flex-col gap-2">
          <Typography variant={TypographyVariant.OVERLINE} className="text-xs text-neutral-400 uppercase tracking-wide">
            Decants
          </Typography>
          <div className="flex flex-wrap gap-2">
            {decants.map(renderVariantChip)}
          </div>
        </div>
      )}
      {bottles.length > 0 && (
        <div className="flex flex-col gap-2">
          <Typography variant={TypographyVariant.OVERLINE} className="text-xs text-neutral-400 uppercase tracking-wide">
            Botellas
          </Typography>
          <div className="flex flex-wrap gap-2">
            {bottles.map(renderVariantChip)}
          </div>
        </div>
      )}
    </div>
  );
}
