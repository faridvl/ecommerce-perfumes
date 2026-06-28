import React, { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { tailwind } from '@/utils/tailwind-utils';
import { ProductFilters } from '@/hooks/use-product-filters';
import { ProductGender, OlfactoryFamily, ProductSort } from '@/types/product/product.types';

const GENDER_OPTIONS: { value: ProductGender; label: string }[] = [
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'unisex', label: 'Unisex' },
];

const OLFACTORY_OPTIONS: { value: OlfactoryFamily; label: string }[] = [
  { value: 'floral', label: 'Floral' },
  { value: 'oriental', label: 'Oriental' },
  { value: 'fresco', label: 'Fresco' },
  { value: 'madero', label: 'Madero' },
  { value: 'cítrico', label: 'Cítrico' },
  { value: 'gourmand', label: 'Gourmand' },
  { value: 'amaderado', label: 'Amaderado' },
  { value: 'acuático', label: 'Acuático' },
];

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'created_at_desc', label: 'Más nuevo' },
  { value: 'price_asc', label: 'Precio ↑' },
  { value: 'price_desc', label: 'Precio ↓' },
  { value: 'name_asc', label: 'A–Z' },
];

interface FilterContentProps {
  filters: ProductFilters;
  brands: string[];
  onSetFilter: (key: keyof ProductFilters, value: string | number | undefined) => void;
}

function AccordionSection({
  title,
  children,
  defaultOpen = true,
  hasActive = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  hasActive?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">
            {title}
          </span>
          {hasActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
          )}
        </span>
        <ChevronDown
          size={13}
          className={tailwind(
            'text-neutral-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}

function FilterContent({ filters, brands, onSetFilter }: FilterContentProps) {
  return (
    <div className="flex flex-col">

      {/* Ordenar */}
      <AccordionSection title="Ordenar por" hasActive={!!filters.sort}>
        <div className="grid grid-cols-2 gap-1.5">
          {SORT_OPTIONS.map((opt) => {
            const isActive = filters.sort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSetFilter('sort', isActive ? undefined : opt.value)}
                className={tailwind(
                  'px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left',
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </AccordionSection>

      {/* Género */}
      <AccordionSection title="Género" hasActive={!!filters.gender}>
        <div className="flex flex-col gap-0.5">
          {GENDER_OPTIONS.map((opt) => {
            const isActive = filters.gender === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSetFilter('gender', isActive ? undefined : opt.value)}
                className={tailwind(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left',
                  isActive
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50',
                )}
              >
                <span
                  className={tailwind(
                    'w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0',
                    isActive ? 'border-white' : 'border-neutral-300',
                  )}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </AccordionSection>

      {/* Marca */}
      {brands.length > 0 && (
        <AccordionSection title="Marca" defaultOpen={false} hasActive={!!filters.brand}>
          <div className="flex flex-col gap-0.5">
            {brands.map((brand) => {
              const isActive = filters.brand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => onSetFilter('brand', isActive ? undefined : brand)}
                  className={tailwind(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left',
                    isActive
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-600 hover:bg-neutral-50',
                  )}
                >
                  <span
                    className={tailwind(
                      'w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0',
                      isActive ? 'border-white' : 'border-neutral-300',
                    )}
                  >
                    {isActive && <span className="w-2 h-2 bg-white rounded-[2px]" />}
                  </span>
                  {brand}
                </button>
              );
            })}
          </div>
        </AccordionSection>
      )}

      {/* Familia olfativa */}
      <AccordionSection title="Familia Olfativa" defaultOpen={false} hasActive={!!filters.olfactory_family}>
        <div className="flex flex-wrap gap-1.5">
          {OLFACTORY_OPTIONS.map((opt) => {
            const isActive = filters.olfactory_family === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSetFilter('olfactory_family', isActive ? undefined : opt.value)}
                className={tailwind(
                  'px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
                  isActive
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </AccordionSection>

      {/* Precio */}
      <AccordionSection
        title="Precio (USD)"
        defaultOpen={false}
        hasActive={!!filters.min_price || !!filters.max_price}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Mín"
              value={filters.min_price ?? ''}
              onChange={(e) => onSetFilter('min_price', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full pl-6 pr-2 py-2 text-xs border border-neutral-200 rounded-xl bg-neutral-50 outline-none focus:border-neutral-400 focus:bg-white transition-all"
            />
          </div>
          <span className="text-neutral-300 text-xs">—</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Máx"
              value={filters.max_price ?? ''}
              onChange={(e) => onSetFilter('max_price', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full pl-6 pr-2 py-2 text-xs border border-neutral-200 rounded-xl bg-neutral-50 outline-none focus:border-neutral-400 focus:bg-white transition-all"
            />
          </div>
        </div>
      </AccordionSection>

    </div>
  );
}

interface ProductFiltersPanelProps extends FilterContentProps {
  isOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export function ProductFiltersPanel({
  filters,
  brands,
  isOpen = false,
  isMobile = false,
  onClose,
  onSetFilter,
}: ProductFiltersPanelProps) {
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 z-30" onClick={onClose} />
        )}
        <aside
          className={tailwind(
            'fixed top-0 left-0 h-full w-72 z-40 bg-white shadow-2xl',
            'transform transition-transform duration-300 overflow-y-auto',
            'flex flex-col p-5',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between mb-5">
            <span className="font-semibold text-sm text-neutral-800 flex items-center gap-2">
              <SlidersHorizontal size={15} /> Filtros
            </span>
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700">
              <X size={18} />
            </button>
          </div>
          <FilterContent filters={filters} brands={brands} onSetFilter={onSetFilter} />
        </aside>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2 px-3 py-2">
        <SlidersHorizontal size={13} className="text-neutral-400" />
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]">Filtros</span>
      </div>
      <FilterContent filters={filters} brands={brands} onSetFilter={onSetFilter} />
    </div>
  );
}
