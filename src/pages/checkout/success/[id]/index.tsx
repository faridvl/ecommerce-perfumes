import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Copy, Sparkles } from 'lucide-react';
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
          <div className="px-5 pt-6 pb-6 border-b border-white/10">
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
          <div className="px-5 py-6 space-y-3">
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
                <Typography variant={TypographyVariant.BODY_BOLD} textColor="text-white" className="text-base sm:text-xl tracking-wider">
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
          <div className="px-5 pb-6">
            <button
              onClick={handleSendWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] rounded-2xl transition-all duration-200 shadow-lg shadow-green-900/30 font-semibold text-white text-[15px] leading-none"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
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
