import { useState, useEffect, useRef, useCallback } from 'react';
import { useProductsQuery } from '@/shared/api/querys/inventory/use-products-query';
import { useNavigation } from '@/hooks/use-navigation';

const AUTOPLAY_INTERVAL_MS = 5000;

const HERO_SLIDES = [
  {
    title: 'Colección Oud',
    subtitle: 'La esencia del desierto',
    imageUrl:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974&auto=format&fit=crop',
    label: 'Nicho',
  },
  {
    title: 'Elegancia de Verano',
    subtitle: 'Frescura cítrica duradera',
    imageUrl:
      'https://images.unsplash.com/photo-1547881338-6491357121b8?q=80&w=1974&auto=format&fit=crop',
    label: 'Limited Edition',
  },
];

export function useProductList() {
  const navigation = useNavigation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: paginatedProducts, isLoading, isError } = useProductsQuery({
    search: searchQuery || undefined,
    pageNumber: 1,
    pageLimit: 12,
  });

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
    isLoading,
    isError,
  };
}
