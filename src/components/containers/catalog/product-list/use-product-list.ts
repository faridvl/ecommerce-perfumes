import { useState } from 'react';
import { useProductsQuery } from '@/shared/api/querys/inventory/use-products-query';
import { useNavigation } from '@/hooks/use-navigation';

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
  const [searchQuery, setSearchQuery] = useState('');

  const { data: paginatedProducts, isLoading, isError } = useProductsQuery({
    search: searchQuery || undefined,
    pageNumber: 1,
    pageLimit: 12,
  });

  const goToPreviousSlide = () =>
    setCurrentSlideIndex((previousIndex) =>
      previousIndex === 0 ? HERO_SLIDES.length - 1 : previousIndex - 1,
    );

  const goToNextSlide = () =>
    setCurrentSlideIndex((previousIndex) =>
      previousIndex === HERO_SLIDES.length - 1 ? 0 : previousIndex + 1,
    );

  const handleSearchChange = (searchValue: string) => setSearchQuery(searchValue);

  const handleProductClick = (productSlug: string) =>
    navigation.client.productDetail(productSlug);

  return {
    heroSlides: HERO_SLIDES,
    currentSlideIndex,
    goToPreviousSlide,
    goToNextSlide,
    products: paginatedProducts?.data ?? [],
    totalProducts: paginatedProducts?.total ?? 0,
    searchQuery,
    handleSearchChange,
    handleProductClick,
    isLoading,
    isError,
  };
}
