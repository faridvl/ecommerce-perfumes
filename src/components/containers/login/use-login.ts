import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '@/shared/api/mutations/auth/use-login-mutation';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { useNavigation } from '@/hooks/use-navigation';
import { LoginCredentials } from '@/types/auth/auth';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Ingresa un correo válido')
    .required('El correo es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

export function useLogin() {
  const { admin } = useNavigation();
  const { executeLogin, isPending, error, reset } = useLoginMutation();

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
