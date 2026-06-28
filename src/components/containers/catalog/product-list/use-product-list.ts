import { useState, useEffect, useRef, useCallback } from 'react';
import { useProductsQuery, useBrandsQuery } from '@/shared/api/querys/inventory/use-products-query';
import { useNavigation } from '@/hooks/use-navigation';
import { useCartDrawer } from '@/shared/context/cart-drawer-context';
import { useAddCartItemMutation } from '@/shared/api/mutations/cart/use-add-cart-item-mutation';
import { useProductFilters } from '@/hooks/use-product-filters';

const AUTOPLAY_INTERVAL_MS = 3000;

const HERO_SLIDES = [
  {
    title: 'Colección Oud',
    subtitle: 'La esencia del desierto en cada nota',
    imageUrl:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974&auto=format&fit=crop',
    label: 'Nicho',
  },
  {
    title: 'Elegancia de Verano',
    subtitle: 'Frescura cítrica que perdura',
    imageUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=1974&auto=format&fit=crop',
    label: 'Limited Edition',
  },
  {
    title: 'Lujo Sin Compromiso',
    subtitle: 'Las maisons más exclusivas del mundo',
    imageUrl:
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1974&auto=format&fit=crop',
    label: 'Premium',
  },
  {
    title: 'Decants & Muestras',
    subtitle: 'Descubre tu próxima fragancia favorita',
    imageUrl:
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=1974&auto=format&fit=crop',
    label: 'Explorar',
  },
];

export function useProductList() {
  const navigation = useNavigation();
  const { open: openCartDrawer } = useCartDrawer();
  const { executeAddItem } = useAddCartItemMutation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { filters, activeFilterCount, setFilter, clearFilter, clearAllFilters } = useProductFilters();

  const { data: paginatedProducts, isLoading, isError } = useProductsQuery({
    search: searchQuery || undefined,
    pageNumber: 1,
    pageLimit: 12,
    ...filters,
  });

  const { data: brands = [] } = useBrandsQuery();

  const goToNextSlide = useCallback(() =>
    setCurrentSlideIndex((previousIndex) =>
      previousIndex === HERO_SLIDES.length - 1 ? 0 : previousIndex + 1,
    ), []);

  useEffect(() => {
    if (isAutoPlayPaused) return;
    intervalRef.current = setInterval(goToNextSlide, AUTOPLAY_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlayPaused, goToNextSlide]);

  const goToPreviousSlide = () =>
    setCurrentSlideIndex((previousIndex) =>
      previousIndex === 0 ? HERO_SLIDES.length - 1 : previousIndex - 1,
    );

  const goToSlide = (slideIndex: number) => setCurrentSlideIndex(slideIndex);

  const pauseAutoPlay = () => setIsAutoPlayPaused(true);
  const resumeAutoPlay = () => setIsAutoPlayPaused(false);

  const handleSearchChange = (searchValue: string) => setSearchQuery(searchValue);

  const handleProductClick = (productSlug: string) =>
    navigation.client.productDetail(productSlug);

  const handleAddToCart = (productId: number, variantId: number, unitPrice: number) => {
    executeAddItem(
      { product_id: productId, variant_id: variantId, quantity: 1, unit_price: unitPrice },
      { onSuccess: () => openCartDrawer() },
    );
  };

  const handleHeroCta = () => {
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return {
    heroSlides: HERO_SLIDES,
    currentSlideIndex,
    goToPreviousSlide,
    goToNextSlide,
    goToSlide,
    pauseAutoPlay,
    resumeAutoPlay,
    products: paginatedProducts?.data ?? [],
    totalProducts: paginatedProducts?.total ?? 0,
    searchQuery,
    handleSearchChange,
    handleProductClick,
    handleAddToCart,
    handleHeroCta,
    isLoading,
    isError,
    filters,
    brands,
    activeFilterCount,
    isFilterPanelOpen,
    setFilterPanelOpen: setIsFilterPanelOpen,
    setFilter,
    clearFilter,
    clearAllFilters,
  };
}
