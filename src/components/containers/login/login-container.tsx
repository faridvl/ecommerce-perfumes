import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useLogin } from './use-login';

export function LoginContainer() {
  const { t } = useTranslation();
  const { form, isPending, hasError, handleSubmit } = useLogin();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-card border border-neutral-100">
        <div className="text-center mb-8">
          <Typography variant={TypographyVariant.SUBTITLE} className="mb-2">
            {t(TEXT.LOGIN.TITLE)}
          </Typography>
          <Typography variant={TypographyVariant.BODY} className="text-neutral-500">
            {t(TEXT.LOGIN.SUBTITLE)}
          </Typography>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              {t(TEXT.LOGIN.EMAIL_LABEL)}
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder={t(TEXT.LOGIN.EMAIL_PLACEHOLDER)}
              autoComplete="email"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-0.5">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700">
              {t(TEXT.LOGIN.PASSWORD_LABEL)}
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder={t(TEXT.LOGIN.PASSWORD_PLACEHOLDER)}
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-0.5">{errors.password.message}</p>
            )}
          </div>

          {hasError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{t(TEXT.LOGIN.ERROR_INVALID)}</p>
            </div>
          )}

          <Button
            variant={ButtonVariant.PRIMARY}
            className="w-full h-12 mt-2"
            text={isPending ? t(TEXT.LOGIN.SUBMITTING) : t(TEXT.LOGIN.SUBMIT)}
            type="submit"
            disabled={isPending}
          />
        </form>
      </div>
    </div>
  );
}
