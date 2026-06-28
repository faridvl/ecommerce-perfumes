import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
import { ProductFiltersPanel } from './product-filters/product-filters-panel';
import { ActiveFiltersBar } from './product-filters/active-filters-bar';
import { useProductList } from './use-product-list';

export function ProductListContainer() {
  const { t } = useTranslation();
  const {
    heroSlides,
    currentSlideIndex,
    goToPreviousSlide,
    goToNextSlide,
    goToSlide,
    pauseAutoPlay,
    resumeAutoPlay,
    products,
    totalProducts,
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
    setFilterPanelOpen,
    setFilter,
    clearFilter,
    clearAllFilters,
  } = useProductList();

  return (
    <div className="flex flex-col gap-8">

      {/* Hero Carousel */}
      <div
        className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-[24px] sm:rounded-[40px] overflow-hidden shadow-2xl"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
      >
        {heroSlides.map((heroSlide, slideIndex) => (
          <div
            key={heroSlide.title}
            className={tailwind(
              'absolute inset-0 transition-all duration-700 ease-in-out',
              slideIndex === currentSlideIndex
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8',
            )}
          >
            <img
              src={heroSlide.imageUrl}
              className="w-full h-full object-cover"
              alt={heroSlide.title}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-20">
              <Typography
                variant={TypographyVariant.OVERLINE}
                textColor="text-accent"
                className="mb-2"
              >
                {heroSlide.label}
              </Typography>
              <Typography
                variant={TypographyVariant.HEADER}
                textColor="text-white"
                className="text-3xl sm:text-5xl md:text-7xl mb-3"
              >
                {heroSlide.title}
              </Typography>
              <Typography
                variant={TypographyVariant.SUBTITLE}
                textColor="text-neutral-300"
                className="mb-6 max-w-md italic text-sm sm:text-base"
              >
                {heroSlide.subtitle}
              </Typography>
              <Button
                variant={ButtonVariant.PRIMARY}
                text={t(TEXT.CATALOG.LIST.HERO_CTA)}
                className="w-fit px-6 sm:px-10 h-12 sm:h-14"
                onClick={handleHeroCta}
              />
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((heroSlide, dotIndex) => (
            <button
              key={heroSlide.title}
              onClick={() => goToSlide(dotIndex)}
              aria-label={`Slide ${dotIndex + 1}`}
              className={tailwind(
                'rounded-full transition-all duration-300',
                dotIndex === currentSlideIndex
                  ? 'w-6 h-2 bg-accent'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80',
              )}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-12 flex gap-2 sm:gap-4">
          <button
            onClick={goToPreviousSlide}
            className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNextSlide}
            className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Buscador + botón filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant={TypographyVariant.SUBTITLE}>
            {t(TEXT.CATALOG.LIST.TITLE)}
          </Typography>
          <Typography variant={TypographyVariant.HELPER}>
            {isLoading
              ? t(TEXT.CATALOG.LIST.LOADING)
              : t(TEXT.CATALOG.LIST.SUBTITLE, { count: totalProducts })}
          </Typography>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Botón filtros mobile */}
          <button
            onClick={() => setFilterPanelOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-600 shrink-0"
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="relative flex-1 sm:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(changeEvent) => handleSearchChange(changeEvent.target.value)}
              placeholder={t(TEXT.CATALOG.LIST.SEARCH_PLACEHOLDER)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-neutral-50 rounded-2xl outline-none border border-transparent focus:border-neutral-200 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Layout principal: filtros sidebar (desktop) + grid */}
      <div className="flex gap-8">

        {/* Filtros desktop (sidebar estático) */}
        <div className="hidden md:block w-52 shrink-0">
          <ProductFiltersPanel
            filters={filters}
            brands={brands}
            onSetFilter={setFilter}
          />
        </div>

        {/* Filtros mobile (drawer deslizante) */}
        <ProductFiltersPanel
          filters={filters}
          brands={brands}
          isOpen={isFilterPanelOpen}
          isMobile={true}
          onClose={() => setFilterPanelOpen(false)}
          onSetFilter={setFilter}
        />

        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Active filters */}
          <ActiveFiltersBar
            filters={filters}
            totalResults={totalProducts}
            onClearFilter={clearFilter}
            onClearAll={clearAllFilters}
          />

          {/* Error */}
          {isError && (
            <div className="text-center py-12">
              <Typography variant={TypographyVariant.BODY} textColor="text-red-500">
                {t(TEXT.CATALOG.LIST.ERROR)}
              </Typography>
            </div>
          )}

          {/* Grid de productos */}
          {!isError && (
            <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {isLoading
                ? Array.from({ length: 8 }).map((_, skeletonIndex) => (
                  <div key={skeletonIndex} className="animate-pulse">
                    <div className="aspect-[3/4] rounded-[24px] sm:rounded-[32px] bg-neutral-200 mb-4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2" />
                    <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  </div>
                ))
                : products.map((product) => {
                  const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
                  const primaryVariant = product.variants[0];

                  return (
                    <div
                      key={product.uuid}
                      className="group cursor-pointer"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      <div className="aspect-[3/4] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-neutral-100 relative mb-4 sm:mb-6">
                        {primaryImage ? (
                          <img
                            src={primaryImage.url}
                            alt={primaryImage.alt_text || product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm">
                            {t(TEXT.CATALOG.LIST.NO_IMAGE)}
                          </div>
                        )}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          <div className="relative z-10 p-4 sm:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Typography
                              variant={TypographyVariant.OVERLINE}
                              textColor="text-neutral-300"
                              className="text-xs mb-1 block uppercase tracking-widest"
                            >
                              {product.brand}
                            </Typography>
                            <Typography
                              variant={TypographyVariant.BODY_BOLD}
                              textColor="text-white"
                              className="text-base sm:text-lg leading-tight mb-1"
                            >
                              {product.name}
                            </Typography>
                            {primaryVariant && (
                              <Typography
                                variant={TypographyVariant.BODY_SEMIBOLD}
                                textColor="text-accent"
                                className="text-base mb-4"
                              >
                                ${Number(primaryVariant.price_usd).toLocaleString('es-CR')}
                              </Typography>
                            )}
                            {primaryVariant && (
                              <button
                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-accent hover:text-white text-black font-semibold text-sm py-3 px-4 rounded-2xl shadow-lg transition-colors duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product.id, primaryVariant.id, Number(primaryVariant.price_usd));
                                }}
                              >
                                <ShoppingCart size={16} />
                                Agregar al carrito
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <Typography
                        variant={TypographyVariant.OVERLINE}
                        className="text-[10px] text-neutral-400 mb-1 block"
                      >
                        {product.brand}
                      </Typography>
                      <Typography
                        variant={TypographyVariant.BODY_BOLD}
                        className="text-base sm:text-lg mb-1 leading-tight"
                      >
                        {product.name}
                      </Typography>
                      {primaryVariant && (
                        <Typography
                          variant={TypographyVariant.BODY_SEMIBOLD}
                          textColor="text-accent"
                        >
                          ${Number(primaryVariant.price_usd).toLocaleString('es-CR')}
                        </Typography>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
