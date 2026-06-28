import { useTranslation } from 'react-i18next';
import { Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { TEXT } from '@/static/texts/i18n';
import { useCheckout } from './use-checkout';

const inputClass =
  'w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent';
const labelClass = 'text-xs font-bold uppercase tracking-wider text-neutral-400';
const errorClass = 'text-xs text-red-500 mt-0.5';

export function CheckoutContainer() {
  const { t } = useTranslation();
  const { client } = useNavigation();
  const {
    form,
    cartItems,
    cartTotal,
    hasItems,
    isCartLoading,
    isPending,
    hasError,
    handleSubmit,
  } = useCheckout();
  const {
    register,
    formState: { errors },
  } = form;

  if (isCartLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-48" />
            <div className="h-12 bg-neutral-200 rounded-xl" />
            <div className="h-12 bg-neutral-200 rounded-xl" />
            <div className="h-24 bg-neutral-200 rounded-xl" />
          </div>
          <div className="h-80 bg-neutral-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ShoppingBag size={48} className="text-neutral-200" />
        <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
          {t(TEXT.CHECKOUT.EMPTY_CART)}
        </Typography>
        <Button
          variant={ButtonVariant.PRIMARY}
          text={t(TEXT.CHECKOUT.GO_TO_CATALOG)}
          onClick={() => client.catalog()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Columna izquierda: formulario */}
        <section className="space-y-8">
          <div>
            <Typography variant={TypographyVariant.HEADER} className="font-display mb-2">
              {t(TEXT.CHECKOUT.SECTION_DELIVERY)}
            </Typography>
            <Typography variant={TypographyVariant.BODY} textColor="text-neutral-500">
              {t(TEXT.CHECKOUT.SUBTITLE)}
            </Typography>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{t(TEXT.CHECKOUT.FIELD_NAME)}</label>
                <input
                  {...register('customer_name')}
                  placeholder={t(TEXT.CHECKOUT.FIELD_NAME_PLACEHOLDER)}
                  className={inputClass}
                />
                {errors.customer_name && (
                  <p className={errorClass}>{errors.customer_name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{t(TEXT.CHECKOUT.FIELD_WHATSAPP)}</label>
                <input
                  {...register('customer_whatsapp')}
                  type="tel"
                  placeholder={t(TEXT.CHECKOUT.FIELD_WHATSAPP_PLACEHOLDER)}
                  className={inputClass}
                />
                {errors.customer_whatsapp && (
                  <p className={errorClass}>{errors.customer_whatsapp.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>{t(TEXT.CHECKOUT.FIELD_ADDRESS)}</label>
              <textarea
                {...register('customer_address')}
                placeholder={t(TEXT.CHECKOUT.FIELD_ADDRESS_PLACEHOLDER)}
                className={`${inputClass} min-h-[100px] resize-none`}
              />
              {errors.customer_address && (
                <p className={errorClass}>{errors.customer_address.message}</p>
              )}
            </div>

            <div className="p-5 bg-neutral-50 rounded-2xl flex gap-4 items-start border border-neutral-100">
              <Truck className="text-neutral-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <Typography variant={TypographyVariant.BODY_BOLD}>
                  {t(TEXT.CHECKOUT.SHIPPING_NOTE)}
                </Typography>
                <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-500">
                  {t(TEXT.CHECKOUT.SHIPPING_CAPTION)}
                </Typography>
              </div>
            </div>

            {hasError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{t(TEXT.CHECKOUT.ERROR)}</p>
              </div>
            )}

            <Button
              type="submit"
              variant={ButtonVariant.PRIMARY}
              text={isPending ? t(TEXT.CHECKOUT.SUBMITTING) : t(TEXT.CHECKOUT.SUBMIT)}
              className="w-full h-14 text-lg"
              disabled={isPending}
            />
          </form>
        </section>

        {/* Columna derecha: resumen */}
        <aside className="space-y-8">
          <div className="bg-neutral-900 text-white rounded-3xl p-8 space-y-6 shadow-2xl">
            <Typography variant={TypographyVariant.SUBTITLE} className="text-white">
              {t(TEXT.CHECKOUT.SUMMARY_TITLE)}
            </Typography>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((cartItem) => (
                <div key={cartItem.id} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-[10px] text-neutral-400 font-bold">
                      {cartItem.quantity}x
                    </div>
                    <div>
                      <Typography
                        variant={TypographyVariant.BODY_SEMIBOLD}
                        className="text-sm text-white leading-tight"
                      >
                        {cartItem.product_name}
                      </Typography>
                      <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-400">
                        {cartItem.variant_detail}
                      </Typography>
                    </div>
                  </div>
                  <Typography variant={TypographyVariant.BODY_BOLD} className="text-sm text-white">
                    ${(cartItem.unit_price * cartItem.quantity).toLocaleString('es-CR')}
                  </Typography>
                </div>
              ))}
            </div>

            <div className="h-px bg-neutral-800 w-full" />

            <div className="flex justify-between items-end">
              <Typography variant={TypographyVariant.BODY} textColor="text-neutral-400">
                {t(TEXT.CHECKOUT.TOTAL_LABEL)}
              </Typography>
              <Typography variant={TypographyVariant.HEADER} className="text-white text-3xl">
                ${cartTotal.toLocaleString('es-CR')}
              </Typography>
            </div>
          </div>

          <div className="border border-neutral-100 rounded-3xl p-8 space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-neutral-400" />
              <Typography variant={TypographyVariant.BODY_BOLD}>
                {t(TEXT.CHECKOUT.PAYMENT_TITLE)}
              </Typography>
            </div>
            <Typography variant={TypographyVariant.CAPTION} textColor="text-neutral-500" className="leading-relaxed">
              {t(TEXT.CHECKOUT.PAYMENT_CAPTION)}
            </Typography>
          </div>
        </aside>

      </div>
    </div>
  );
}
