import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Copy, MessageCircle, Sparkles } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';
import { useOrderDetailQuery } from '@/shared/api/querys/orders/use-order-detail-query';
import { useNavigation } from '@/hooks/use-navigation';
import { TEXT } from '@/static/texts/i18n';
import { useState } from 'react';

const PAYMENT_CONFIG = {
  sinpeNumber: process.env.NEXT_PUBLIC_SINPE_NUMBER ?? '',
  sinpeOwner: process.env.NEXT_PUBLIC_SINPE_OWNER ?? '',
  iban: process.env.NEXT_PUBLIC_IBAN ?? '',
  whatsappBusiness: process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS ?? '',
};

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { client } = useNavigation();
  const orderUuid = typeof router.query.id === 'string' ? router.query.id : '';
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: order, isLoading, isError } = useOrderDetailQuery(orderUuid);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!order) return;
    const whatsAppMessage = `Hola ScentStack! Mi pedido es el #SS-${order.id}. Adjunto el comprobante de pago por $${order.total_amount.toLocaleString('es-CR')}.`;
    window.open(
      `https://wa.me/${PAYMENT_CONFIG.whatsappBusiness}?text=${encodeURIComponent(whatsAppMessage)}`,
      '_blank',
    );
  };

  if (isLoading || !orderUuid) {
    return (
      <StoreLayout title={t(TEXT.CHECKOUT_SUCCESS.TITLE)}>
        <div className="max-w-lg mx-auto py-16 animate-pulse space-y-6 px-4">
          <div className="h-24 w-24 bg-neutral-200 rounded-full mx-auto" />
          <div className="h-8 bg-neutral-200 rounded-2xl w-3/4 mx-auto" />
          <div className="h-72 bg-neutral-200 rounded-3xl" />
        </div>
      </StoreLayout>
    );
  }

  if (isError || !order) {
    return (
      <StoreLayout title={t(TEXT.CHECKOUT_SUCCESS.TITLE)}>
        <div className="max-w-lg mx-auto py-24 text-center px-4">
          <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
            {t(TEXT.CHECKOUT_SUCCESS.NOT_FOUND)}
          </Typography>
          <button
            onClick={() => client.home()}
            className="mt-4 text-sm text-primary hover:underline"
          >
            {t(TEXT.CHECKOUT_SUCCESS.BACK_TO_STORE)}
          </button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout title={t(TEXT.CHECKOUT_SUCCESS.TITLE)}>
      <div className="max-w-lg mx-auto py-12 px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-500" size={44} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-md">
              <Sparkles size={13} className="text-white" />
            </div>
          </div>
          <Typography variant={TypographyVariant.HEADER} className="text-2xl md:text-3xl mb-2">
            {t(TEXT.CHECKOUT_SUCCESS.HEADING)}
          </Typography>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-100 rounded-full mt-1">
            <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
              {t(TEXT.CHECKOUT_SUCCESS.ORDER_LABEL)}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-800" className="font-bold">
              #SS-{order.id}
            </Typography>
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">

          {/* Top — total */}
          <div className="px-8 pt-8 pb-6 border-b border-white/10">
            <Typography variant={TypographyVariant.OVERLINE} textColor="text-neutral-400" className="mb-3 block">
              {t(TEXT.CHECKOUT_SUCCESS.TOTAL_LABEL)}
            </Typography>
            <Typography variant={TypographyVariant.HEADER} textColor="text-white" className="text-4xl font-display">
              ${order.total_amount.toLocaleString('es-CR')}
            </Typography>
            <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-500" className="mt-1 block">
              {t(TEXT.CHECKOUT_SUCCESS.INSTRUCTIONS_NOTE)}
            </Typography>
          </div>

          {/* Métodos de pago */}
          <div className="px-8 py-6 space-y-3">
            <Typography variant={TypographyVariant.OVERLINE} textColor="text-neutral-500" className="block mb-4">
              {t(TEXT.CHECKOUT_SUCCESS.INSTRUCTIONS_TITLE)}
            </Typography>

            {/* SINPE */}
            <button
              onClick={() => handleCopy(PAYMENT_CONFIG.sinpeNumber, 'sinpe')}
              className="w-full flex items-center justify-between gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-200 group text-left"
            >
              <div className="min-w-0 flex-1">
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-widest font-bold text-[10px] block mb-1">
                  {t(TEXT.CHECKOUT_SUCCESS.SINPE_LABEL)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-white" className="text-xl tracking-wider">
                  {PAYMENT_CONFIG.sinpeNumber}
                </Typography>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-500">
                  {PAYMENT_CONFIG.sinpeOwner}
                </Typography>
              </div>
              <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${copiedField === 'sinpe' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-neutral-400 group-hover:text-white'}`}>
                <Copy size={13} />
                {copiedField === 'sinpe' ? '¡Copiado!' : 'Copiar'}
              </div>
            </button>

            {/* IBAN */}
            <button
              onClick={() => handleCopy(PAYMENT_CONFIG.iban, 'iban')}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-200 group text-left"
            >
              <div className="min-w-0 flex-1">
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400" className="uppercase tracking-widest font-bold text-[10px] block mb-1">
                  {t(TEXT.CHECKOUT_SUCCESS.IBAN_LABEL)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-white" className="text-sm font-mono break-all">
                  {PAYMENT_CONFIG.iban}
                </Typography>
              </div>
              <div className={`ml-3 flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${copiedField === 'iban' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-neutral-400 group-hover:text-white'}`}>
                <Copy size={13} />
                {copiedField === 'iban' ? '¡Copiado!' : 'Copiar'}
              </div>
            </button>
          </div>

          {/* WhatsApp CTA */}
          <div className="px-8 pb-8">
            <button
              onClick={handleSendWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] rounded-2xl transition-all duration-200 shadow-lg shadow-green-900/30 font-semibold text-white text-[15px] leading-none"
            >
              <MessageCircle size={20} strokeWidth={2} className="flex-shrink-0" />
              <span>{t(TEXT.CHECKOUT_SUCCESS.WHATSAPP_BUTTON)}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => client.home()}
            className="text-neutral-400 hover:text-neutral-700 transition-colors text-sm font-medium"
          >
            {t(TEXT.CHECKOUT_SUCCESS.BACK_TO_STORE)}
          </button>
        </div>

      </div>
    </StoreLayout>
  );
};

export default CheckoutSuccessPage;
