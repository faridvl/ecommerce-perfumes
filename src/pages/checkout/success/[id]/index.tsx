import React from 'react';
import { useRouter } from 'next/router';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { CheckCircle2, Copy, MessageCircle, Info } from 'lucide-react';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';

const CheckoutSuccessPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Estos datos vendrían de tu configuración o base de datos
    const paymentDetails = {
        sinpe: "8888-8888",
        owner: "Tu Nombre Completo",
        iban: "CR05015100010000000000",
        total: 45000 // Esto debería venir del estado de la orden
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Aquí podrías disparar un toast de "Copiado"
    };

    const sendWhatsApp = () => {
        const message = `Hola ScentStack! Mi pedido es el #${id}. Adjunto el comprobante de pago por ₡${paymentDetails.total.toLocaleString()}.`;
        const url = `https://wa.me/50688888888?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <StoreLayout title="Pedido Confirmado">
            <div className="max-w-2xl mx-auto py-10">

                {/* Header de Éxito */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle2 className="text-green-600" size={40} />
                    </div>
                    <Typography variant={TypographyVariant.HEADER} className="font-display mb-2 text-3xl">
                        ¡Pedido Recibido!
                    </Typography>
                    <Typography variant={TypographyVariant.BODY} className="text-neutral-500">
                        Tu número de orden es <span className="font-bold text-neutral-900">#{id}</span>
                    </Typography>
                </div>

                {/* Instrucciones de Pago */}
                <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 space-y-8">
                    <div>
                        <Typography variant={TypographyVariant.SUBTITLE} className="mb-4">
                            Instrucciones de Pago
                        </Typography>
                        <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 items-start border border-blue-100 mb-6">
                            <Info className="text-blue-600 flex-shrink-0" size={20} />
                            <Typography variant={TypographyVariant.CAPTION} className="text-blue-800">
                                Tu pedido se procesará una vez que verifiquemos el comprobante de pago vía WhatsApp.
                            </Typography>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* SINPE Móvil */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                            <div>
                                <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">SINPE Móvil</Typography>
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-lg">{paymentDetails.sinpe}</Typography>
                                <Typography variant={TypographyVariant.CAPTION} className="text-neutral-500">{paymentDetails.owner}</Typography>
                            </div>
                            <button
                                onClick={() => handleCopy(paymentDetails.sinpe)}
                                className="p-3 hover:bg-neutral-50 rounded-xl transition-colors text-primary"
                            >
                                <Copy size={20} />
                            </button>
                        </div>

                        {/* Cuenta IBAN */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                            <div>
                                <Typography variant={TypographyVariant.CAPTION} className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Cuenta IBAN</Typography>
                                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm break-all">{paymentDetails.iban}</Typography>
                            </div>
                            <button
                                onClick={() => handleCopy(paymentDetails.iban)}
                                className="p-3 hover:bg-neutral-50 rounded-xl transition-colors text-primary"
                            >
                                <Copy size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 text-center">
                        <Typography variant={TypographyVariant.BODY} className="text-neutral-500 mb-2">Total a depositar:</Typography>
                        <Typography variant={TypographyVariant.HEADER} className="text-4xl text-primary mb-8 font-display">
                            ₡{paymentDetails.total.toLocaleString()}
                        </Typography>

                        <Button
                            variant={ButtonVariant.PRIMARY}
                            text="Enviar Comprobante por WhatsApp"
                            className="w-full h-16 text-lg bg-[#25D366] hover:bg-[#20ba5a] border-none shadow-lg shadow-green-200"
                            onClick={sendWhatsApp}
                        >
                            <MessageCircle className="mr-2" />
                        </Button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-neutral-400 hover:text-primary transition-colors text-sm font-medium"
                    >
                        Volver a la tienda
                    </button>
                </div>

            </div>
        </StoreLayout>
    );
};

export default CheckoutSuccessPage;