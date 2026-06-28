import React from 'react';
import { X } from 'lucide-react';
import { ProductFilters } from '@/hooks/use-product-filters';

const FILTER_LABELS: Record<keyof ProductFilters, string> = {
  gender: 'Género',
  brand: 'Marca',
  olfactory_family: 'Familia',
  presentation_type: 'Tipo',
  min_price: 'Precio mín',
  max_price: 'Precio máx',
  sort: 'Orden',
};

interface ActiveFiltersBarProps {
  filters: ProductFilters;
  totalResults: number;
  onClearFilter: (key: keyof ProductFilters) => void;
  onClearAll: () => void;
}

export function ActiveFiltersBar({ filters, totalResults, onClearFilter, onClearAll }: ActiveFiltersBarProps) {
  const activeEntries = Object.entries(filters).filter(([, value]) => value !== undefined) as [keyof ProductFilters, string | number][];

  if (activeEntries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-neutral-500 shrink-0">{totalResults} resultado{totalResults !== 1 ? 's' : ''}</span>

      {activeEntries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium"
        >
          <span className="text-neutral-400">{FILTER_LABELS[key]}:</span>
          {String(value)}
          <button
            onClick={() => onClearFilter(key)}
            className="ml-1 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label={`Quitar filtro ${FILTER_LABELS[key]}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="text-xs text-neutral-400 hover:text-neutral-700 underline underline-offset-2 transition-colors"
      >
        Limpiar todo
      </button>
    </div>
  );
}
