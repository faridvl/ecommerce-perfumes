import React, { useState } from 'react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { MapPin, Truck, CreditCard, MessageCircle } from 'lucide-react';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';

const CheckoutPage = () => {
    const { client } = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Simulación de envío de formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Aquí iría tu lógica para guardar la orden en Firebase/DB
        setTimeout(() => {
            // Redirigimos a la página de éxito que crearemos (ejemplo ID: 12345)
            client.checkoutSuccess("12345");
        }, 1500);
    };

    return (
        <StoreLayout title="Finalizar Compra">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Columna Izquierda: Formulario */}
                    <section className="space-y-8">
                        <div>
                            <Typography variant={TypographyVariant.HEADER} className="font-display mb-2">
                                Información de Entrega
                            </Typography>
                            <Typography variant={TypographyVariant.BODY} className="text-neutral-500">
                                Completa tus datos para coordinar el envío de tus fragancias.
                            </Typography>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Nombre</label>
                                        <input required className="h-12 px-4 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-colors" placeholder="Tu nombre" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">WhatsApp</label>
                                        <input required type="tel" className="h-12 px-4 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-colors" placeholder="8888-8888" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Dirección Exacta</label>
                                    <textarea required className="p-4 rounded-xl border border-neutral-200 focus:border-primary outline-none transition-colors min-h-[100px]" placeholder="Provincia, cantón, distrito y señas particulares" />
                                </div>
                            </div>

                            <div className="p-6 bg-blue-50 rounded-2xl flex gap-4 items-start">
                                <Truck className="text-primary flex-shrink-0" size={24} />
                                <div>
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-primary">Envío por Correos de Costa Rica</Typography>
                                    <Typography variant={TypographyVariant.CAPTION} className="text-blue-700/70">Recibirás tu tracking una vez confirmado el depósito.</Typography>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant={ButtonVariant.PRIMARY}
                                text={isSubmitting ? "Procesando..." : "Confirmar Pedido"}
                                className="w-full h-14 text-lg"
                                disabled={isSubmitting}
                            />
                        </form>
                    </section>

                    {/* Columna Derecha: Resumen y Método de Pago Informativo */}
                    <aside className="space-y-8">
                        <div className="bg-neutral-900 text-white rounded-3xl p-8 space-y-6 shadow-2xl">
                            <Typography variant={TypographyVariant.SUBTITLE} className="text-white">Resumen del Pedido</Typography>

                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-[10px]">1x</div>
                                        <Typography variant={TypographyVariant.BODY_SEMIBOLD} className="text-sm">Baccarat Rouge 540</Typography>
                                    </div>
                                    <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm">₡45,000</Typography>
                                </div>
                            </div>

                            <div className="h-px bg-neutral-800 w-full" />

                            <div className="flex justify-between items-end">
                                <Typography variant={TypographyVariant.BODY} className="text-neutral-400">Total a pagar</Typography>
                                <Typography variant={TypographyVariant.HEADER} className="text-white text-3xl">
                                    ₡45,000
                                </Typography>
                            </div>
                        </div>

                        <div className="border border-neutral-100 rounded-3xl p-8 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard size={20} className="text-neutral-400" />
                                <Typography variant={TypographyVariant.BODY_BOLD}>¿Cómo pagar?</Typography>
                            </div>
                            <Typography variant={TypographyVariant.CAPTION} className="text-neutral-500 leading-relaxed">
                                Al confirmar, se generará un número de pedido. Deberás realizar el depósito vía **SINPE Móvil** o **Transferencia IBAN** y enviar el comprobante por WhatsApp.
                            </Typography>
                        </div>
                    </aside>

                </div>
            </div>
        </StoreLayout>
    );
};

export default CheckoutPage;