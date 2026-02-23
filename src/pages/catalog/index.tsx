import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { Search, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';

const CatalogPage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Colección Oud",
            subtitle: "La esencia del desierto",
            image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974&auto=format&fit=crop",
            accent: "Nicho"
        },
        {
            title: "Elegancia de Verano",
            subtitle: "Frescura cítrica duradera",
            image: "https://images.unsplash.com/photo-1547881338-6491357121b8?q=80&w=1974&auto=format&fit=crop",
            accent: "Limited Edition"
        }
    ];

    const products = [
        { id: 1, name: 'Avenue 33', brand: 'Eclipse', price: '₡42,000', image: 'https://via.placeholder.com/300x400', category: 'Nicho' },
        { id: 2, name: 'Luminous Gold', brand: 'ScentStack Luxe', price: '₡38,500', image: 'https://via.placeholder.com/300x400', category: 'Oriental' },
        { id: 3, name: 'Oceanic Mist', brand: 'Eclipse', price: '₡29,000', image: 'https://via.placeholder.com/300x400', category: 'Fresco' },
        { id: 4, name: 'Velvet Rose', brand: 'Private Collection', price: '₡55,000', image: 'https://via.placeholder.com/300x400', category: 'Floral' },
    ];

    return (
        <StoreLayout title="Catálogo Exclusivo">
            <div className="flex flex-col gap-12">

                {/* --- HERO CAROUSEL (Estilo Eclipse) --- */}
                <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden group shadow-2xl">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 md:px-20">
                                <Typography variant={TypographyVariant.OVERLINE} textColor="text-accent" className="mb-2">
                                    {slide.accent}
                                </Typography>
                                <Typography variant={TypographyVariant.HEADER} textColor="text-white" className="text-5xl md:text-7xl mb-4">
                                    {slide.title}
                                </Typography>
                                <Typography variant={TypographyVariant.SUBTITLE} textColor="text-neutral-300" className="mb-8 max-w-md italic">
                                    {slide.subtitle}
                                </Typography>
                                <Button variant={ButtonVariant.PRIMARY} text="Descubrir ahora" className="w-fit px-10 h-14" />
                            </div>
                        </div>
                    ))}

                    {/* Controles del Carousel */}
                    <div className="absolute bottom-8 right-12 flex gap-4">
                        <button
                            onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
                            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* --- BUSCADOR Y FILTROS --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <Typography variant={TypographyVariant.SUBTITLE}>Explorar Fragancias</Typography>
                        <Typography variant={TypographyVariant.HELPER}>Mostrando {products.length} productos exclusivos</Typography>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por notas olfativas..."
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none border border-transparent focus:border-neutral-200 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* --- GRID DE PRODUCTOS --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {products.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-neutral-100 relative mb-6">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                {/* Overlay de compra rápida */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="bg-white p-4 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <ShoppingCart size={20} className="text-black" />
                                    </button>
                                </div>
                            </div>
                            <Typography variant={TypographyVariant.OVERLINE} className="text-[10px] text-neutral-400 mb-1 block">
                                {item.brand}
                            </Typography>
                            <Typography variant={TypographyVariant.BODY_BOLD} className="text-lg mb-1 leading-tight">
                                {item.name}
                            </Typography>
                            <Typography variant={TypographyVariant.BODY_SEMIBOLD} textColor="text-accent">
                                {item.price}
                            </Typography>
                        </div>
                    ))}
                </div>
            </div>
        </StoreLayout>
    );
};

export default CatalogPage;