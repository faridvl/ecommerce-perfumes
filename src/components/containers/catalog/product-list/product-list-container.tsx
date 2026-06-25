import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { tailwind } from '@/utils/tailwind-utils';
import { TEXT } from '@/static/texts/i18n';
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
    isLoading,
    isError,
  } = useProductList();

  return (
    <div className="flex flex-col gap-12">

      {/* Hero Carousel */}
      <div
        className="relative w-full h-[500px] rounded-[40px] overflow-hidden shadow-2xl"
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 md:px-20">
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
                className="text-5xl md:text-7xl mb-4"
              >
                {heroSlide.title}
              </Typography>
              <Typography
                variant={TypographyVariant.SUBTITLE}
                textColor="text-neutral-300"
                className="mb-8 max-w-md italic"
              >
                {heroSlide.subtitle}
              </Typography>
              <Button
                variant={ButtonVariant.PRIMARY}
                text={"Ver Catalogo"}
                className="w-fit px-10 h-14"
              />
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
        <div className="absolute bottom-8 right-12 flex gap-4">
          <button
            onClick={goToPreviousSlide}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNextSlide}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <Typography variant={TypographyVariant.SUBTITLE}>
            {t(TEXT.CATALOG.LIST.TITLE)}
          </Typography>
          <Typography variant={TypographyVariant.HELPER}>
            {isLoading
              ? t(TEXT.CATALOG.LIST.LOADING)
              : t(TEXT.CATALOG.LIST.SUBTITLE, { count: totalProducts })}
          </Typography>
        </div>
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(changeEvent) => handleSearchChange(changeEvent.target.value)}
            placeholder={t(TEXT.CATALOG.LIST.SEARCH_PLACEHOLDER)}
            className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none border border-transparent focus:border-neutral-200 transition-all text-sm"
          />
        </div>
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {isLoading
            ? Array.from({ length: 8 }).map((_, skeletonIndex) => (
              <div key={skeletonIndex} className="animate-pulse">
                <div className="aspect-[3/4] rounded-[32px] bg-neutral-200 mb-6" />
                <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2" />
                <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-1/3" />
              </div>
            ))
            : products.map((product) => {
              const primaryImage = product.images.find(
                (productImage) => productImage.is_primary,
              );
              const primaryVariant = product.variants[0];

              return (
                <div
                  key={product.uuid}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-neutral-100 relative mb-6">
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
                      <div className="relative z-10 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
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
                          className="text-lg leading-tight mb-1"
                        >
                          {product.name}
                        </Typography>
                        {primaryVariant && (
                          <Typography
                            variant={TypographyVariant.BODY_SEMIBOLD}
                            textColor="text-accent"
                            className="text-base mb-4"
                          >
                            ${primaryVariant.price_usd.toLocaleString('es-CR')}
                          </Typography>
                        )}
                        <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-accent hover:text-white text-black font-semibold text-sm py-3 px-4 rounded-2xl shadow-lg transition-colors duration-200">
                          <ShoppingCart size={16} />
                          Agregar al carrito
                        </button>
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
                    className="text-lg mb-1 leading-tight"
                  >
                    {product.name}
                  </Typography>
                  {primaryVariant && (
                    <Typography
                      variant={TypographyVariant.BODY_SEMIBOLD}
                      textColor="text-accent"
                    >
                      ${primaryVariant.price_usd.toLocaleString('es-CR')}
                    </Typography>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
