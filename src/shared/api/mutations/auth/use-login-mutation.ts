import { LoginCredentials, LoginResponse } from '@/types/auth/auth';
import { ApiServiceClient } from '../../api-service-client';
import { useApiMutation } from '../use-api-mutation';
import { AUTH_API_URL } from '../../config';

export function useLoginMutation() {
  const {
    mutate: executeLogin,
    isPending,
    error,
    reset,
  } = useApiMutation<LoginResponse, LoginCredentials>({
    mutationKey: ['loginUser'],
    mutationFn: (credentials) =>
      ApiServiceClient(AUTH_API_URL).post('/auth/login', credentials),
  });

  return { executeLogin, isPending, error, reset };
}
