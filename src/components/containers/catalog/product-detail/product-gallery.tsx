import React, { useState } from 'react';
import { ProductImage } from '@/types/product/product.types';
import { tailwind } from '@/utils/tailwind-utils';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-[32px] bg-neutral-100 flex items-center justify-center text-neutral-300 text-sm">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-neutral-100 relative group">
        <img
          key={activeImage.url}
          src={activeImage.url}
          alt={activeImage.alt_text || productName}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((image, thumbnailIndex) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(thumbnailIndex)}
              className={tailwind(
                'shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
                thumbnailIndex === activeIndex
                  ? 'border-primary opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-90',
              )}
            >
              <img
                src={image.url}
                alt={image.alt_text || productName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
