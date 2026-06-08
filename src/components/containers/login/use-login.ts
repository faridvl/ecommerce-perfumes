import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '@/shared/api/mutations/auth/use-login-mutation';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { useNavigation } from '@/hooks/use-navigation';
import { TEXT } from '@/static/texts/i18n';
import { LoginCredentials } from '@/types/auth/auth';

export function useLogin() {
  const { t } = useTranslation();
  const { admin } = useNavigation();
  const { executeLogin, isPending, error, reset } = useLoginMutation();

  const loginSchema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .email(t(TEXT.LOGIN.VALIDATION_EMAIL_VALID))
          .required(t(TEXT.LOGIN.VALIDATION_EMAIL_REQUIRED)),
        password: yup.string().required(t(TEXT.LOGIN.VALIDATION_PASSWORD_REQUIRED)),
      }),
    [t],
  );

  const form = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  function onValidSubmit(formValues: LoginCredentials) {
    reset();
    executeLogin(formValues, {
      onSuccess: (loginResponse) => {
        CookiesManager.setSession(loginResponse.accessToken, loginResponse.userName);
        admin.dashboard();
      },
    });
  }

  return {
    form,
    isPending,
    hasError: !!error,
    handleSubmit: form.handleSubmit(onValidSubmit),
  };
}
