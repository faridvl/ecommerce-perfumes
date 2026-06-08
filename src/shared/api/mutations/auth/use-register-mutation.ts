import { ApiServiceClient } from '../../api-service-client';
import { AUTH_API_URL } from '../../config';
import { useApiMutation } from '../use-api-mutation';

export function useRegisterMutation() {
  const {
    mutate: executeRegister,
    isPending,
    error,
    reset,
  } = useApiMutation({
    mutationKey: ['registerUser'],
    mutationFn: (values: any) =>
      ApiServiceClient(AUTH_API_URL).post('/auth/register', values),
  });

  return {
    executeRegister,
    isPending,
    error,
    reset,
  };
}
