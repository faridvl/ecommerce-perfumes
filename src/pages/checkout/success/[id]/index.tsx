import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Copy, MessageCircle, Info } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { StoreLayout } from '@/components/common/layout/store-layout/store-layout';
import { useOrderDetailQuery } from '@/shared/api/querys/orders/use-order-detail-query';
import { useNavigation } from '@/hooks/use-navigation';
import { TEXT } from '@/static/texts/i18n';

// Actualiza estos valores con los datos reales de pago
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

  const { data: order, isLoading, isError } = useOrderDetailQuery(orderUuid);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
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
        <div className="max-w-2xl mx-auto py-10 animate-pulse space-y-6">
          <div className="h-20 w-20 bg-neutral-200 rounded-full mx-auto" />
          <div className="h-8 bg-neutral-200 rounded w-64 mx-auto" />
          <div className="h-64 bg-neutral-200 rounded-3xl" />
        </div>
      </StoreLayout>
    );
  }

  if (isError || !order) {
    return (
      <StoreLayout title={t(TEXT.CHECKOUT_SUCCESS.TITLE)}>
        <div className="max-w-2xl mx-auto py-24 text-center">
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
      <div className="max-w-2xl mx-auto py-10">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <Typography variant={TypographyVariant.HEADER} className="font-display mb-2 text-3xl">
            {t(TEXT.CHECKOUT_SUCCESS.HEADING)}
          </Typography>
          <Typography variant={TypographyVariant.BODY} textColor="text-neutral-500">
            {t(TEXT.CHECKOUT_SUCCESS.ORDER_LABEL)}{' '}
            <span className="font-bold text-neutral-900">#SS-{order.id}</span>
          </Typography>
        </div>

        {/* Instrucciones de pago */}
        <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 space-y-8">
          <div>
            <Typography variant={TypographyVariant.SUBTITLE} className="mb-4">
              {t(TEXT.CHECKOUT_SUCCESS.INSTRUCTIONS_TITLE)}
            </Typography>
            <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 items-start border border-blue-100">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <Typography variant={TypographyVariant.CAPTION} textColor="text-blue-800">
                {t(TEXT.CHECKOUT_SUCCESS.INSTRUCTIONS_NOTE)}
              </Typography>
            </div>
          </div>

          <div className="space-y-4">
            {/* SINPE */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <div>
                <Typography
                  variant={TypographyVariant.CAPTION}
                  textColor="text-neutral-400"
                  className="font-bold uppercase tracking-widest text-[10px]"
                >
                  {t(TEXT.CHECKOUT_SUCCESS.SINPE_LABEL)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_BOLD} className="text-lg">
                  {PAYMENT_CONFIG.sinpeNumber}
                </Typography>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-500">
                  {PAYMENT_CONFIG.sinpeOwner}
                </Typography>
              </div>
              <button
                onClick={() => handleCopy(PAYMENT_CONFIG.sinpeNumber)}
                className="p-3 hover:bg-neutral-50 rounded-xl transition-colors text-primary"
                title="Copiar"
              >
                <Copy size={20} />
              </button>
            </div>

            {/* IBAN */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
              <div>
                <Typography
                  variant={TypographyVariant.CAPTION}
                  textColor="text-neutral-400"
                  className="font-bold uppercase tracking-widest text-[10px]"
                >
                  {t(TEXT.CHECKOUT_SUCCESS.IBAN_LABEL)}
                </Typography>
                <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm break-all">
                  {PAYMENT_CONFIG.iban}
                </Typography>
              </div>
              <button
                onClick={() => handleCopy(PAYMENT_CONFIG.iban)}
                className="p-3 hover:bg-neutral-50 rounded-xl transition-colors text-primary"
                title="Copiar"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Typography variant={TypographyVariant.BODY} textColor="text-neutral-500" className="mb-2">
              {t(TEXT.CHECKOUT_SUCCESS.TOTAL_LABEL)}
            </Typography>
            <Typography
              variant={TypographyVariant.HEADER}
              textColor="text-primary"
              className="text-4xl mb-8 font-display"
            >
              ${order.total_amount.toLocaleString('es-CR')}
            </Typography>

            <Button
              variant={ButtonVariant.PRIMARY}
              text={t(TEXT.CHECKOUT_SUCCESS.WHATSAPP_BUTTON)}
              className="w-full h-16 text-lg bg-[#25D366] hover:bg-[#20ba5a] border-none shadow-lg shadow-green-200"
              onClick={handleSendWhatsApp}
            >
              <MessageCircle className="mr-2" />
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => client.home()}
            className="text-neutral-400 hover:text-primary transition-colors text-sm font-medium"
          >
            {t(TEXT.CHECKOUT_SUCCESS.BACK_TO_STORE)}
          </button>
        </div>
      </div>
    </StoreLayout>
  );
};

export default CheckoutSuccessPage;
