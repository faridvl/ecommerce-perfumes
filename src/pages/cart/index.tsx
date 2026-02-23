import React from 'react';
import Head from 'next/head';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';

const CartPage = () => {
    const { shop } = useNavigation();

    // NOTA: Aquí eventualmente conectarás con tu estado de carrito (Context o Redux)
    // Por ahora, simulamos datos para que veas el diseño.
    const cartItems = [
        { id: 1, name: 'Baccarat Rouge 540', brand: 'Maison Francis Kurkdjian', price: 45000, qty: 1, image: 'https://via.placeholder.com/100' },
    ];

    const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <StoreLayout title="Mi Carrito">
            <div className="max-w-4xl mx-auto">
                <Typography variant={TypographyVariant.HEADER} className="mb-8 font-display">
                    Tu Carrito
                </Typography>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Lista de Productos */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-neutral-100 pb-6 items-center">
                                    <div className="w-24 h-24 bg-neutral-50 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1">
                                        <Typography variant={TypographyVariant.BODY_BOLD}>{item.name}</Typography>
                                        <Typography variant={TypographyVariant.CAPTION} className="text-neutral-500 mb-2">
                                            {item.brand}
                                        </Typography>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button className="p-1 border rounded-md hover:bg-neutral-50"><Minus size={14} /></button>
                                            <Typography variant={TypographyVariant.BODY_SEMIBOLD}>{item.qty}</Typography>
                                            <button className="p-1 border rounded-md hover:bg-neutral-50"><Plus size={14} /></button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <Typography variant={TypographyVariant.BODY_BOLD} className="text-primary">
                                            ₡{item.price.toLocaleString()}
                                        </Typography>
                                        <button className="text-red-400 hover:text-red-600 mt-2 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen de Compra */}
                        <div className="bg-neutral-50 rounded-3xl p-8 h-fit space-y-6">
                            <Typography variant={TypographyVariant.SUBTITLE} className="text-lg">Resumen</Typography>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Typography variant={TypographyVariant.BODY} className="text-neutral-500">Subtotal</Typography>
                                    <Typography variant={TypographyVariant.BODY_SEMIBOLD}>₡{total.toLocaleString()}</Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant={TypographyVariant.BODY} className="text-neutral-500">Envío</Typography>
                                    <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-green-600 font-bold uppercase text-[10px] bg-green-100 px-2 py-1 rounded">Gratis</Typography>
                                </div>
                            </div>

                            <div className="h-px bg-neutral-200 w-full" />

                            <div className="flex justify-between items-end">
                                <Typography variant={TypographyVariant.BODY_BOLD}>Total</Typography>
                                <Typography variant={TypographyVariant.HEADER} className="text-primary text-2xl">
                                    ₡{total.toLocaleString()}
                                </Typography>
                            </div>

                            <Button
                                variant={ButtonVariant.PRIMARY}
                                text="Procesar Compra"
                                className="w-full h-14 text-lg shadow-xl shadow-primary/20"
                                onClick={() => shop.checkout()}
                            />

                            <Typography variant={TypographyVariant.CAPTION} className="text-center block text-neutral-400 italic">
                                Cierre de venta vía WhatsApp
                            </Typography>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <ShoppingBag size={64} className="mx-auto text-neutral-200" />
                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-neutral-400">
                            Tu carrito está vacío
                        </Typography>
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            text="Ver Catálogo"
                            onClick={() => shop.catalog()}
                        />
                    </div>
                )}
            </div>
        </StoreLayout>
    );
};

export default CartPage;